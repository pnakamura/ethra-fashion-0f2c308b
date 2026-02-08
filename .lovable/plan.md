
# Plano: Otimização dos Menus de Navegação

## Diagnóstico

Analisei os três componentes de navegação principais:

| Componente | Itens Atuais | Problema |
|------------|--------------|----------|
| **BottomNav** (mobile) | Home, Closet, Looks, Cores, Provador (5) | Falta Voyager e Agenda |
| **Header** (desktop) | Home, Closet, Looks, Cores, Provador, Agenda (6) | Falta Voyager |
| **QuickActions** (dashboard) | Nova Peça, Provador, Paleta, Planejar (4) | Única entrada para Voyager |

### Funcionalidades "escondidas":
- **Voyager** (`/voyager`) - Só acessível via QuickActions no dashboard
- **Agenda** (`/events`) - Só no Header desktop, invisível no mobile
- **Canvas** (`/canvas`) - Não está em nenhum menu

---

## Solução Proposta

### Estratégia: Menu "Mais" com Dropdown/Sheet

Para manter o limite de 5 itens no mobile (UX best practice), substituir o item menos frequente por um menu "Mais" que agrupa funcionalidades secundárias.

### Hierarquia de Prioridades (baseada no uso esperado):
1. **Início** - Ponto central
2. **Closet** - Core feature
3. **Looks/Recomendações** - Discovery
4. **Provador** - Feature premium
5. **Mais** → Cores, Voyager, Agenda

---

## Implementação

### 1) Atualizar `BottomNav.tsx`

Substituir o 5º item ("Provador" ou "Cores") por um menu "Mais" que abre um Sheet com:
- Cores (Paleta)
- Provador
- Voyager (Viagens)
- Agenda

```text
┌─────────────────────────────────────────────┐
│  🏠    👗    ✨    📷    •••              │
│ Início Closet Looks Provador Mais           │
└─────────────────────────────────────────────┘

Ao clicar "Mais":
┌─────────────────────────────────────────────┐
│            Mais Opções                      │
├─────────────────────────────────────────────┤
│  🎨  Minha Paleta                          │
│  ✈️  Voyager                                │
│  📅  Agenda                                 │
│  ⚙️  Configurações                          │
└─────────────────────────────────────────────┘
```

### 2) Atualizar `Header.tsx` (Desktop)

Adicionar Voyager à navegação principal:

```text
Início | Closet | Looks | Cores | Provador | Voyager | Agenda
```

Ou agrupar em dropdown se ficar muito longo:
- Opção A: Todos os 7 links visíveis
- Opção B: Agrupar "Voyager + Agenda" em "Planejamento"

### 3) Melhorar `QuickActions.tsx`

Adicionar atalho para Agenda:

```text
┌────────┬────────┬────────┬────────┐
│Nova    │Provador│Paleta  │Viagens │
│Peça    │        │        │        │
├────────┼────────┼────────┼────────┤
│Agenda  │        │        │        │
│        │        │        │        │
└────────┴────────┴────────┴────────┘
```

Ou manter 4 itens e rotacionar baseado em contexto (ex: se tem evento próximo, mostrar Agenda).

---

## Arquivos a Modificar

1. **`src/components/layout/BottomNav.tsx`**
   - Reduzir para 4 itens fixos + 1 "Mais"
   - Adicionar Sheet/Dropdown com links secundários
   - Importar ícones: `Plane`, `Calendar`, `MoreHorizontal`

2. **`src/components/layout/Header.tsx`**
   - Adicionar Voyager ao array `navLinks`
   - Opcionalmente reorganizar ordem

3. **`src/components/dashboard/QuickActions.tsx`**
   - Adicionar Agenda ou manter como está (já tem 4 itens bem distribuídos)

---

## Considerações Técnicas

### Prefetch para novas rotas
Adicionar prefetch para `/voyager` e `/events`:

```typescript
case '/voyager':
  queryClient.prefetchQuery({
    queryKey: ['trips', user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
  break;
case '/events':
  queryClient.prefetchQuery({
    queryKey: ['user-events', user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
  break;
```

### Componente do Menu "Mais"
Usar `Sheet` do shadcn para mobile (mais touch-friendly) ou `DropdownMenu` para desktop.

---

## Resumo das Mudanças

| Menu | Antes | Depois |
|------|-------|--------|
| **BottomNav** | 5 itens fixos | 4 fixos + "Mais" (agrupa Cores, Voyager, Agenda, Config) |
| **Header** | 6 links | 7 links (+ Voyager) |
| **QuickActions** | 4 atalhos | Manter ou adicionar Agenda |

Resultado: Todas as funcionalidades principais ficam acessíveis em no máximo 2 toques.
