# 🎮 Jogo da Forca - A FORCA

---

## ✨ Recursos

- **+350 palavras** distribuídas em 6 categorias (Animais, Países, Tecnologia, Cinema, Música + Aleatório)
- **3 níveis de dificuldade**:
  - Fácil: 4-6 letras, 3 dicas
  - Médio: 6-9 letras, 2 dicas
  - Difícil: 9-14 letras, 1 dica + timer de 30s
- **Sistema de dicas** que revela letras aleatórias da palavra
- **5 rodadas por partida** com contagem de acertos e erros
- **Ranking local** que salva no navegador (localStorage)
- **Efeito de fogo** pixelado em tempo real (Canvas)
- **Animações** de confete (vitória) e shake (derrota)
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
- **localStorage**: Persistência do ranking

---

## 🎯 Como Jogar

### Tela Inicial (Home)
1. Selecione uma **categoria** (ou mantenha "Aleatório")
2. Escolha a **dificuldade** desejada
3. Clique em **"JOGAR AGORA"** para iniciar

### Tela de Jogo (Game)
1. A palavra oculta aparece como `_ _ _ _ _`
2. Clique nas letras do teclado virtual ou use o teclado físico
3. **Acertos**: a letra é revelada na palavra
4. **Erros**: uma parte do boneco é desenhada na forca (máximo 6 erros)
5. Use o botão **"Dica"** para revelar uma letra aleatória (quantidade varia com a dificuldade)
6. Complete a palavra antes de completar o boneco para vencer a rodada
7. Jogue 5 rodadas e veja sua pontuação final no ranking

### Controles
- 🔇 **Mute**: Liga/desliga todos os sons
- 🏠 **Home**: Volta para a tela inicial
- ❓ **Info**: Abre o tutorial do jogo
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

## 🔊 Sistema de Sons

| Som | Quando toca |
|-----|-------------|
| **Click** | Clica em botões, categorias e dificuldade |
| **Correct** | Acerta uma letra |
| **Error** | Erra uma letra |
| **Win** | Vence uma rodada |
| **Lose** | Perde uma rodada |
| **Ambient** | Toca em loop na tela inicial (som ambiente) |
| **Start** | Toca ao clicar em "JOGAR AGORA" e "Jogar Novamente" |

---

## 📱 Responsividade

O jogo se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com forca e teclado lado a lado
- **Tablet (≤900px)**: Layout empilhado, teclado adaptado
- **Mobile (≤600px)**: Elementos compactados, teclado reduzido
- **Mobile pequeno (≤400px)**: Versão ainda mais compacta
- **Landscape**: Layout otimizado para telas horizontais

---

<!-- force re-analyze languages -->
