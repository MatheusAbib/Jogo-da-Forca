
# A FORCA — O Teatro dos Condenados

**A FORCA** é um jogo de adivinhação de palavras desenvolvido com HTML, CSS e JavaScript, ambientado em um teatro de estética vintage.

O projeto transforma o tradicional jogo da forca em uma experiência temática, com cenário teatral, personagem animado, iluminação de palco, efeitos sonoros e diferentes níveis de dificuldade.

> 🔗 **Acesse online:** (https://matheusabib.github.io/Jogo-da-Forca/)

---

## O Teatro

A identidade visual do projeto foi construída em torno de um antigo teatro, combinando elementos cenográficos e interfaces inspiradas em cartazes, placas de madeira e programas de espetáculo.

Entre os principais elementos visuais estão:

- Cortinas vermelhas com detalhes dourados e animações.
- Palco em perspectiva, com paredes e piso de madeira.
- Iluminação cênica, refletores e luzes de ribalta animadas.
- Personagem ilustrado e animado na tela inicial.
- Transição de cortinas entre a apresentação e a partida.
- Painéis e controles integrados ao cenário.
- Modais com aparência de pergaminho e molduras de madeira.
- Efeitos visuais de vitória, derrota e situações especiais.

A interface foi organizada para preservar a identidade teatral tanto na tela inicial quanto durante as partidas.

---

## Capturas de Tela

### Tela Inicial

Apresenta o cenário teatral, o personagem anfitrião e o painel para selecionar a categoria e o nível de dificuldade.

### Tela da Partida

Reúne a forca, o teclado interativo, a palavra secreta, as vidas restantes, as dicas e os controles da partida.

### Quadro de Honra

Exibe os melhores resultados registrados no navegador, em um modal integrado à identidade visual do teatro.

---

## Funcionalidades

### Sistema de Jogo

- Mais de 250 palavras distribuídas em cinco categorias temáticas.
- Seleção aleatória de palavras entre as categorias disponíveis.
- Três níveis de dificuldade com regras próprias.
- Rodadas e quantidade de vidas variáveis.
- Teclado virtual interativo e suporte ao teclado físico.
- Revelação progressiva das letras corretas.
- Construção do personagem na forca conforme os erros.
- Sistema de dicas que revela letras da palavra.
- Indicadores de progresso, vidas e rodadas.
- Possibilidade de desistir ou reiniciar a partida.
- Temporizador de 30 segundos no modo difícil.

### Experiência Visual

- Cenário teatral compartilhado entre as páginas.
- Personagem ilustrado com animações.
- Cortinas e elementos decorativos em camadas.
- Iluminação e luzes animadas no palco.
- Transições entre telas.
- Efeito de fogo pixelado com Canvas no modo difícil.
- Animação de confete nas vitórias.
- Efeitos visuais de impacto nas derrotas.
- Expressões faciais do personagem, incluindo olhos em X.
- Interface responsiva para diferentes tamanhos de tela.

### Áudio e Interatividade

- Efeitos sonoros para cliques e interações.
- Sons específicos para acertos e erros.
- Feedback sonoro de vitória e derrota.
- Som ambiente na tela inicial.
- Controle para ativar ou desativar os sons.

### Persistência Local

- Armazenamento dos resultados no navegador.
- Quadro de Honra com as dez melhores partidas.
- Classificação por pontuação e quantidade de erros.
- Registro da data das partidas.
- Preferências de categoria e dificuldade salvas localmente.

---

## Como Jogar

### 1. Prepare o Espetáculo

Na tela inicial:

1. Selecione uma categoria de palavras ou mantenha a opção **Surpresa**.
2. Escolha um dos três atos disponíveis.
3. Clique em **Começar o Espetáculo** para iniciar a partida.

As preferências de categoria e dificuldade são armazenadas no navegador para facilitar as próximas partidas.

### 2. Descubra a Palavra

Durante a partida, uma palavra é apresentada com suas letras ocultas.

- Escolha uma letra utilizando o teclado virtual ou físico.
- Quando a letra estiver presente na palavra, suas ocorrências serão reveladas.
- Quando a letra estiver incorreta, você perderá uma vida.
- A cada erro, uma nova parte do personagem aparecerá na forca.
- Utilize **Pedir dica** quando precisar de ajuda.
- Descubra todas as letras antes de perder suas vidas para vencer a rodada.

### 3. Complete as Rodadas

Cada dificuldade possui uma quantidade específica de rodadas.

Ao longo da partida, o jogo acompanha os acertos, erros e o progresso do jogador.

No modo difícil, cada desafio também possui um limite de tempo.

---

## Níveis de Dificuldade

| Ato | Dificuldade | Letras | Vidas | Dicas | Rodadas | Tempo |
|---|---|---|---|---|---|---|
| I — O Ensaio | Fácil | 4–6 | 6 | 3 | 10 | Sem limite |
| II — O Espetáculo | Médio | 6–9 | 6 | 2 | 8 | Sem limite |
| III — O Último Ato | Difícil | 9–14 | 3 | 1 | 6 | 30 segundos |

**O Ensaio:** indicado para partidas mais tranquilas, com palavras menores e mais oportunidades de receber ajuda.

**O Espetáculo:** oferece um desafio intermediário, com palavras maiores e menos dicas disponíveis.

**O Último Ato:** exige decisões rápidas, com palavras mais longas, menos vidas e um limite de tempo por desafio.

---

## Categorias de Palavras

| Categoria | Conteúdo |
|---|---|
| Surpresa | Palavras selecionadas entre todas as categorias |
| Animais | Nomes de animais de diferentes espécies |
| Países | Países de diferentes regiões do mundo |
| Tecnologia | Termos relacionados à informática e tecnologia |
| Cinema | Filmes, diretores e conceitos cinematográficos |
| Música | Gêneros, instrumentos e termos musicais |

---

## Quadro de Honra

O jogo possui um sistema de classificação local, acessível diretamente pela tela inicial.

O Quadro de Honra apresenta os **dez melhores resultados** registrados no navegador.

Cada registro contém:

- Posição na classificação.
- Pontuação obtida.
- Quantidade de erros.
- Data da partida.

Os resultados são ordenados pela maior pontuação e, em caso de empate, pela menor quantidade de erros.

Os dados são armazenados utilizando `localStorage`, sem necessidade de cadastro ou conexão com um servidor.

**Importante:** o histórico é específico de cada navegador e dispositivo. A limpeza dos dados locais pode apagar os registros.

---

## Controles

| Controle | Função |
|---|---|
| Teclado virtual | Selecionar letras |
| Teclado físico | Digitar letras diretamente |
| Pedir dica | Revelar uma letra da palavra |
| Desistir | Encerrar o desafio atual |
| Recomeçar | Reiniciar a partida |
| Início | Retornar à tela inicial |
| Regras | Consultar as instruções do jogo |
| Som | Ativar ou desativar os efeitos sonoros |
| Quadro de Honra | Consultar os melhores resultados na tela inicial |

---

## Tecnologias Utilizadas

<div>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40" />
</div>

### HTML5

Responsável pela estrutura semântica das páginas, organização dos elementos interativos, acessibilidade e composição do cenário teatral.

### CSS3

Utilizado na construção da identidade visual, responsividade, animações, transições, iluminação, elementos cenográficos e representação do personagem.

### JavaScript

Responsável pela lógica das partidas, seleção de palavras, controle das rodadas, interações, teclado, dicas, ranking, temporizador e gerenciamento dos estados do jogo.

### Canvas API

Utilizada para renderizar o efeito de fogo pixelado em tempo real no modo difícil.

### Web Audio API

Utilizada para os recursos de áudio e feedback sonoro da experiência.

### Web Storage API

Utilizada por meio de `localStorage` para persistir resultados e preferências do jogador.

---