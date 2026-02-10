

# DemoSection: De vitrine passiva para experiencia interativa de conversao

## Problema atual
As simulacoes sao **passivas**: animacoes que simplesmente rodam quando a aba e selecionada. O visitante assiste, mas nao **participa**. Nao ha personalizacao, nao ha "aha moment" real, e nenhuma sensacao de que o app ja esta trabalhando para ele.

## Estrategia de conversao
Transformar cada aba em uma **micro-experiencia interativa** onde o visitante interage, recebe um resultado personalizado e sente que "precisa" do app para ter mais. Cada simulacao termina com um gancho emocional + CTA contextual.

---

## Mudancas por simulacao

### 1. Colorimetria: "Qual e sua paleta?"
**Antes**: Circulos de cores aparecem ao redor de um icone generico.

**Depois**: O visitante **clica em seu tom de pele** (3 opcoes: claro, medio, escuro) e ve uma paleta personalizada aparecer com animacao de "revelacao". Ao final, aparece: *"Sua analise completa tem 24 cores. Crie sua conta para descobrir todas."*

- 3 botoes clicaveis de tom de pele (circulos com gradientes realistas)
- Cada opcao revela uma paleta diferente de 6 cores com nomes
- Badge animado: "Paleta Primavera Clara" / "Outono Quente" / "Inverno Profundo"
- Resultado parcial com barra de progresso mostrando "6 de 24 cores reveladas"
- Micro-CTA: "Ver minha paleta completa"

### 2. Provador Virtual: "Escolha um look"
**Antes**: Dois retangulos com icones genericos (User + Shirt).

**Depois**: O visitante ve 3 miniaturas de pecas (vestido, blazer, camiseta) e **clica para "experimentar"**. A peca selecionada aparece na silhueta com animacao de "vestir" (scale + fade). Um badge de harmonia aparece mostrando compatibilidade com a paleta.

- 3 opcoes de peca clicavel (cards com icone + nome)
- Silhueta central que "recebe" a peca com animacao de transicao
- Badge de harmonia: "92% compativel com sua paleta" (aparece se o usuario ja interagiu com a aba de colorimetria)
- Efeito de brilho/sparkle na transicao
- Micro-CTA: "Experimentar com sua propria foto"

### 3. Closet Inteligente: "Arraste para organizar"
**Antes**: Grid estatico de categorias com contadores.

**Depois**: O visitante ve 6 pecas "soltas" e **clica nelas para categoriza-las** (cada clique move a peca para a categoria correta com animacao). Conforme organiza, um contador de "Closet Score" sobe. Ao final, aparece: *"Seu closet real pode ter centenas de pecas. Organize tudo em minutos."*

- 6 pecas flutuando em posicoes aleatorias (mini cards com emoji + nome)
- Clique em cada peca faz ela "voar" para a categoria correta na grade
- Contador animado "Pecas organizadas: 0/6" que vai subindo
- Animacao de confetti sutil ao completar
- Micro-CTA: "Organizar meu guarda-roupa"

### 4. Malas de Viagem: "Para onde voce vai?"
**Antes**: Checklist estatico com Florianopolis.

**Depois**: O visitante **escolhe entre 3 destinos** (Praia, Cidade Europeia, Montanha) e ve um checklist personalizado ser gerado com animacao. Cada destino mostra clima diferente e itens diferentes.

- 3 cards de destino clicaveis com emoji + nome + temperatura
- Ao selecionar, checklist personalizado aparece item por item
- Badge de clima animado (sol/neve/nuvem) muda com o destino
- Contador: "7 itens essenciais selecionados pela IA"
- Micro-CTA: "Planejar minha proxima viagem"

---

## Mudancas estruturais

### Header da secao
- Titulo: "Experimente agora" (em vez de "Veja o Ethra em acao")
- Subtitulo: "Interaja com cada recurso e descubra como o Ethra transforma seu dia a dia"
- Badge: "100% interativo" (em vez de "Conheca os recursos")

### CTA principal (bottom)
- Texto dinamico que muda conforme o usuario interage:
  - Se interagiu com 0 abas: "Comecar gratis"
  - Se interagiu com 1-2: "Quero tudo isso no meu perfil"
  - Se interagiu com 3-4: "Ja estou convencida! Criar minha conta"
- Contador sutil: "Voce explorou X de 4 recursos"

### Estado compartilhado entre abas
- Se o usuario escolheu tom de pele na aba 1, a aba 2 mostra o badge de harmonia
- Isso cria uma narrativa conectada e reforça a ideia de ecossistema integrado

---

## Detalhes tecnicos

### Arquivo modificado: 1
- `src/components/landing/DemoSection.tsx` (reescrita completa)

### Dependencias: nenhuma nova
- Framer Motion (ja instalado) para todas animacoes
- Lucide icons (ja instalado) para icones
- Radix Tabs (ja instalado) para sistema de abas

### Dados das paletas por tom de pele
```text
Claro -> Primavera Clara: Rosa, Pessego, Coral, Verde Menta, Azul Celeste, Lavanda
Medio -> Outono Quente: Terracota, Mostarda, Oliva, Vinho, Cobre, Caramelo
Escuro -> Inverno Profundo: Vermelho Rubi, Esmeralda, Azul Royal, Magenta, Prata, Branco Puro
```

### Dados dos destinos
```text
Praia (28C, Sol): Biquini, Saida de praia, Sandalia, Vestido leve, Chapeu, Oculos de sol, Protetor
Cidade Europeia (15C, Nublado): Trench coat, Bota, Cachecol, Calca alfaiataria, Blusa, Bolsa crossbody, Guarda-chuva
Montanha (5C, Neve): Puffer jacket, Bota impermeavel, Gorro, Fleece, Calca termica, Luvas, Mochila
```

### Dados das pecas do provador
```text
Vestido Midi Floral (icone de vestido)
Blazer Oversized (icone de blazer)
Camiseta Basica Premium (icone de camiseta)
```

### Performance
- Nenhuma chamada a API ou backend
- Todas animacoes sao CSS/Framer Motion locais
- Estado gerenciado com useState simples
- Componente leve, sem lazy loading necessario
