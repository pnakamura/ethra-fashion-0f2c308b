-- Function to calculate chromatic compatibility based on color analysis
CREATE OR REPLACE FUNCTION public.calculate_chromatic_compatibility(
  p_dominant_colors JSONB,
  p_color_analysis JSONB
) RETURNS TEXT AS $$
DECLARE
  v_color JSONB;
  v_color_name TEXT;
  v_recommended TEXT[];
  v_avoid TEXT[];
  v_ideal_score FLOAT := 0;
  v_avoid_score FLOAT := 0;
  v_total_weight FLOAT := 0;
  v_weight FLOAT;
  v_is_recommended BOOLEAN;
  v_is_avoided BOOLEAN;
BEGIN
  -- Return 'unknown' if no analysis or colors
  IF p_dominant_colors IS NULL OR p_color_analysis IS NULL THEN
    RETURN 'unknown';
  END IF;
  
  -- Extract recommended and avoid colors arrays
  SELECT ARRAY(SELECT jsonb_array_elements_text(p_color_analysis->'recommended_colors')) INTO v_recommended;
  SELECT ARRAY(SELECT jsonb_array_elements_text(p_color_analysis->'avoid_colors')) INTO v_avoid;
  
  -- If no color guidance, return neutral
  IF v_recommended IS NULL AND v_avoid IS NULL THEN
    RETURN 'neutral';
  END IF;
  
  -- Process each dominant color
  FOR v_color IN SELECT * FROM jsonb_array_elements(p_dominant_colors)
  LOOP
    v_color_name := LOWER(v_color->>'name');
    v_weight := COALESCE((v_color->>'percentage')::FLOAT, 33) / 100;
    v_total_weight := v_total_weight + v_weight;
    
    -- Check if color is in avoid list (case-insensitive partial match)
    v_is_avoided := FALSE;
    IF v_avoid IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM unnest(v_avoid) AS avoid_color 
        WHERE v_color_name ILIKE '%' || avoid_color || '%' 
           OR avoid_color ILIKE '%' || v_color_name || '%'
      ) INTO v_is_avoided;
    END IF;
    
    IF v_is_avoided THEN
      v_avoid_score := v_avoid_score + v_weight;
      CONTINUE;
    END IF;
    
    -- Check if color is in recommended list
    v_is_recommended := FALSE;
    IF v_recommended IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM unnest(v_recommended) AS rec_color 
        WHERE v_color_name ILIKE '%' || rec_color || '%' 
           OR rec_color ILIKE '%' || v_color_name || '%'
      ) INTO v_is_recommended;
    END IF;
    
    IF v_is_recommended THEN
      v_ideal_score := v_ideal_score + v_weight;
    ELSE
      -- Partial credit for non-avoided colors
      v_ideal_score := v_ideal_score + (v_weight * 0.3);
    END IF;
  END LOOP;
  
  -- Normalize scores
  IF v_total_weight > 0 THEN
    v_ideal_score := v_ideal_score / v_total_weight;
    v_avoid_score := v_avoid_score / v_total_weight;
  END IF;
  
  -- Decision logic
  IF v_avoid_score > 0.5 THEN
    RETURN 'avoid';
  ELSIF v_avoid_score > 0.3 AND v_ideal_score < 0.3 THEN
    RETURN 'avoid';
  ELSIF v_ideal_score > 0.5 THEN
    RETURN 'ideal';
  ELSIF v_ideal_score > 0.2 THEN
    RETURN 'neutral';
  ELSE
    RETURN 'neutral';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- Function to recalculate all wardrobe items for a user
CREATE OR REPLACE FUNCTION public.recalculate_user_wardrobe_compatibility()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run if color_analysis changed
  IF OLD.color_analysis IS DISTINCT FROM NEW.color_analysis THEN
    UPDATE public.wardrobe_items
    SET chromatic_compatibility = public.calculate_chromatic_compatibility(
      dominant_colors,
      NEW.color_analysis
    )
    WHERE user_id = NEW.user_id
      AND dominant_colors IS NOT NULL;
    
    RAISE LOG 'Recalculated compatibility for user % wardrobe items', NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_recalculate_wardrobe_compatibility ON public.profiles;
CREATE TRIGGER trigger_recalculate_wardrobe_compatibility
  AFTER UPDATE OF color_analysis ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_user_wardrobe_compatibility();

-- Also calculate compatibility when a new item is inserted with dominant_colors
CREATE OR REPLACE FUNCTION public.calculate_new_item_compatibility()
RETURNS TRIGGER AS $$
DECLARE
  v_color_analysis JSONB;
BEGIN
  -- Only calculate if dominant_colors is provided
  IF NEW.dominant_colors IS NOT NULL THEN
    -- Get user's color analysis
    SELECT color_analysis INTO v_color_analysis
    FROM public.profiles
    WHERE user_id = NEW.user_id;
    
    -- Calculate and set compatibility
    NEW.chromatic_compatibility := public.calculate_chromatic_compatibility(
      NEW.dominant_colors,
      v_color_analysis
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new items
DROP TRIGGER IF EXISTS trigger_calculate_item_compatibility ON public.wardrobe_items;
CREATE TRIGGER trigger_calculate_item_compatibility
  BEFORE INSERT OR UPDATE OF dominant_colors ON public.wardrobe_items
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_new_item_compatibility();