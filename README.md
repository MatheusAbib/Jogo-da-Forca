# 🎮 Jogo da Forca - A FORCA

> 🔗 **Acesse o projeto online:** [matheusabib.github.io/Jogo-da-Forca](https://matheusabib.github.io/Jogo-da-Forca/)

---

## ✨ Recursos

- **+250 palavras** distribuídas em 6 categorias (Animais, Países, Tecnologia, Cinema, Música + Aleatório)
- **3 níveis de dificuldade**:
  - Fácil: 4-6 letras, 3 dicas, 6 vidas, 10 rodadas
  - Médio: 6-9 letras, 2 dicas, 6 vidas, 8 rodadas
  - Difícil: 9-14 letras, 1 dica, 3 vidas, 6 rodadas, timer de 30s
- **Sistema de dicas** que revela letras aleatórias da palavra
- **Rodadas variáveis por dificuldade** com contagem de acertos e erros
- **Ranking local** que salva no navegador (localStorage)
- **Preferências salvas** (categoria e dificuldade) na tela inicial
- **Efeito de fogo** pixelado em tempo real (Canvas) no modo difícil
- **Animações** de confete (vitória) e shake (derrota)
- **Olhos em "X"** e boca virada quando o boneco completa
- **Feedback sonoro** imersivo para hover, clique, acerto, erro, vitória e derrota
- **Som ambiente** em loop na tela inicial
- **Teclado virtual** interativo + suporte a teclado físico
- **Design responsivo** que se adapta a diferentes telas

---

## 🛠 Tecnologias Utilizadas

<div>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="40" height="40" /> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40" /> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40" /> 
</div>

- **HTML5**: Estrutura semântica das páginas
- **CSS3**: Estilização, animações, transformações e efeitos glow
- **JavaScript**: Lógica do jogo, teclado virtual, sistema de ranking e feedback interativo
- **Canvas API**: Efeito de fogo pixelado em tempo real
- **Web Audio API**: Sistema de áudio com controle de volume e mute
- **localStorage**: Persistência do ranking e preferências

---

## 🎯 Como Jogar

### Tela Inicial (Home)
1. Selecione uma **categoria** (ou mantenha "Aleatório")
2. Escolha a **dificuldade** desejada
3. Clique em **"JOGAR AGORA"** para iniciar

> 💡 Suas escolhas de categoria e dificuldade são **salvas automaticamente** para a próxima partida.

### Tela de Jogo (Game)
1. A palavra oculta aparece como `_ _ _ _ _`
2. Clique nas letras do teclado virtual ou use o teclado físico
3. **Acertos**: a letra é revelada na palavra
4. **Erros**: uma parte do boneco é desenhada na forca
   - Fácil/Médio: 6 erros permitidos
   - Difícil: 3 erros permitidos
5. Use o botão **"Dica"** para revelar uma letra aleatória (quantidade varia com a dificuldade)
6. Complete a palavra antes de completar o boneco para vencer a rodada
7. Jogue todas as rodadas da dificuldade escolhida (10 no Fácil, 8 no Médio, 6 no Difícil) e veja sua pontuação final no ranking
8. Se travar em uma palavra, use o botão **"Desistir"** para revelar a resposta e pular para a próxima rodada (conta como erro)

### Controles
- 🔇 **Mute**: Liga/desliga todos os sons
- 🏠 **Home**: Volta para a tela inicial
- ❓ **Info**: Abre o tutorial do jogo
- 🏳️ **Desistir**: Revela a palavra e pula para a próxima rodada (conta como erro)
- 🔄 **Jogar Novamente**: Reinicia a partida (aparece ao final)

---

## 📊 Sistema de Ranking

- O ranking é salvo automaticamente no navegador (localStorage)
- Armazena: pontuação (acertos), erros e data da partida
- Exibe as 10 melhores partidas
- Ordenação: maior pontuação → menor número de erros

---

## 🎨 Categorias de Palavras

| Categoria | Descrição |
|-----------|-----------|
| **Aleatório** | Seleciona palavras de todas as categorias |
| **Animais** | Nomes de animais de todas as espécies |
| **Países** | Nomes de países do mundo todo |
| **Tecnologia** | Termos da área de tecnologia e informática |
| **Cinema** | Títulos, diretores e termos do cinema |
| **Música** | Gêneros, instrumentos e termos musicais |

---

## 🎚️ Dificuldades

| Dificuldade | Letras | Dicas | Vidas | Rodadas | Timer |
|-------------|--------|-------|-------|---------|-------|
| **Fácil** | 4-6 | 3 | 6 | 10 | — |
| **Médio** | 6-9 | 2 | 6 | 8 | — |
| **Difícil** | 9-14 | 1 | 3 | 6 | 30s |

---

## 🔊 Sistema de Sons

| Som | Quando toca |
|-----|-------------|
| **Click** | Clica em botões, categorias e dificuldade |
| **Hover** | Passa o mouse sobre botões |
| **Correct** | Acerta uma letra |
| **Error** | Erra uma letra |
| **Win** | Vence uma rodada |
| **Lose** | Perde uma rodada (ou desiste) |
| **Ambient** | Toca em loop na tela inicial (som ambiente) |
| **Start** | Toca ao clicar em "JOGAR AGORA" e "Jogar Novamente" |

---
