

# Style DNA Quiz - Pagina /quiz

Criar uma experiencia imersiva de autodescoberta em `/quiz` com 4 passos gamificados, transicoes cinematograficas e feedback visual instantaneo.

## Visao Geral do Fluxo

```text
Passo 1: Esteticas (Swipe & Pick)
   |
   v
Passo 2: Desafios de Estilo (Diagnostico de Dores)
   |
   v
Passo 3: Identidade Fisica (Tom de pele + Cabelo)
   |
   v
Passo 4: Silhueta (Selecao por icones)
   |
   v
Revelacao: "Seu DNA de Estilo" + 3 looks sugeridos + CTA de conversao
```

## Arquitetura de Componentes

### Novo arquivo: `src/pages/Quiz.tsx`
- Controlador principal do quiz com estado `step` (1-5, onde 5 = resultado)
- Progress bar fixa no topo com animacao fluida (Framer Motion)
- Transicoes cross-dissolve entre passos usando `AnimatePresence mode="wait"`
- Salva resultados no perfil do usuario ao finalizar

### Novos componentes do quiz em `src/components/quiz/`:

**1. `QuizAesthetics.tsx` - Passo 1: Gancho Aspiracional**
- 6 cards visuais em tela cheia: Old Money, Streetwear, Minimalist, Boho-Chic, Romantic, Avant-Garde
- Cada card com imagem de fundo HD via `OptimizedImage`, overlay de gradiente escuro, titulo e subtitulo
- Usuario seleciona exatamente 2 esteticas
- Animacao de selecao: borda dourada + escala sutil + checkmark animado
- Layout: grid 2x3 no mobile, 3x2 no desktop

**2. `QuizPainPoints.tsx` - Passo 2: Diagnostico de Dores**
- 3 opcoes com icones e descricoes:
  - "Tenho muita roupa e nao sei combinar" (icone: closet)
  - "Sinto que estou sempre com a mesma cara" (icone: refresh)
  - "Tenho um evento e nao sei o que vestir" (icone: calendario)
- Selecao unica com feedback visual imediato
- Micro-copy contextual que muda ao selecionar

**3. `QuizSkinTone.tsx` - Passo 3: Identidade Fisica**
- Secao 1: Paleta simplificada de tons de pele (6 opcoes organizadas claro a escuro)
- Secao 2: Subtom (quente/frio/neutro) com explicacao visual
- Secao 3: Cor de cabelo (6 opcoes com swatches circulares)
- Feedback instantaneo: ao selecionar, o fundo da pagina muda sutilmente para cores que harmonizam com a escolha (usando CSS transitions)
- Efeito "Uau": animacao de particulas douradas ao completar as 3 selecoes

**4. `QuizSilhouette.tsx` - Passo 4: Perfil de Silhueta**
- 6 opcoes com nomes empoderadores e simbolos abstratos (reutilizando a estetica ja definida no projeto):
  - Curvas Harmonicas (infinito)
  - Base Expressiva (casa)
  - Ombros Imponentes (triangulo invertido)
  - Linhas Alongadas (linhas paralelas)
  - Centro Poderoso (estrela)
  - Silhueta Esculpida (diamante)
- Cards com icones SVG simples (sem fotos de corpo)
- Micro-copy: "Nosso ajuste de IA garante que as pecas sugeridas respeitem o seu caimento preferido."

**5. `QuizResult.tsx` - Passo 5: Revelacao do DNA**
- Revelacao animada do resultado: "Seu DNA de Estilo e [Estetica] com Subtom [Quente/Frio]"
- 3 cards de looks sugeridos baseados nas respostas (dados estaticos iniciais, coordenados com a estetica escolhida)
- Cada look card com paleta de cores e descricao
- CTA principal: "Desbloquear meu provador virtual" -> navega para `/provador` ou `/wardrobe`
- Nudges de upsell premium:
  - "Analise cromatica profissional com IA" -> link para `/chromatic`
  - "Relatorio PDF do seu estilo" -> badge Premium

### Novo hook: `src/hooks/useStyleDNAQuiz.ts`
- Gerencia estado do quiz (step atual, selecoes de cada passo)
- Salva resultado no perfil (`style_preferences`) via Supabase
- Calcula o "DNA de Estilo" combinando estetica + dores + tom + silhueta

## Mudancas em Arquivos Existentes

### `src/App.tsx` (2 linhas)
- Adicionar lazy import: `const Quiz = lazy(() => import("./pages/Quiz"))`
- Trocar `<Navigate to="/chromatic" replace />` por `<Quiz />` na rota `/quiz`

## Detalhes de UX

- **Progress Bar**: Fixa no topo, gradiente dourado animado, mostra % de conclusao
- **Transicoes**: Cross-dissolve (opacity + translateY sutil) com Framer Motion, duracao 0.4s
- **Haptic Feedback**: `navigator.vibrate?.(10)` ao selecionar opcoes (mobile only)
- **Responsivo**: Mobile-first, cards adaptam de 2 colunas para 3 no desktop
- **Estetica**: Segue o design system existente (Cormorant Garamond para titulos, Inter para body, gradientes dourados, glass effects no dark mode)

## Arquivos novos: 7
- `src/pages/Quiz.tsx`
- `src/hooks/useStyleDNAQuiz.ts`
- `src/components/quiz/QuizAesthetics.tsx`
- `src/components/quiz/QuizPainPoints.tsx`
- `src/components/quiz/QuizSkinTone.tsx`
- `src/components/quiz/QuizSilhouette.tsx`
- `src/components/quiz/QuizResult.tsx`

## Arquivos modificados: 1
- `src/App.tsx` (2 linhas)

## Nota sobre imagens
As imagens dos cards de estetica usarao URLs de placeholder (gradientes estilizados com icones) inicialmente. Podem ser substituidas por fotos reais via upload posteriormente.

