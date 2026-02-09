

# Plano: Tornar Landing Page Transparente no Modo Claro

## Problema Identificado

O background artístico (`ArtBackground`) está sendo renderizado corretamente com `z-index: -1`, mas **duas camadas opacas** estão cobrindo-o no tema claro:

| Arquivo | Elemento | Problema |
|---------|----------|----------|
| `Landing.tsx` | `<main>` | `bg-background` = fundo sólido branco |
| `HeroSection.tsx` | `<div>` de gradiente | `from-background` = começa com branco sólido |

No modo escuro funciona porque ambos usam `dark:bg-transparent`.

---

## Solução

Adicionar transparência também no modo claro (ou usar transparência como padrão):

### 1. `src/pages/Landing.tsx` (linha 54)

```tsx
// ANTES:
<main className="min-h-screen bg-background dark:bg-transparent">

// DEPOIS:
<main className="min-h-screen bg-transparent">
```

### 2. `src/components/landing/HeroSection.tsx` (linha 23 e 25)

```tsx
// ANTES (linha 23):
<section className="relative min-h-screen flex items-center justify-center overflow-hidden dark:bg-transparent">

// DEPOIS:
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">

// ANTES (linha 25):
<div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-primary/10 dark:from-transparent dark:via-transparent dark:to-transparent" />

// DEPOIS (gradiente sutil que não bloqueia o background):
<div className="absolute inset-0 bg-gradient-to-br from-transparent via-secondary/10 to-primary/5" />
```

---

## Arquivos a Modificar

1. **`src/pages/Landing.tsx`**
   - Alterar `bg-background dark:bg-transparent` → `bg-transparent`

2. **`src/components/landing/HeroSection.tsx`**
   - Alterar section para usar `bg-transparent` 
   - Alterar gradiente para usar cores transparentes/sutis em vez de `from-background`

---

## Resultado Esperado

| Antes | Depois |
|-------|--------|
| Fundo branco sólido cobrindo o abstract | Background `abstract-light.jpeg` visível com 15% opacidade |
| Gradiente opaco sobre tudo | Gradiente sutil que complementa o artwork |

---

## Seção Técnica

A hierarquia de z-index atual é:
```
z[-1]: ArtBackground (imagem artística)
z[0]:  Landing/HeroSection (camadas opacas - PROBLEMA)
z[10]: Conteúdo (texto, botões)
```

Com as alterações, as camadas intermediárias serão transparentes, permitindo que o `ArtBackground` seja visível.

