
# Remodelar DemoSection: de "prova virtual gratis" para "simulacao do app"

## Problema atual
A DemoSection tem duas demos interativas reais (ChromaticDemo + VirtualTryOnDemo) que dependem de upload de foto e processamento por IA. A VirtualTryOnDemo e pesada (610 linhas), consome recursos do backend e tem limitacao de 1 uso por dia. A proposta e substituir tudo por uma **vitrine visual animada** que simula o que o app faz, sem processamento real.

## O que sera feito

Substituir a `DemoSection` inteira por uma nova versao que mostra uma **simulacao visual interativa** das 4 funcionalidades do app (Colorimetria, Provador Virtual, Closet, Malas), usando animacoes e imagens estaticas em vez de processamento real.

### Nova estrutura: Showcase interativo com tabs

O usuario clica em abas para ver simulacoes animadas de cada funcionalidade:

```text
[Colorimetria] [Provador] [Closet] [Malas]
         |
   +-----v------+
   | Animacao    |
   | simulada    |
   | do recurso  |
   +-----------+
```

Cada aba mostra uma animacao pre-definida:
- **Colorimetria**: Paleta de cores animada aparecendo sobre uma silhueta
- **Provador Virtual**: Sequencia animada antes/depois com imagens estaticas
- **Closet**: Grid de pecas com categorizacao visual
- **Malas**: Checklist animado com itens aparecendo

### Textos atualizados

**Titulo da secao**: "Veja o Ethra em acao" (antes: "Qual e a sua paleta perfeita?" + "Veja a magica acontecer")

**Subtitulo**: "Explore tudo que nosso personal stylist com IA pode fazer por voce"

Cada aba tera titulo + descricao curta contextual.

## Mudancas tecnicas

### 1. `src/components/landing/DemoSection.tsx` (reescrever)
- Remover imports de `ChromaticDemo` e `VirtualTryOnDemo`
- Criar componente com sistema de tabs (4 abas)
- Cada tab renderiza uma animacao Framer Motion com imagens/icones estaticos
- Manter CTA "Comecar gratis" no final
- Remover os 3 steps (Camera, Escolha, Veja) que eram especificos do VTO

### 2. `src/components/landing/VirtualTryOnDemo.tsx` (remover)
- Arquivo de 610 linhas nao sera mais usado
- Sera deletado

### 3. `src/components/landing/ChromaticDemo.tsx` (remover)
- Nao sera mais importado na DemoSection
- Sera deletado (a colorimetria real continua disponivel em /chromatic para usuarios logados)

## Detalhes das 4 simulacoes

### Tab "Colorimetria"
- Imagem de silhueta feminina com circulos de cores animados aparecendo ao redor
- Paleta de 6 cores com animacao stagger
- Texto: "Descubra as cores que mais te valorizam com analise por IA"

### Tab "Provador Virtual"  
- Duas imagens lado a lado (antes/depois) com seta animada
- Imagens estaticas (sem upload real)
- Texto: "Experimente roupas virtualmente antes de comprar"

### Tab "Closet Inteligente"
- Grid 3x2 com icones de categorias (Tops, Vestidos, Calcas, Sapatos, Bolsas, Acessorios)
- Animacao de cards aparecendo em stagger
- Texto: "Organize todo seu guarda-roupa em um so lugar"

### Tab "Malas de Viagem"
- Checklist animado com items aparecendo e check marcando
- Icone de clima (sol/nuvem)
- Texto: "Monte malas inteligentes baseadas no destino e clima"

## Arquivos modificados: 3
- `src/components/landing/DemoSection.tsx` (reescrever completamente)
- `src/components/landing/VirtualTryOnDemo.tsx` (deletar)
- `src/components/landing/ChromaticDemo.tsx` (deletar)
