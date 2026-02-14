

# Liveness Detection + Face Matching com Controle Admin

## Resumo

Implementar dois sistemas de seguranca biometrica -- prova de vida (liveness) e correspondencia facial (face matching) -- controlados por feature flags que somente o admin pode ativar/desativar pelo painel /admin.

## 1. Feature Flags no Banco de Dados

Nova tabela `app_feature_flags` para armazenar configuracoes globais controladas pelo admin:

```text
CREATE TABLE app_feature_flags (
  id text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  updated_by uuid,
  updated_at timestamptz DEFAULT now(),
  description text
);

-- Somente admin pode ler/modificar
ALTER TABLE app_feature_flags ENABLE ROW LEVEL SECURITY;

-- Qualquer usuario autenticado pode ler (para saber se a feature esta ativa)
CREATE POLICY "Anyone can read flags" ON app_feature_flags FOR SELECT USING (true);
-- Somente admin pode modificar
CREATE POLICY "Admin can update flags" ON app_feature_flags FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can insert flags" ON app_feature_flags FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

INSERT INTO app_feature_flags (id, enabled, description) VALUES
  ('liveness_detection', false, 'Exigir prova de vida na camera cromatica'),
  ('face_matching', false, 'Comparar rosto do avatar com selfie de referencia');
```

## 2. Liveness Detection (Prova de Vida)

### Abordagem tecnica

Usar **MediaPipe Face Landmarker** (ja instalado: `@mediapipe/tasks-vision`) para:

1. **Blink detection**: Calcular EAR (Eye Aspect Ratio) usando landmarks dos olhos. Quando EAR cai abaixo de 0.21 por 2-3 frames consecutivos, um blink e detectado.
2. **Head pose**: Calcular angulo de rotacao da cabeca usando landmarks do nariz, queixo e orelhas. Exigir uma rotacao lateral > 15 graus.

### Fluxo do usuario

```text
1. Camera cromatica abre normalmente
2. Se liveness_detection estiver ativo:
   a. Overlay mostra instrucao: "Pisque os olhos"
   b. Usuario pisca -> check verde
   c. Instrucao muda: "Vire a cabeca para o lado"  
   d. Usuario vira -> check verde
   e. Validacao completa em < 2s
   f. Botao "Capturar" e liberado
3. Se desativado: fluxo atual sem mudancas
```

### Criterios de aceite
- MediaPipe Face Mesh com deteccao de blink + head pose
- Taxa de rejeicao de fotos estaticas > 95%
- Latencia < 2s para validacao

### Arquivos novos

| Arquivo | Descricao |
|---|---|
| `src/hooks/useLivenessDetection.ts` | Hook principal: inicializa FaceLandmarker, detecta blinks via EAR, head pose via landmarks, retorna `{ isLive, currentChallenge, progress, startDetection, stopDetection }` |
| `src/components/camera/LivenessChallenge.tsx` | Overlay visual com instrucoes animadas ("Pisque", "Vire a cabeca"), indicadores de progresso e feedback em tempo real |

### Arquivos modificados

| Arquivo | Mudanca |
|---|---|
| `src/components/chromatic/ChromaticCameraCapture.tsx` | Integrar LivenessChallenge antes de liberar captura. Condicional baseado na feature flag |

## 3. Face Matching (Correspondencia Facial)

### Abordagem tecnica

1. **Selfie de referencia**: Na primeira analise cromatica bem-sucedida, extrair embedding facial usando MediaPipe FaceLandmarker (468 landmarks -> vetor normalizado).
2. **Armazenamento**: Salvar o embedding como hash numerico na tabela `profiles` (campo `face_embedding_hash` tipo `jsonb`). Nunca armazenar a imagem do rosto.
3. **Comparacao**: No provador virtual, antes de aceitar o avatar, extrair embedding da nova imagem e calcular similaridade por distancia euclidiana normalizada.
4. **Threshold**: Similaridade > 0.85 = aceitar. Abaixo = rejeitar com mensagem amigavel.

### Fluxo do usuario

```text
1. Primeira analise cromatica -> embedding salvo automaticamente no perfil
2. No provador virtual (upload de avatar):
   a. Se face_matching estiver ativo:
      - Extrair embedding da imagem enviada
      - Comparar com embedding salvo
      - Se similaridade >= 0.85 -> prosseguir
      - Se similaridade < 0.85 -> mostrar mensagem:
        "A pessoa na foto nao corresponde ao seu perfil.
         Use uma foto sua para o provador virtual."
   b. Se desativado: fluxo atual sem mudancas
3. Se usuario nao tem embedding salvo: pular verificacao
```

### Criterios de aceite
- Embedding facial armazenado como hash (nao imagem)
- Threshold de similaridade > 0.85
- Mensagem clara de rejeicao sem expor dados tecnicos

### Arquivos novos

| Arquivo | Descricao |
|---|---|
| `src/hooks/useFaceEmbedding.ts` | Hook: extrair embedding via FaceLandmarker (468 landmarks -> vetor 936D), salvar/carregar do perfil, comparar com cosine similarity. Retorna `{ extractEmbedding, compareWithReference, saveReferenceEmbedding, hasReference }` |
| `src/components/camera/FaceMatchResult.tsx` | Componente de feedback visual: icone de sucesso/falha, mensagem amigavel, botao de tentar novamente |

### Arquivos modificados

| Arquivo | Mudanca |
|---|---|
| `src/components/chromatic/ColorAnalysis.tsx` | Apos analise bem-sucedida, salvar embedding de referencia (se ainda nao existe) |
| `src/components/try-on/AvatarManager.tsx` | Antes de upload/captura, verificar face matching (se flag ativa). Mostrar FaceMatchResult em caso de rejeicao |
| Migracao SQL | Adicionar coluna `face_embedding_hash jsonb` na tabela `profiles` |

## 4. Painel Admin -- Controle de Features

### Arquivo modificado: `src/pages/Admin.tsx`

Na aba "Config" (atualmente vazia), adicionar secao "Seguranca Biometrica" com:

- **Toggle "Prova de Vida"**: ativa/desativa liveness_detection
- **Toggle "Face Matching"**: ativa/desativa face_matching
- Descricao curta de cada feature
- Indicador visual do status atual (ativo/inativo)

### Arquivo novo: `src/hooks/useFeatureFlags.ts`

Hook para ler e atualizar feature flags:
- `flags`: Map de flags com status
- `isEnabled(flagId)`: verificar se uma flag esta ativa
- `toggleFlag(flagId, enabled)`: atualizar flag (somente admin)
- Cache via React Query com staleTime de 60s

## 5. Infraestrutura MediaPipe Compartilhada

### Arquivo novo: `src/lib/mediapipe-face.ts`

Singleton para inicializacao do FaceLandmarker:
- Lazy loading do modelo WASM (carrega sob demanda)
- Compartilhado entre liveness e face matching
- Funcoes utilitarias: `calculateEAR()`, `calculateHeadPose()`, `extractLandmarkVector()`, `cosineSimilarity()`

## Resumo de arquivos

| Arquivo | Acao |
|---|---|
| Migracao SQL | Criar tabela `app_feature_flags`, adicionar `face_embedding_hash` em profiles |
| `src/lib/mediapipe-face.ts` | Novo -- singleton MediaPipe + utilitarios |
| `src/hooks/useFeatureFlags.ts` | Novo -- leitura/escrita de feature flags |
| `src/hooks/useLivenessDetection.ts` | Novo -- deteccao de blink e head pose |
| `src/hooks/useFaceEmbedding.ts` | Novo -- embedding facial e comparacao |
| `src/components/camera/LivenessChallenge.tsx` | Novo -- overlay de desafio de prova de vida |
| `src/components/camera/FaceMatchResult.tsx` | Novo -- feedback de correspondencia facial |
| `src/components/chromatic/ChromaticCameraCapture.tsx` | Gate de liveness antes da captura |
| `src/components/chromatic/ColorAnalysis.tsx` | Salvar embedding apos analise |
| `src/components/try-on/AvatarManager.tsx` | Gate de face matching antes de upload |
| `src/pages/Admin.tsx` | Toggles na aba Config para ativar/desativar |

