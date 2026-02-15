

# Corrigir Deteccao de Piscada com Threshold Adaptativo

## Problema

O `EAR_THRESHOLD` fixo de 0.25 nao funciona para todos os usuarios. O EAR (Eye Aspect Ratio) varia conforme formato dos olhos, distancia da camera e angulo. Para alguns usuarios, o EAR com olhos abertos ja fica proximo ou abaixo de 0.25, fazendo o sistema nunca detectar a transicao "fechou e abriu".

## Solucao: Threshold Adaptativo

Em vez de um valor fixo, o sistema vai:

1. **Calibrar** nos primeiros 15 frames: medir o EAR medio com olhos abertos (baseline)
2. **Calcular threshold** como 75% do baseline (ex: se baseline = 0.30, threshold = 0.225)
3. Detectar piscada quando EAR cai abaixo do threshold e depois volta acima

## Mudancas

### Arquivo: `src/hooks/useLivenessDetection.ts`

```text
Remover:
- EAR_THRESHOLD constante fixa

Adicionar:
- CALIBRATION_FRAMES = 15 (numero de frames para calibrar)
- EAR_RATIO = 0.75 (percentual do baseline para definir threshold)
- earSamples ref (array para coletar amostras durante calibracao)
- earBaseline ref (baseline calculado)
- isCalibrating ref (flag de calibracao)

Logica de calibracao:
- Nos primeiros 15 frames com rosto detectado, coletar valores de EAR
- Calcular media dos valores coletados como baseline
- Definir threshold como baseline * 0.75
- Logar valores para debug: "[Liveness] Calibrated: baseline=X, threshold=Y"

Logica de blink mantida igual, mas usando threshold calculado em vez de fixo
```

### Resumo da mudanca

| Item | Antes | Depois |
|---|---|---|
| EAR Threshold | Fixo 0.25 | Adaptativo (75% do baseline) |
| Calibracao | Nenhuma | 15 frames iniciais |
| Compatibilidade | Baixa (depende do usuario) | Alta (adapta a cada usuario) |

Apenas o arquivo `src/hooks/useLivenessDetection.ts` sera modificado.
