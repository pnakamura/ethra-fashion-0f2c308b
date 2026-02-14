
# Corrigir Prova de Vida na Analise Cromatica

## Problemas Identificados

### 1. Deteccao de piscada provavelmente nao funciona
O threshold EAR (Eye Aspect Ratio) de **0.21** e muito baixo para muitos usuarios e cameras. Alem disso, exigir **2 frames consecutivos** com olhos fechados pode falhar em cameras com framerates variados. O usuario pisca mas o sistema nao detecta.

### 2. UX sem feedback nenhum
- O usuario ve "Pisque os olhos" mas nao ha indicacao se o rosto foi detectado
- Nao ha feedback se a piscada foi parcialmente detectada
- Se a piscada for detectada, a transicao para "Vire a cabeca" e sutil demais (apenas um ponto muda de cor)
- O botao "Capturar" fica desabilitado sem explicacao visivel do motivo
- Nao ha timeout -- se nao funcionar, o usuario fica preso para sempre

### 3. Warning de React (ref em function component)
O console mostra um warning sobre refs no `LivenessChallenge` causado pelo `AnimatePresence` tentando passar ref para um componente funcional.

## Solucao

### 1. Ajustar sensibilidade da deteccao (`useLivenessDetection.ts`)

- Aumentar `EAR_THRESHOLD` de 0.21 para **0.25** (mais permissivo)
- Reduzir `EAR_CONSECUTIVE_FRAMES` de 2 para **1** (basta 1 frame com olhos fechados)
- Adicionar **logs de debug** temporarios para EAR e yaw values
- Adicionar **timeout de 30 segundos**: se o desafio nao completar, mostrar mensagem de erro com opcao de tentar novamente ou pular

### 2. Melhorar UX do `LivenessChallenge.tsx`

- Adicionar indicador de **"Rosto detectado"** antes de pedir a piscada
- Mostrar **feedback animado** quando a piscada e detectada (checkmark verde com animacao)
- Transicao mais visivel entre etapas (piscada -> virar cabeca)
- Adicionar **texto explicativo** abaixo do desafio: "Apos completar, o botao Capturar sera liberado"
- Adicionar **barra de progresso** visual (etapa 1 de 2, etapa 2 de 2)
- Corrigir warning de ref usando `forwardRef` nos componentes motion

### 3. Melhorar feedback no `ChromaticCameraCapture.tsx`

- Quando liveness esta ativo e incompleto, mostrar texto explicativo no botao desabilitado: "Complete a verificacao acima"
- Adicionar opcao de **"Pular verificacao"** apos timeout de 30s (captura sem liveness)
- Mostrar estado de progresso do liveness abaixo da camera

## Detalhes Tecnicos

### Arquivos modificados

| Arquivo | Mudanca |
|---|---|
| `src/hooks/useLivenessDetection.ts` | Ajustar thresholds (EAR 0.25, 1 frame), adicionar timeout de 30s, expor `faceDetected` e `timeoutReached` |
| `src/components/camera/LivenessChallenge.tsx` | Redesign completo da UX: indicador de rosto, feedback de etapa, barra de progresso, opcao de pular apos timeout |
| `src/components/chromatic/ChromaticCameraCapture.tsx` | Mostrar motivo do botao desabilitado, integrar timeout/skip do liveness |

### Mudancas no `useLivenessDetection.ts`

```text
Novos campos no state:
- faceDetected: boolean (true quando landmarks sao encontrados)
- timeoutReached: boolean (true apos 30s sem completar)
- startedAt: number (timestamp de inicio)

Novos thresholds:
- EAR_THRESHOLD: 0.21 -> 0.25
- EAR_CONSECUTIVE_FRAMES: 2 -> 1
- TIMEOUT_MS: 30000

Nova funcao:
- skipChallenge(): marca isLive = true mesmo sem completar (apos timeout)
```

### Mudancas no `LivenessChallenge.tsx`

```text
Novo layout:
1. Barra de progresso: [Etapa 1: Piscar] [Etapa 2: Virar] com cores
2. Indicador "Rosto detectado" com checkmark
3. Instrucao principal com icone animado
4. Feedback instantaneo quando etapa completa (animacao de sucesso)
5. Apos timeout: mensagem "Nao conseguimos detectar. Tente novamente ou pule"
6. Botao "Pular verificacao" (so aparece apos timeout)
```

### Mudancas no `ChromaticCameraCapture.tsx`

```text
- Botao capturar mostra "Complete a verificacao" quando liveness ativo e incompleto
- Quando timeout, botao volta a ficar habilitado com texto "Capturar sem verificacao"
- Integrar liveness.skipChallenge() no botao de skip
```
