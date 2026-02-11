

# Quiz Result: Conversao para Criacao de Conta

## Problema atual

O resultado do quiz navega para `/wardrobe` e `/chromatic`, rotas que exigem autenticacao. Visitantes nao logados que chegam pelo `/welcome` completam o quiz mas nao sao direcionados a criar conta. Os CTAs atuais nao comunicam valor nem urgencia.

## Solucao

Detectar se o usuario esta autenticado no `QuizResult`. Se **nao autenticado**, exibir uma experiencia de conversao focada em criar conta. Se **autenticado**, manter navegacao normal.

## Mudancas no `QuizResult.tsx`

### Para usuarios nao autenticados:

**Bloco de valor apos o DNA reveal e looks sugeridos:**

- Titulo: "Seu perfil foi criado — mas ele expira em 24h"
- Subtexto: "Crie sua conta gratuita para salvar seu DNA de Estilo e desbloquear:"
- Lista de beneficios com icones:
  - Provador Virtual com IA (experimente roupas sem sair de casa)
  - Analise Cromatica personalizada (descubra suas cores ideais)
  - Looks curados diariamente baseados no seu perfil
  - Closet digital inteligente com combinacoes automaticas

**CTA principal:**
- Botao grande: "Criar conta gratuita e salvar meu perfil" -> `/auth?mode=signup`

**CTA secundario:**
- Link discreto: "Voltar para a pagina inicial" -> `/welcome`

**Elemento de prova social:**
- Texto: "12.847 mulheres ja descobriram seu DNA de Estilo"

### Para usuarios autenticados:
- Manter os CTAs atuais (wardrobe, chromatic, PDF)

## Arquivo modificado

### `src/components/quiz/QuizResult.tsx`
- Importar `useAuth` para detectar estado de autenticacao
- Condicional no bloco de CTAs: autenticado vs nao autenticado
- Novo bloco de conversao com lista de beneficios, urgencia (24h) e prova social
- Navegacao: `/auth?mode=signup` (principal) e `/welcome` (secundario)
- Animacoes Framer Motion mantidas no mesmo padrao

## Detalhes tecnicos

- Usar `useAuth()` para verificar `user`
- Nenhuma dependencia nova necessaria
- Todos os textos em portugues BR
- Icones do Lucide: `Shield`, `Palette`, `Shirt`, `Lock`, `Users`

