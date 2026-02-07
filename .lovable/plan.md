
## Analise Completa: Rota /canvas

### Arquitetura Atual

```text
Canvas.tsx (Pagina)
├── Header
├── Tabs (Criar Look | Salvos)
│   ├── LookCanvas (aba Criar)
│   │   ├── Canvas Area (area de drag-and-drop)
│   │   ├── Botoes de Acao (Limpar, Salvar)
│   │   └── Seletor de Pecas (scroll horizontal)
│   └── SavedLooksGallery (aba Salvos)
│       ├── Filtros (Todos | Favoritos)
│       └── Grid de SavedLookCard
├── ShareLookModal
└── BottomNav
```

---

### PROBLEMA CRITICO: Drag Nao Funciona Corretamente

**Localizacao:** `src/components/canvas/LookCanvas.tsx`, linhas 104-106

**Causa Raiz:** O codigo atual usa `info.point.x` e `info.point.y` do framer-motion, que retornam coordenadas **relativas ao viewport** (tela inteira), nao ao container do canvas.

**Codigo Problematico:**
```typescript
onDrag={(_, info) => {
  handleDrag(item.id, info.point.x, info.point.y);
}}
```

Quando o usuario arrasta um item, a posicao e calculada com base na posicao do ponteiro na tela, nao dentro da area do canvas. Isso causa:
- Itens "pulando" para posicoes erradas
- Itens saindo do canvas visivel
- Comportamento inconsistente entre dispositivos

**Solucao:** Usar `info.offset` combinado com a posicao inicial do item, ou calcular posicao relativa ao container.

---

### Funcionalidades Existentes

| Funcionalidade | Status | Observacoes |
|----------------|--------|-------------|
| Adicionar peca ao canvas | OK | Click para adicionar com posicao aleatoria |
| Arrastar pecas | BUG | Coordenadas erradas (viewport vs container) |
| Remover peca individual | OK | Botao X no hover |
| Limpar canvas | OK | Remove todos os itens |
| Salvar look | OK | Gera thumbnail e persiste no DB |
| Galeria de salvos | OK | Grid responsivo com filtros |
| Favoritar look | OK | Toggle com invalidacao de cache |
| Excluir look | OK | Remove do banco |
| Compartilhar look | OK | Gera imagem e usa Web Share API |
| Abrir look salvo no canvas | OK | Preload de itens |

---

### Problemas de UX Identificados

#### 1. Drag-and-Drop Quebrado (Critico)
- Coordenadas erradas ao arrastar
- Nenhum limite de movimento (itens podem sair do canvas)
- Sem feedback visual durante o arrasto no mobile

#### 2. Falta de Drag Constraints
- Itens podem ser arrastados para fora do canvas
- Nao ha indicacao visual dos limites

#### 3. Mobile Touch Experience
- Nao ha `touch-action: none` para prevenir scroll durante drag
- Botao de remover so aparece no hover (inacessivel em mobile)
- Sem gestos de pinch-to-zoom para redimensionar

#### 4. Estado Vazio Pouco Claro
- Mensagem diz "Arraste pecas" mas nao ha drag externo
- Na verdade, usuario deve CLICAR nas pecas para adicionar

#### 5. Console Warning
- TooltipProvider dentro de SavedLookCard gera warning de ref

---

### Integracao com Banco de Dados

**Tabela:** `outfits`

| Coluna | Uso |
|--------|-----|
| items | Array de UUIDs das pecas (separador `:::` para IDs unicos no canvas) |
| thumbnail_url | Base64 gerado via Canvas API |
| is_favorite | Boolean para filtro de favoritos |
| shared_at | Timestamp do ultimo compartilhamento |

**Fluxo de Salvamento:**
1. Extrai IDs originais dos itens (remove sufixo `:::timestamp`)
2. Remove duplicatas
3. Gera thumbnail via `generateLookThumbnail()`
4. Insere no banco com `user_id`

---

### Plano de Correcao

#### Fase 1: Corrigir Drag (Critico)

**Arquivo:** `src/components/canvas/LookCanvas.tsx`

**Mudancas:**
1. Adicionar `dragConstraints` referenciando o container
2. Mudar de `info.point` para `info.offset` + posicao inicial
3. Adicionar `touch-action: none` no canvas para mobile
4. Usar `onDragEnd` em vez de `onDrag` para atualizar estado (performance)

**Codigo Corrigido:**
```typescript
// Adicionar ref para constraints
const containerRef = useRef<HTMLDivElement>(null);

// Guardar posicao inicial ao comecar drag
const initialPos = useRef({ x: 0, y: 0 });

<motion.div
  drag
  dragConstraints={containerRef}
  dragMomentum={false}
  dragElastic={0.1}
  onDragStart={() => {
    initialPos.current = { x: item.x, y: item.y };
    setDraggedItem(item.id);
  }}
  onDragEnd={(_, info) => {
    const newX = initialPos.current.x + info.offset.x;
    const newY = initialPos.current.y + info.offset.y;
    handleDrag(item.id, newX, newY);
    setDraggedItem(null);
  }}
  style={{ x: item.x, y: item.y }}
/>
```

#### Fase 2: Melhorar UX Mobile

1. Adicionar botao de remover sempre visivel (nao apenas hover)
2. Implementar long-press para selecao em mobile
3. Corrigir texto do estado vazio para "Toque nas pecas abaixo para adicionar"

#### Fase 3: Corrigir Warnings

**Arquivo:** `src/components/looks/SavedLookCard.tsx`

- Mover `TooltipProvider` para componente pai
- Ou usar `forwardRef` no componente

---

### Arquivos a Modificar

| Arquivo | Prioridade | Descricao |
|---------|------------|-----------|
| `src/components/canvas/LookCanvas.tsx` | CRITICA | Corrigir drag com constraints e offset |
| `src/components/looks/SavedLookCard.tsx` | MEDIA | Remover TooltipProvider aninhado |
| `src/components/looks/SavedLooksGallery.tsx` | BAIXA | Adicionar TooltipProvider no nivel correto |

---

### Beneficios Esperados

- Drag funcionando corretamente em desktop e mobile
- Itens permanecem dentro dos limites do canvas
- Performance melhorada (atualizacao apenas no dragEnd)
- Warnings de console eliminados
- Experiencia mobile aprimorada
