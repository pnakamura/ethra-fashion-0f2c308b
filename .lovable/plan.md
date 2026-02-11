

# Melhorias de UX para /wardrobe

## Problemas identificados

1. **Empty state generico e pouco atrativo** -- Quando o closet esta vazio, exibe apenas um texto simples e um botao. Nao orienta o usuario nem comunica valor.
2. **Acoes de editar/excluir so aparecem no hover** -- No mobile, o usuario nao tem hover; precisa de um toque longo ou gesto nao descoberto para acessar editar/excluir. Isso torna as acoes praticamente invisiveis.
3. **Sem busca** -- Com muitas pecas, nao ha como filtrar por nome ou categoria rapidamente (o filtro de compatibilidade existe, mas nao busca textual).
4. **Sem feedback visual de categoria** -- Os cards mostram nome e categoria como texto, mas nao ha icones visuais para diferenciar rapidamente tipos de pecas (roupa, calcado, acessorio, joia).
5. **Sem contadores nos filtros** -- O dropdown de filtro por compatibilidade nao mostra quantas pecas cada filtro possui.
6. **Header do closet nao mostra resumo util** -- Poderia incluir um resumo rapido de compatibilidade (ex: "12 ideais, 5 neutras, 2 evitar").

## Solucao proposta

### 1. Empty state rico e animado
Substituir o texto simples por um componente visual com:
- Ilustracao SVG inline de um closet aberto
- Titulo acolhedor: "Seu closet esta esperando"
- Subtexto orientador: "Adicione suas pecas favoritas e descubra combinacoes perfeitas com IA"
- CTA principal: "Adicionar primeira peca"
- Dica secundaria: "Dica: tire uma foto e a IA analisa as cores automaticamente"

### 2. Acoes sempre visiveis no mobile
Manter o overlay de hover no desktop, mas adicionar um botao de tres pontos (MoreVertical) **sempre visivel** no canto inferior direito do card no mobile. Usar o hook `useIsMobile` para controlar a visibilidade.

### 3. Barra de busca
Adicionar um campo de busca acima do grid que filtra por nome e categoria em tempo real. Fica oculto quando ha menos de 6 itens para nao poluir a tela.

### 4. Chips de categoria com icones
Adicionar uma barra horizontal de filtros por categoria (Roupas, Calcados, Acessorios, Joias) como chips com icones do Lucide antes do grid. Combinavel com o filtro de compatibilidade existente.

### 5. Contadores nos filtros de compatibilidade
Exibir a contagem de itens ao lado de cada opcao no dropdown (ex: "Ideais (12)").

### 6. Resumo de compatibilidade no header
Abaixo do subtitulo "X itens", exibir mini-badges coloridos mostrando a distribuicao: circulos verde/amarelo/vermelho com numeros.

## Arquivos modificados

### `src/pages/Wardrobe.tsx`
- Adicionar estado de busca textual e filtro de categoria
- Combinar busca + filtro de categoria + filtro de compatibilidade
- Adicionar barra de busca condicional (>= 6 itens)
- Adicionar chips de categoria horizontal
- Adicionar resumo de compatibilidade no header
- Adicionar contadores ao dropdown de compatibilidade
- Substituir empty state generico por componente rico

### `src/components/wardrobe/WardrobeGrid.tsx`
- Tornar botao de acoes (MoreVertical) sempre visivel no mobile
- Importar e usar `useIsMobile`

## Detalhes tecnicos

- Busca: filtro local via `useState` + `.filter()` sobre os items ja carregados (sem chamadas ao backend)
- Categorias: derivadas dinamicamente dos itens existentes com `new Set()`
- Icones de categoria: mapeamento `{ 'Roupas': Shirt, 'Calcados': Footprints, 'Acessorios': Glasses, 'Joias': Gem }` do Lucide
- Mobile detection: usar `useIsMobile()` de `src/hooks/use-mobile.tsx`
- Animacoes: Framer Motion stagger nos chips e no empty state
- Nenhuma dependencia nova necessaria
- Nenhuma alteracao no banco de dados

