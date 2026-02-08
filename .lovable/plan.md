

## Adicionar Imagens de Alta Qualidade aos Cards de Estética

### Visão Geral

Os cards de estética no quiz atualmente usam apenas gradientes como fundo. Para uma experiência mais visual e premium, vamos usar a **Lovable AI** para gerar imagens de alta qualidade que representem cada estética, e depois integrar essas imagens ao componente `AestheticPicker`.

---

### Estratégia de Imagens

#### Opção Escolhida: Geração via Lovable AI

Usaremos o modelo `google/gemini-2.5-flash-image` para gerar 6 imagens de moda de alta qualidade, uma para cada estética:

| Estética | Prompt de Geração |
|----------|-------------------|
| Old Money | Elegant fashion moodboard, beige cashmere sweater, pearl jewelry, neutral tones, luxury editorial style, soft lighting |
| Streetwear | Urban streetwear fashion, oversized hoodie, sneakers, city background, authentic street style photography |
| Minimalista | Minimalist fashion editorial, clean lines, monochromatic outfit, white background, architectural aesthetic |
| Boho-Chic | Bohemian fashion, flowing dress with prints, natural textures, outdoor golden hour, free-spirited vibe |
| Romântico | Romantic feminine fashion, lace details, floral patterns, soft pastel colors, dreamy aesthetic |
| Avant-Garde | Avant-garde fashion editorial, asymmetric design, sculptural silhouette, dramatic lighting, experimental |

---

### Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `src/data/quiz-aesthetics.ts` | Adicionar URLs das imagens geradas |
| `src/components/quiz/AestheticPicker.tsx` | Integrar `OptimizedImage` com fallback para gradiente |

---

### Implementação Técnica

#### 1. Criar Edge Function para Gerar Imagens

```typescript
// supabase/functions/generate-aesthetic-images/index.ts
// Gera imagens via Lovable AI e retorna URLs base64
```

#### 2. Opção Alternativa (Mais Simples): URLs Públicas

Para evitar complexidade, podemos usar **URLs de imagens stock** de alta qualidade de sites como Unsplash que são gratuitos e de uso livre:

```typescript
export const aesthetics: Aesthetic[] = [
  {
    id: 'old-money',
    name: 'Old Money',
    description: 'Luxo discreto e atemporal',
    keywords: ['tons neutros', 'cashmere', 'pérolas', 'alfaiataria'],
    gradient: 'from-amber-900/80 to-stone-800/80',
    imageUrl: 'https://images.unsplash.com/photo-xxx?w=400&q=80',
  },
  // ... outras estéticas
];
```

#### 3. Atualizar AestheticCard

```typescript
function AestheticCard({ aesthetic, ... }: AestheticCardProps) {
  return (
    <motion.button ...>
      {/* Imagem de fundo com fallback */}
      {aesthetic.imageUrl ? (
        <OptimizedImage
          src={aesthetic.imageUrl}
          alt={aesthetic.name}
          className="absolute inset-0 w-full h-full object-cover"
          aspectRatio="auto"
        />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', aesthetic.gradient)} />
      )}
      
      {/* Overlay gradiente para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      
      {/* Conteúdo mantido igual */}
      ...
    </motion.button>
  );
}
```

---

### URLs de Imagens Sugeridas (Unsplash)

Pesquisei imagens que representam cada estética:

| Estética | Descrição da Imagem | Unsplash Search |
|----------|---------------------|-----------------|
| Old Money | Pessoa elegante, tons neutros, ambiente clássico | "luxury fashion beige" |
| Streetwear | Street style urbano, tênis, moletom | "streetwear fashion" |
| Minimalista | Look clean, cores neutras, fundo simples | "minimal fashion" |
| Boho-Chic | Estilo boêmio, natureza, texturas | "bohemian fashion" |
| Romântico | Rendas, florais, tons pastel | "romantic feminine fashion" |
| Avant-Garde | Fashion experimental, formas incomuns | "avant garde fashion" |

---

### Benefícios

- **Visual Premium**: Imagens reais criam conexão emocional maior que gradientes
- **Carregamento Otimizado**: Uso do `OptimizedImage` com lazy loading e skeleton
- **Fallback Gracioso**: Gradiente mantido como backup se imagem falhar
- **Performance**: Parâmetros de URL (`w=400&q=80`) otimizam tamanho

---

### Passos de Implementação

1. Adicionar URLs de imagens Unsplash ao `quiz-aesthetics.ts`
2. Atualizar `AestheticPicker.tsx` para usar `OptimizedImage`
3. Ajustar overlay para garantir legibilidade do texto
4. Testar carregamento e fallback

