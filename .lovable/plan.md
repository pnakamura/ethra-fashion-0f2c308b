

## Quiz de Alta Conversao Pre-Cadastro - "Descubra Seu DNA de Estilo"

### Visao Geral da Arquitetura

```text
/welcome (Landing Page)
    |
    └── Botao "Descobrir meu estilo"
            |
            ▼
/quiz (NOVA ROTA - Quiz Pre-Cadastro)
    |
    ├── Passo 1: Moodboard Visual (Swipe & Pick)
    ├── Passo 2: Diagnostico de Dores
    ├── Passo 3: Identidade Fisica (Tom de Pele + Cabelo)
    ├── Passo 4: Perfil de Silhueta
    └── Passo 5: Revelacao do DNA de Estilo
            |
            ├── Exibe resultado + 3 looks sugeridos
            └── CTA: "Criar conta para desbloquear"
                    |
                    ▼
            /auth?mode=signup (com dados do quiz preservados)
                    |
                    ▼
            /onboarding (simplificado - dados ja coletados)
```

---

### Passo 1: Moodboard Visual (Swipe & Pick)

**Objetivo:** Definir o "Norte Estetico" sem vocabulario tecnico.

**UI/UX:**
- 6 cards de estetica em grid 2x3 (mobile) ou 3x2 (desktop)
- Imagens de alta qualidade com overlay de texto
- Usuario seleciona as 2 que mais ressoam
- Animacao de "selecao" com borda dourada e checkmark

**Esteticas a incluir:**
| ID | Nome | Descricao Curta | Keywords Visuais |
|----|------|-----------------|------------------|
| old-money | Old Money | Luxo discreto | Tons neutros, cashmere, perolas |
| streetwear | Streetwear | Atitude urbana | Sneakers, hoodies, logos |
| minimalist | Minimalista | Menos e mais | Linhas limpas, monocromatico |
| boho-chic | Boho-Chic | Livre e artistico | Estampas, franjas, natureza |
| romantic | Romantico | Feminino e delicado | Rendas, florais, tons pastel |
| avant-garde | Avant-Garde | Experimental | Assimetria, texturas, monocromo |

**Micro-copy:** "Qual estetica fala com voce? Selecione 2."

---

### Passo 2: Diagnostico de Dores

**Objetivo:** Entender onde o ETHRA sera util HOJE.

**UI/UX:**
- Cards com icones + descricao
- Selecao unica (radio-like)
- Cada opcao mapeia para uma feature prioritaria

**Opcoes:**
| Opcao | Feature Mapeada | Home Reconfig |
|-------|-----------------|---------------|
| "Tenho muita roupa e nao sei combinar" | Closet Virtual | Destaca Wardrobe |
| "Sinto que estou sempre com a mesma cara" | Curadoria de Looks | Destaca Recommendations |
| "Tenho um evento e nao sei o que vestir" | Assessoria Premium | Destaca Events |
| "Compro mas nao uso" | Analise de Compras | Destaca Canvas |
| "Malas de viagem sao um caos" | Travel Stylist | Destaca Voyager |

---

### Passo 3: Identidade Fisica (A "Magica")

**Objetivo:** Demonstrar o poder tecnico da IA instantaneamente.

**UI/UX:**
- Grid de paletas visuais para tom de pele (6 opcoes)
- Grid para subtom (quente/frio/neutro com exemplos visuais)
- Grid para cor de cabelo (8 opcoes)

**Feedback Instantaneo:**
- Ao selecionar tom + subtom, a UI muda cores de fundo
- Animacao suave de transicao com particulas
- Mensagem: "Perfeito! Ja estamos personalizando..."

**Paleta de Tons de Pele:**
| ID | Nome | Hex Exemplo |
|----|------|-------------|
| very-light | Muito Clara | #FFEFD5 |
| light | Clara | #F5DEB3 |
| light-medium | Clara-Media | #DEB887 |
| medium | Media | #D2691E |
| medium-dark | Media-Escura | #8B4513 |
| dark | Escura | #654321 |

**Subtons:**
| ID | Nome | Exemplo Visual |
|----|------|----------------|
| warm | Quente (Dourado) | Veias verdes no pulso |
| cool | Frio (Rosado) | Veias azuis no pulso |
| neutral | Neutro | Veias verde-azuladas |

---

### Passo 4: Perfil de Silhueta

**Objetivo:** Coletar dados de fit sem causar ansiedade.

**UI/UX:**
- Icones estilizados de silhuetas (nao formas reais)
- Descricoes empoderadoras (nunca numeros)
- Opcional: "Prefiro nao informar" sempre visivel

**Opcoes de Silhueta:**
| ID | Nome | Descricao Empoderadora |
|----|------|------------------------|
| hourglass | Ampulheta | Ombros e quadris equilibrados |
| pear | Pera | Quadris expressivos |
| inverted | Triangulo Invertido | Ombros marcantes |
| rectangle | Retangulo | Linhas alongadas |
| apple | Maca | Centro poderoso |
| athletic | Atletico | Definicao muscular |

**Micro-copy:** "Seu formato e unico. A IA ajusta as sugestoes para valorizar suas curvas."

---

### Passo 5: Revelacao do DNA de Estilo

**Objetivo:** Entregar valor ANTES de pedir cadastro.

**Estrutura da Revelacao:**

1. **Animacao Dramatica**
   - Loading com particulas coloridas
   - Texto: "Analisando seu DNA de estilo..."
   - Duracao: 2-3 segundos (suspense controlado)

2. **O Resultado**
   - Card hero com o "DNA de Estilo" personalizado
   - Combinacao de: Estetica Principal + Subtipo Cromatico
   - Ex: "Seu DNA: Minimalista com Subtom Frio"

3. **Os 3 Looks Sugeridos**
   - Grid de 3 looks baseados nas respostas
   - Imagens de alta qualidade (placeholder por ora)
   - Cada look com nome e ocasiao

4. **O CTA de Conversao (The Lock)**
   - Texto: "Gostou? Vamos ver como fica com seu armario."
   - Botao primario: "Criar conta e desbloquear"
   - Botao secundario: "Ver mais sobre meu DNA"

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/StyleQuiz.tsx` | Pagina principal do quiz |
| `src/hooks/useStyleQuiz.ts` | Estado e logica do quiz |
| `src/components/quiz/QuizStep.tsx` | Container wrapper (similar a OnboardingStep) |
| `src/components/quiz/AestheticPicker.tsx` | Passo 1 - Moodboard |
| `src/components/quiz/PainPointPicker.tsx` | Passo 2 - Dores |
| `src/components/quiz/PhysicalIdentity.tsx` | Passo 3 - Tom/Subtom/Cabelo |
| `src/components/quiz/SilhouettePicker.tsx` | Passo 4 - Silhueta |
| `src/components/quiz/DNAReveal.tsx` | Passo 5 - Revelacao |
| `src/data/quiz-aesthetics.ts` | Dados das esteticas |
| `src/data/quiz-skin-tones.ts` | Dados de tons de pele |

---

### Arquivos a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/App.tsx` | Adicionar rota `/quiz` |
| `src/components/landing/HeroSection.tsx` | Mudar botao para `/quiz` |
| `src/components/landing/CTASection.tsx` | Mudar botao para `/quiz` |
| `src/pages/Auth.tsx` | Receber dados do quiz via state |
| `src/hooks/useOnboarding.ts` | Pular passos ja respondidos no quiz |

---

### Fluxo de Dados

```text
Quiz completo
    |
    ├── localStorage: quiz_results (backup)
    |
    └── navigate('/auth?mode=signup', { state: quizData })
            |
            └── Auth.tsx recebe quizData
                    |
                    └── Apos signup, salva em profiles:
                        - style_preferences.aesthetics
                        - style_preferences.painPoint
                        - style_preferences.skinTone
                        - style_preferences.undertone
                        - style_preferences.hairColor
                        - style_preferences.silhouette
                        - style_preferences.styleDNA
```

---

### Beneficios Esperados

**Conversao:**
- Valor entregue ANTES do cadastro (DNA + Looks)
- Reducao de fricção (sem formularios longos)
- Efeito "Uau" na troca de cores (Passo 3)

**Retencao:**
- Home Page reconfigurada com base na dor principal
- Dados de silhueta melhoram recomendacoes
- Usuario ja investiu tempo = maior comprometimento

**UX Premium:**
- Transicoes suaves entre passos (Framer Motion)
- Feedback instantaneo visual
- Microcopy empoderador em todo o fluxo

---

### Proximos Passos Apos Aprovacao

1. Criar estrutura de dados (`quiz-aesthetics.ts`, `quiz-skin-tones.ts`)
2. Criar hook `useStyleQuiz.ts`
3. Criar componentes de cada passo
4. Criar pagina `StyleQuiz.tsx`
5. Atualizar rotas e CTAs da Landing
6. Integrar com Auth para preservar dados

