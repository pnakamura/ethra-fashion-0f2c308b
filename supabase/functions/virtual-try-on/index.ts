import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { avatarImageUrl, garmentImageUrl, category, tryOnResultId, demoMode, retryCount = 0 } = body;

    // Demo mode: skip auth and DB persistence
    let userId = "demo-user";
    
    if (!demoMode) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("No authorization header");
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", "")
      );

      if (authError || !user) {
        throw new Error("Unauthorized");
      }
      userId = user.id;
    }

    console.log("Virtual Try-On request:", {
      userId,
      category,
      tryOnResultId,
      demoMode: !!demoMode,
      retryCount,
      hasAvatar: !!avatarImageUrl,
      hasGarment: !!garmentImageUrl,
    });

    if (!avatarImageUrl || !garmentImageUrl) {
      return new Response(
        JSON.stringify({ error: "Avatar image and garment image are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Update status to processing (skip for demo mode)
    if (tryOnResultId && !demoMode) {
      await supabase
        .from("try_on_results")
        .update({ status: "processing" })
        .eq("id", tryOnResultId);
    }

    const startTime = Date.now();

    // Validate image URLs before calling the model
    const validateImageUrl = async (url: string, name: string): Promise<void> => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type') || '';
        const contentLength = response.headers.get('content-length');
        
        console.log(`${name} validation - Status: ${response.status}, ContentType: ${contentType}, Size: ${contentLength}`);
        
        if (!response.ok) {
          throw new Error(`A imagem do ${name} não está acessível (${response.status})`);
        }
        
        if (!contentType.startsWith('image/')) {
          throw new Error(`A URL do ${name} não parece ser uma imagem válida`);
        }
        
        // Check minimum size (e.g., 5KB to avoid tiny/icon images)
        if (contentLength && parseInt(contentLength) < 5000) {
          console.warn(`${name} image seems very small: ${contentLength} bytes`);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('imagem')) {
          throw error;
        }
        console.error(`Failed to validate ${name}:`, error);
        // Don't fail on validation errors, let the model handle it
      }
    };

    // Validate both images
    await Promise.all([
      validateImageUrl(avatarImageUrl, 'avatar'),
      validateImageUrl(garmentImageUrl, 'peça'),
    ]);

    // Helper to wait between retries (for rate limiting)
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Virtual try-on prompt template
    const getTryOnPrompt = (quality: 'fast' | 'balanced' | 'premium') => {
      const basePrompt = `You are an expert virtual try-on AI creating fashion photography.

TASK: Seamlessly dress the person in the FIRST image with the garment from the SECOND image.

ABSOLUTE REQUIREMENTS:
1. OUTPUT MUST BE VERTICAL (PORTRAIT) - Same orientation as the person photo
2. FULL BODY: Show complete person HEAD TO FEET - never crop head or face
3. EXACT ASPECT RATIO: Match the first image dimensions precisely
4. PRESERVE IDENTITY: Keep face, hair, skin tone, body shape, pose unchanged
5. NATURAL FIT: The garment should look naturally worn, not pasted on
6. PHOTOREALISTIC: Professional fashion photography quality

CRITICAL: Output a SINGLE image with VERTICAL orientation matching the input person photo.`;

      if (quality === 'premium') {
        return basePrompt + `

PREMIUM QUALITY REQUIREMENTS:
- Ultra-high resolution output
- Perfect fabric texture and draping
- Accurate lighting and shadows
- Flawless blend between garment and body
- Studio-quality fashion photography finish`;
      }
      
      if (quality === 'balanced') {
        return basePrompt + `

QUALITY REQUIREMENTS:
- High resolution output
- Good fabric texture rendering
- Natural lighting integration
- Professional photography quality`;
      }

      return basePrompt;
    };

    // Gemini 2.5 Flash (fast, first attempt)
    const callGeminiFlash = async (): Promise<string | null> => {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        console.log("LOVABLE_API_KEY not configured, skipping Gemini Flash");
        return null;
      }

      console.log("Calling Gemini 2.5 Flash (fast model)...");

      const response = await fetch(LOVABLE_AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: getTryOnPrompt('fast') },
                { type: "image_url", image_url: { url: avatarImageUrl } },
                { type: "image_url", image_url: { url: garmentImageUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini Flash error:", response.status, errorText);
        throw new Error(`Gemini Flash error: ${response.status}`);
      }

      return extractImageFromResponse(await response.json(), "Gemini Flash");
    };

    // Gemini 2.5 Pro (balanced, second attempt)
    const callGeminiPro = async (): Promise<string | null> => {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        console.log("LOVABLE_API_KEY not configured, skipping Gemini Pro");
        return null;
      }

      console.log("Calling Gemini 2.5 Pro (balanced model)...");

      const response = await fetch(LOVABLE_AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: getTryOnPrompt('balanced') },
                { type: "image_url", image_url: { url: avatarImageUrl } },
                { type: "image_url", image_url: { url: garmentImageUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini Pro error:", response.status, errorText);
        throw new Error(`Gemini Pro error: ${response.status}`);
      }

      return extractImageFromResponse(await response.json(), "Gemini Pro");
    };

    // Gemini 3 Pro Image Preview (premium, third attempt)
    const callGeminiPremium = async (): Promise<string | null> => {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        console.log("LOVABLE_API_KEY not configured, skipping Gemini Premium");
        return null;
      }

      console.log("Calling Gemini 3 Pro Image Preview (premium model)...");

      const response = await fetch(LOVABLE_AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: getTryOnPrompt('premium') },
                { type: "image_url", image_url: { url: avatarImageUrl } },
                { type: "image_url", image_url: { url: garmentImageUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini Premium error:", response.status, errorText);
        throw new Error(`Gemini Premium error: ${response.status}`);
      }

      return extractImageFromResponse(await response.json(), "Gemini Premium");
    };

    // Helper to extract image from Lovable AI response
    const extractImageFromResponse = (data: any, modelName: string): string | null => {
      console.log(`${modelName} response:`, JSON.stringify(data).slice(0, 500));

      const choice = data.choices?.[0];
      const message = choice?.message;
      
      // Format 1: images array
      const imageFromArray = message?.images?.[0]?.image_url?.url;
      if (imageFromArray) {
        console.log(`${modelName} returned image via images array`);
        return imageFromArray;
      }

      // Format 2: content array with image_url
      if (Array.isArray(message?.content)) {
        for (const part of message.content) {
          if (part.type === "image_url" && part.image_url?.url) {
            console.log(`${modelName} returned image via content array`);
            return part.image_url.url;
          }
        }
      }

      // Format 3: inline_data in content
      if (Array.isArray(message?.content)) {
        for (const part of message.content) {
          if (part.type === "image" && part.inline_data?.data) {
            const mimeType = part.inline_data.mime_type || "image/png";
            const base64Url = `data:${mimeType};base64,${part.inline_data.data}`;
            console.log(`${modelName} returned image via inline_data`);
            return base64Url;
          }
        }
      }

      console.log(`${modelName} did not return an image in expected format`);
      return null;
    };

    // Get target model based on retry count
    const getTargetModel = (retry: number): 'flash' | 'pro' | 'premium' => {
      switch (retry) {
        case 0: return 'flash';
        case 1: return 'pro';
        case 2:
        default: return 'premium';
      }
    };

    const targetModel = getTargetModel(retryCount);
    console.log(`Target model for retry ${retryCount}: ${targetModel}`);

    try {
      let output: string | null = null;
      let usedModel = 'unknown';

      // Progressive model escalation with cascading fallback
      const tryWithCascadingFallback = async () => {
        // Determine starting point based on retryCount
        const modelsToTry: Array<{ name: string; fn: () => Promise<string | null>; label: string }> = [];

        if (targetModel === 'flash') {
          modelsToTry.push(
            { name: 'gemini-2.5-flash', fn: callGeminiFlash, label: 'Flash' },
            { name: 'gemini-2.5-pro', fn: callGeminiPro, label: 'Pro' },
            { name: 'gemini-3-pro-image-preview', fn: callGeminiPremium, label: 'Premium' }
          );
        } else if (targetModel === 'pro') {
          modelsToTry.push(
            { name: 'gemini-2.5-pro', fn: callGeminiPro, label: 'Pro' },
            { name: 'gemini-3-pro-image-preview', fn: callGeminiPremium, label: 'Premium' }
          );
        } else {
          modelsToTry.push(
            { name: 'gemini-3-pro-image-preview', fn: callGeminiPremium, label: 'Premium' }
          );
        }

        for (const model of modelsToTry) {
          try {
            console.log(`Trying ${model.name}...`);
            const result = await model.fn();
            if (result) {
              output = result;
              usedModel = model.name;
              console.log(`${model.name} succeeded!`);
              return;
            }
            console.log(`${model.name} returned null, trying next...`);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.log(`${model.name} failed: ${errorMsg}`);
            
            // Add delay before trying next model
            await sleep(1000);
          }
        }
      };

      await tryWithCascadingFallback();

      const processingTime = Date.now() - startTime;
      console.log(`${usedModel} completed in`, processingTime, "ms");

      // The output is the URL of the generated image
      const resultImageUrl = output;
      
      if (!resultImageUrl) {
        throw new Error("Nenhum modelo conseguiu gerar a imagem. Verifique se a foto do avatar mostra uma pessoa de corpo inteiro.");
      }

      // Update the try_on_results record (skip for demo mode)
      if (tryOnResultId && !demoMode) {
        await supabase
          .from("try_on_results")
          .update({
            status: "completed",
            result_image_url: resultImageUrl,
            processing_time_ms: processingTime,
            model_used: usedModel,
            retry_count: retryCount,
          })
          .eq("id", tryOnResultId);
      }

      return new Response(
        JSON.stringify({
          success: true,
          resultImageUrl,
          processingTimeMs: processingTime,
          model: usedModel,
          retryCount,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (modelError) {
      const processingTime = Date.now() - startTime;
      const errorMsg = modelError instanceof Error ? modelError.message : String(modelError);
      console.error("Virtual try-on model error:", errorMsg);
      
      // Provide user-friendly error messages
      let userMessage = "Falha ao processar prova virtual.";
      const isRateLimit = errorMsg.includes("429") || errorMsg.includes("Too Many Requests") || errorMsg.includes("rate limit");

      if (errorMsg.includes("Failed to process") || errorMsg.includes("Nenhum modelo")) {
        userMessage = "Não foi possível processar a imagem. Use uma foto de corpo inteiro com boa iluminação e fundo simples.";
      } else if (errorMsg.includes("402") || errorMsg.includes("credits")) {
        userMessage = "Créditos insuficientes no serviço de IA. Tente novamente em alguns minutos.";
      } else if (isRateLimit) {
        userMessage = "Limite de requisições atingido. Aguarde alguns segundos e tente novamente.";
      } else if (errorMsg.includes("imagem")) {
        userMessage = errorMsg; // Already a user-friendly message from validation
      }
      
      // Update status to failed (skip for demo mode)
      if (tryOnResultId && !demoMode) {
        await supabase
          .from("try_on_results")
          .update({ 
            status: "failed", 
            error_message: userMessage,
            processing_time_ms: processingTime,
            model_used: 'failed',
            retry_count: retryCount,
          })
          .eq("id", tryOnResultId);
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: userMessage,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: isRateLimit ? 429 : 400,
        }
      );
    }
  } catch (error) {
    console.error("Virtual try-on error:", error);
    const errorMessage = error instanceof Error ? error.message : "Falha ao processar prova virtual";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
