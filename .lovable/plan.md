
# Armario Capsula -- Estrategia de Implementacao

## O que e um Armario Capsula

Um armario capsula e uma colecao curada de pecas versateis (tipicamente 30-40 itens) que se combinam entre si, reduzindo decisoes diarias e maximizando looks com menos pecas. O conceito se alinha perfeitamente ao sistema existente de compatibilidade cromatica e recomendacoes de looks do app.

## Visao Geral da Implementacao

A funcionalidade sera integrada como uma **nova aba/secao dentro da pagina /wardrobe**, nao como uma pagina separada. Isso mantem o closet como hub central e evita fragmentacao da navegacao.

## Estrutura da Feature

### 1. Secao Educativa + Guia (Capsule Guide)

Um componente colapsavel no topo do closet que aparece quando o usuario ainda nao tem itens marcados como capsula. Contem:

- **O que e**: Explicacao visual com ilustracao (3-4 sentencas)
- **Como montar**: Lista de 5 passos simples
  1. Escolha 30-40 pecas versateis do seu closet
  2. Priorize pecas com compatibilidade "ideal" (badge verde)
  3. Inclua basicos neutros + pecas-destaque
  4. Garanta cobertura de categorias (roupas, calcados, acessorios)
  5. A IA sugere pecas que faltam para completar
- **Como usar no app**: Marque pecas como "capsula" e o sistema prioriza essas pecas nas sugestoes de looks

### 2. Toggle "Capsula" nas Pecas

Adicionar um campo `is_capsule` (boolean) na tabela `wardrobe_items`. Cada peca podera ser marcada/desmarcada como parte da capsula atraves de:

- Um chip/badge no card da peca (icone de diamante/estrela)
- Uma opcao "Adicionar a Capsula" no menu de tres pontos do WardrobeGrid
- Toggle rapido no EditItemSheet

### 3. Filtro e Visualizacao da Capsula

- Novo chip de filtro "Capsula" na barra de categorias (com icone `Diamond`)
- Contador de itens capsula no header
- Barra de progresso visual mostrando cobertura de categorias (ex: "Roupas 12/15, Calcados 2/4, Acessorios 3/5")

### 4. Analise de Cobertura (Capsule Health)

Um card de "saude da capsula" mostrando:
- Total de itens na capsula vs meta (ex: 28/35)
- Distribuicao por categoria (barras de progresso)
- Score de compatibilidade cromatica media (% de itens ideais)
- Pecas sugeridas para completar gaps (ex: "Falta um sapato neutro")

### 5. Integracao com Looks e Recomendacoes

- O edge function `suggest-looks` recebera um parametro opcional `capsule_only: true` para gerar looks usando apenas pecas da capsula
- Na pagina /recommendations, um toggle "Apenas Capsula" filtra looks para usar somente pecas marcadas
- O "Look do Dia" no dashboard priorizara pecas da capsula

### 6. Integracao com Viagens (Voyager)

- No planejador de viagens, opcao de "Empacotar da Capsula" que sugere itens da capsula adequados ao destino

## Detalhes Tecnicos

### Migracao do Banco de Dados

```text
ALTER TABLE wardrobe_items
  ADD COLUMN is_capsule boolean DEFAULT false;
```

### Arquivos Novos

| Arquivo | Descricao |
|---|---|
| `src/components/wardrobe/CapsuleGuide.tsx` | Componente educativo colapsavel com explicacao do conceito, passos e como usar no app |
| `src/components/wardrobe/CapsuleHealthCard.tsx` | Card de analise mostrando progresso, cobertura por categoria e score cromatico |
| `src/components/wardrobe/CapsuleSuggestions.tsx` | Lista de sugestoes de pecas que faltam para completar a capsula |

### Arquivos Modificados

| Arquivo | Mudanca |
|---|---|
| `src/pages/Wardrobe.tsx` | Adicionar aba/view "Capsula" com Tabs (Todas / Capsula), integrar CapsuleGuide, CapsuleHealthCard, filtro de capsula, toggle de capsula |
| `src/components/wardrobe/WardrobeGrid.tsx` | Adicionar badge de capsula nos cards, opcao "Capsula" no DropdownMenu |
| `src/hooks/useWardrobeItems.ts` | Adicionar campo `is_capsule` ao tipo WardrobeItem, helper `capsuleItems`, `capsuleCount` |
| `src/components/wardrobe/EditItemSheet.tsx` | Adicionar toggle "Peca Capsula" ao formulario |
| `supabase/functions/suggest-looks/index.ts` | Aceitar parametro `capsule_only` para filtrar pecas |
| `src/hooks/useLookRecommendations.ts` | Propagar flag `capsule_only` para o edge function |
| `src/pages/Recommendations.tsx` | Adicionar toggle "Apenas Capsula" |
| `src/data/missions.ts` | Adicionar missao "Capsula Completa" (marcar 30 pecas como capsula) |

### Fluxo do Usuario

```text
1. Usuario abre /wardrobe
2. Ve o CapsuleGuide (colapsavel) explicando o conceito
3. Marca pecas como "capsula" via menu ou badge
4. Ativa filtro "Capsula" para ver so pecas marcadas
5. CapsuleHealthCard mostra progresso e gaps
6. Em /recommendations, ativa "Apenas Capsula" para looks focados
7. No dashboard, Look do Dia prioriza pecas capsula
```

### UX e Design

- Badge da capsula: icone `Diamond` com fundo dourado sutil, consistente com o design system de luxo
- CapsuleGuide: accordion com animacao Framer Motion, ilustracao SVG inline
- CapsuleHealthCard: card com gradiente sutil, barras de progresso por categoria usando cores do design system
- Toggle "Apenas Capsula" nas recomendacoes: switch inline no header da secao
