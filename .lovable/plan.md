

# DemoSection: Simulacao imersiva com 2 abas e imagens reais

## Visao geral

Reduzir a DemoSection para apenas **2 abas** (Colorimetria e Provador Virtual), cada uma com imagens de pessoas reais, simulacao de processamento por IA com etapas visiveis e resultados completos pre-definidos. Todos os CTAs e links levam a `/auth?mode=signup`.

---

## Aba 1: Colorimetria - "Descubra sua paleta pessoal"

### Fluxo do usuario

```text
[Foto mulher clara] [Foto mulher media] [Foto mulher escura]
           |
     Clique na foto
           |
   +-------v--------+
   | "Analisando..."  |
   | Barra progresso  |
   | Etapa 1: Pele    |
   | Etapa 2: Olhos   |
   | Etapa 3: Cabelo  |
   | Etapa 4: Paleta  |
   +-------+--------+
           | (4 segundos)
   +-------v--------+
   | RESULTADO COMPLETO|
   | - Estacao + subtipo|
   | - Foto do rosto   |
   | - Pele/Olhos/Cabelo|
   | - 12 cores ideais |
   | - 4 cores evitar  |
   | - Confianca 94%   |
   | - Explicacao IA   |
   +------------------+
```

### Detalhes

- 3 fotos de mulheres reais (URLs de fotos stock do Unsplash, rostos diversos)
- Ao clicar, simulacao de loading com 4 etapas animadas sequenciais (total ~4s):
  - "Detectando tom de pele..." (1s)
  - "Analisando cor dos olhos..." (1s)
  - "Identificando subtom do cabelo..." (1s)
  - "Gerando paleta personalizada..." (1s)
- Resultado completo com:
  - Foto da modelo selecionada com borda da cor da estacao
  - Badge "Primavera Clara" / "Outono Quente" / "Inverno Profundo"
  - Confianca (ex: 94%)
  - Deteccao: tom de pele, cor dos olhos, cor do cabelo
  - Explicacao contextual (texto pre-definido)
  - Grid de 12 cores recomendadas com nomes
  - Grid de 4 cores para evitar com X
- CTA: "Descobrir minha paleta real" -> /auth?mode=signup

### Dados pre-definidos (3 perfis)

**Perfil Claro**: Primavera Clara, confianca 94%, pele porcelana rosada, olhos azul-esverdeados, cabelo loiro claro. 12 cores ideais + 4 evitar.

**Perfil Medio**: Outono Quente, confianca 91%, pele oliva dourada, olhos castanho-mel, cabelo castanho medio. 12 cores ideais + 4 evitar.

**Perfil Escuro**: Inverno Profundo, confianca 96%, pele ebano quente, olhos castanho escuro, cabelo preto. 12 cores ideais + 4 evitar.

---

## Aba 2: Provador Virtual - "Experimente antes de comprar"

### Fluxo do usuario

```text
[Foto modelo de corpo inteiro]
          +
[Vestido floral] [Blazer preto] [Camisa branca]
          |
    Clique na peca
          |
  +-------v---------+
  | "Processando..."  |
  | Barra progresso   |
  | Etapa 1: Corpo    |
  | Etapa 2: Peca     |
  | Etapa 3: Ajuste   |
  | Etapa 4: Luz      |
  | ~15-20s simulado  |
  +-------+---------+
          |
  +-------v---------+
  | ANTES  |  DEPOIS |
  | (foto  | (foto   |
  | orig)  | c/roupa)|
  | Harmonia: 92%    |
  +------------------+
```

### Detalhes

- Foto de modelo de corpo inteiro (stock Unsplash)
- 3 opcoes de roupa com fotos reais (thumbnails de pecas de roupa)
- Loading mais longo (~8s simulado) com barra de progresso e etapas:
  - "Detectando silhueta corporal..." (2s)
  - "Mapeando a peca selecionada..." (2s)
  - "Ajustando caimento e proporcoes..." (2s)
  - "Refinando iluminacao e sombras..." (2s)
- Resultado com comparacao antes/depois lado a lado:
  - Foto original da modelo a esquerda
  - Foto da modelo com roupa similar a direita (foto stock diferente da mesma modelo ou similar)
  - Overlay animado de sparkles
- Badge de harmonia cromatica (vinculado a aba de colorimetria se ja interagiu)
- Tempo exibido: "Processado em 18s"
- CTA: "Experimentar com minha foto" -> /auth?mode=signup

---

## Mudancas estruturais

### Header da secao
- Titulo: "Experimente agora"
- Subtitulo: "Veja como a IA do Ethra analisa suas cores e experimenta roupas para voce"
- Badge: "Simulacao interativa"
- Apenas 2 abas no TabsList (grid-cols-2)

### CTA inferior
- Texto dinamico baseado em interacoes (0, 1, 2 abas)
- Contador: "Voce explorou X de 2 recursos"

### Imagens
- Todas as imagens vem de URLs do Unsplash (fotos reais de pessoas diversas)
- Imagens otimizadas via parametros de URL do Unsplash (?w=400&q=80)
- Fallback com skeleton/placeholder caso imagem nao carregue

---

## Arquivos modificados

### 1. `src/components/landing/demo/ChromaticSim.tsx` (reescrita completa)
- Substituir circulos de tom de pele por fotos reais de mulheres
- Adicionar simulacao de loading com 4 etapas animadas
- Resultado completo com 12 cores + 4 evitar + explicacao + deteccao
- CTA funcional para /auth?mode=signup

### 2. `src/components/landing/demo/TryOnSim.tsx` (reescrita completa)
- Substituir emojis por fotos reais de roupas e modelo
- Adicionar loading longo com barra de progresso e etapas
- Resultado com comparacao antes/depois usando fotos reais
- Badge de harmonia + tempo de processamento
- CTA funcional para /auth?mode=signup

### 3. `src/components/landing/DemoSection.tsx` (ajustar)
- Remover abas Closet e Malas
- Ajustar grid-cols-4 para grid-cols-2
- Ajustar textos e contador de "4 recursos" para "2 recursos"
- Atualizar CTA_TEXTS para 3 niveis (0, 1, 2)

### 4. `src/components/landing/demo/ClosetSim.tsx` (deletar)
### 5. `src/components/landing/demo/PackingSim.tsx` (deletar)

## Total: 3 arquivos reescritos/editados + 2 deletados

