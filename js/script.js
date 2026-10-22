const sounds = {
  correct: new Audio('./sounds/correct.mp3'),
  wrong: new Audio('./sounds/error.mp3'),
  win: new Audio('./sounds/win.mp3'),
  lose: new Audio('./sounds/lost.wav'),
  click: new Audio('./sounds/click.wav'),
  play: new Audio('./sounds/start.mp3')
};

Object.values(sounds).forEach(s => {
  if (s) {
    s.load();
    s.volume = 0.3;
  }
});

let soundEnabled = true;
let animationFrameId;
let timerInterval;
let timeLeft = 30;
let selectedWord = "";
let displayedWord = [];
let wrongGuesses = 0;
let maxGuesses = 6;
let currentDifficulty = "easy";
let currentCategory = "random";
let currentRound = 1;
let maxRounds = 5;
let hintsRemaining = 3;
let totalWrong = 0;
let totalCorrect = 0;
let ranking = [];
let isGameActive = true;
let usedWords = [];

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const wrongDisplay = document.getElementById("wrongGuesses");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const hintBtn = document.getElementById("hintBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const hintCount = document.getElementById("hintCount");
const hintText = document.getElementById("hintText");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const wordCounter = document.getElementById("wordCounter");
const maxRoundsDisplay = document.getElementById("maxRoundsDisplay");
const maxGuessesDisplay = document.getElementById("maxGuessesDisplay");
const hearts = document.querySelectorAll(".heart");
const livesCounter = document.getElementById("livesCounter");
const rankingList = document.getElementById("rankingList");
const fireCanvas = document.getElementById("fireCanvas");
const fireBackground = document.getElementById("fireBackground");
const timerDisplay = document.getElementById("timerDisplay");
const appContainer = document.getElementById("appContainer");
const muteBtn = document.getElementById("muteBtn");
const homeBtn = document.getElementById("homeBtn");
const rulesHeaderBtn = document.getElementById("rulesHeaderBtn");
const rulesCloseBtn = document.getElementById("rulesCloseBtn");
const rulesModal = document.getElementById("rulesModal");

const partIds = {
  head: document.getElementById("headPart"),
  body: document.getElementById("bodyPart"),
  armLeft: document.getElementById("armLeftPart"),
  armRight: document.getElementById("armRightPart"),
  legLeft: document.getElementById("legLeftPart"),
  legRight: document.getElementById("legRightPart")
};
const partOrder = ['head', 'body', 'armLeft', 'armRight', 'legLeft', 'legRight'];
const partOrderHard = ['head', 'body', 'legLeft'];

const difficultySettings = {
  easy: { minLen: 4, maxLen: 6, maxHints: 3, rounds: 10, timeLimit: 0, lives: 6 },
  medium: { minLen: 6, maxLen: 9, maxHints: 2, rounds: 8, timeLimit: 0, lives: 6 },
  hard: { minLen: 9, maxLen: 14, maxHints: 1, rounds: 6, timeLimit: 30, lives: 3 }
};

function loadRanking() {
  try {
    const data = localStorage.getItem('forca_ranking');
    if (data) ranking = JSON.parse(data);
  } catch {}
}

function saveRanking() {
  try {
    localStorage.setItem('forca_ranking', JSON.stringify(ranking));
  } catch {}
}

function addRankingEntry(score, errors) {
  loadRanking();
  ranking.push({ score, errors, date: new Date().toLocaleDateString() });
  ranking.sort((a, b) => b.score - a.score || a.errors - b.errors);
  if (ranking.length > 10) ranking = ranking.slice(0, 10);
  saveRanking();
  renderRanking();
}

function renderRanking() {
  if (!rankingList) return;
  if (!ranking.length) {
    rankingList.innerHTML = '<div class="rank-empty">Nenhuma partida ainda</div>';
    return;
  }
  rankingList.innerHTML = ranking.map((item, i) =>
    `<div class="rank-item">
      <span class="pos">#${i + 1}</span>
      <span>${item.score} acertos</span>
      <span class="score">${item.errors} erros</span>
      <span class="date">${item.date}</span>
    </div>`
  ).join('');
}

function normalizeWord(word) {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getRandomWord() {
  const settings = difficultySettings[currentDifficulty];

  function buildPool() {
    return wordList.filter(w => {
      if (currentCategory !== 'random' && w.category !== currentCategory) return false;
      const clean = normalizeWord(w.word);
      if (clean.length < settings.minLen || clean.length > settings.maxLen) return false;
      return !usedWords.includes(w.word.toLowerCase());
    });
  }

  let pool = buildPool();

  if (!pool.length) {
    usedWords = [];
    pool = buildPool();
  }

  if (!pool.length) {
    pool = wordList;
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  const word = selected.word.toLowerCase();
  usedWords.push(word);

  return {
    word,
    hint: `DEFINIÇÃO: ${selected.description}`
  };
}

function playSound(name) {
  if (!soundEnabled) return;
  const s = sounds[name];
  if (s) {
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}

function stopLoseSound() {
  sounds.lose.pause();
  sounds.lose.currentTime = 0;
}

function stopAllSounds() {
  Object.values(sounds).forEach(s => {
    if (s) {
      s.pause();
      s.currentTime = 0;
    }
  });
}

function toggleMute() {
  soundEnabled = !soundEnabled;
  if (!soundEnabled) stopAllSounds();
  if (muteBtn) {
    muteBtn.innerHTML = soundEnabled
      ? '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/><path d="M19.5 12c0-3.35-1.98-6.22-4.5-7.68v1.5c2.04 1.04 3.5 3.14 3.5 5.18s-1.46 4.14-3.5 5.18v1.5c2.52-1.46 4.5-4.33 4.5-7.68z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  }
}

function goHome() {
  stopAllSounds();
  stopTimer();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.location.href = 'index.html';
}

function initFireEffect(forceActive) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (forceActive) {
    if (fireBackground) fireBackground.classList.add('active');
  } else {
    if (fireBackground) fireBackground.classList.remove('active');
    return;
  }

  const canvas = fireCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const fw = 100, fh = 100;
  const ps = Math.max(5, Math.floor(canvas.width / fw));
  const fp = new Array(fw * fh).fill(0);

  function update() {
    for (let x = 0; x < fw; x++) {
      for (let y = 1; y < fh; y++) {
        const i = y * fw + x;
        const ny = Math.max(0, y - Math.floor(Math.random() * 3));
        const ni = ny * fw + x;
        fp[ni] = Math.max(0, fp[i] - Math.random() * 0.2);
      }
    }
    for (let x = 0; x < fw; x++) {
      const i = (fh - 1) * fw + x;
      fp[i] = Math.random() > 0.3 ? 1 : 0;
    }
    for (let x = 1; x < fw - 1; x++) {
      for (let y = 0; y < fh; y++) {
        const i = y * fw + x;
        if (fp[i] > 0.1) {
          const s = Math.random() * 0.2;
          fp[i - 1] = Math.min(1, fp[i - 1] + s);
          fp[i + 1] = Math.min(1, fp[i + 1] + s);
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < fw; x++) {
      for (let y = 0; y < fh; y++) {
        const i = y * fw + x;
        const inten = fp[i];
        if (inten > 0) {
          let r, g, b;
          if (inten > 0.8) { r = 255; g = 255; b = 255 * (inten - 0.8) * 5; }
          else if (inten > 0.6) { r = 255; g = 255 * (inten - 0.6) * 5; b = 0; }
          else if (inten > 0.3) { r = 255; g = 165 * (inten - 0.3) * 3.33; b = 0; }
          else { r = 255 * inten * 3.33; g = 0; b = 0; }
          ctx.fillStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${inten})`;
          ctx.fillRect(x * ps, canvas.height - (y * ps), ps, ps);
        }
      }
    }
  }

  function animate() {
    update();
    render();
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
}

function startTimer() {
  const settings = difficultySettings[currentDifficulty];
  if (settings.timeLimit === 0) {
    if (timerDisplay) timerDisplay.classList.remove('active', 'warning');
    return;
  }

  timeLeft = settings.timeLimit;
  if (timerDisplay) {
    timerDisplay.textContent = `⏱ ${timeLeft}s`;
    timerDisplay.classList.add('active');
  }

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerDisplay) timerDisplay.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft <= 5 && timerDisplay) {
      timerDisplay.classList.add('warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (timerDisplay) timerDisplay.classList.remove('active', 'warning');

      if (isGameActive) {
        totalWrong++;
        playSound("lose");
        message.innerHTML = `⏱ TEMPO ESGOTADO! A PALAVRA ERA "${selectedWord.toUpperCase()}"`;
        message.className = "message show error timer";
        isGameActive = false;
        shakeScreen();

        if (partIds.head) partIds.head.classList.add("dead");

        const order = currentDifficulty === 'hard' ? partOrderHard : partOrder;
        order.forEach(id => {
          const p = partIds[id];
          if (p) p.classList.add("dead");
        });

        hearts.forEach(h => h.classList.add("lost"));
        updateLivesCounter();

        document.querySelectorAll(".key-btn").forEach(b => b.disabled = true);

        handleEndOfGame(1500);
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  if (timerDisplay) timerDisplay.classList.remove('active', 'warning');
}

function createConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#ff2a6d', '#05d9e8', '#00ff9d', '#f9f002', '#d300c5', '#ff6b35', '#ffcc00', '#ff0040'];

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 1.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotate = Math.random() * 360;
    const shape = Math.random() > 0.5 ? '50%' : '2px';

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size * (Math.random() * 2 + 0.5)}px;
      background: ${color};
      border-radius: ${shape};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      transform: rotate(${rotate}deg);
      box-shadow: 0 0 10px ${color};
    `;

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.remove();
  }, 5000);
}

function shakeScreen() {
  if (!appContainer) return;
  appContainer.classList.add('shake-screen');
  setTimeout(() => {
    appContainer.classList.remove('shake-screen');
  }, 500);
}

function resetHangman() {
  partOrder.forEach(id => {
    const p = partIds[id];
    if (p) p.classList.remove("visible", "dead");
  });
  if (partIds.head) partIds.head.classList.remove("dead");
}

function getActivePartOrder() {
  return currentDifficulty === 'hard' ? partOrderHard : partOrder;
}

function updateLivesCounter() {
  if (!livesCounter) return;
  const remaining = Math.max(0, maxGuesses - wrongGuesses);
  livesCounter.textContent = `❤ ${remaining}/${maxGuesses}`;
}

function initGame() {
  stopLoseSound();
  stopTimer();
  isGameActive = true;

  const badge = document.getElementById('categoryBadge');
  const catNames = {
    'random': 'Aleatório',
    'animais': 'Animais',
    'paises': 'Países',
    'tecnologia': 'Tecnologia',
    'cinema': 'Cinema',
    'musica': 'Música'
  };
  if (badge) badge.textContent = `Categoria: ${catNames[currentCategory] || currentCategory}`;

  updateDifficultyBadge();

  const { word, hint } = getRandomWord();
  selectedWord = word;
  displayedWord = [];

  for (let i = 0; i < selectedWord.length; i++) {
    const char = selectedWord[i];
    if (char === ' ' || char === '-') {
      displayedWord.push(char);
    } else {
      displayedWord.push('_');
    }
  }

  wrongGuesses = 0;

  const settings = difficultySettings[currentDifficulty];
  hintsRemaining = settings.maxHints;
  maxGuesses = settings.lives;

  if (maxGuessesDisplay) maxGuessesDisplay.textContent = `/${maxGuesses}`;

  renderWord();
  updateProgress();
  if (wrongDisplay) wrongDisplay.textContent = wrongGuesses;
  if (wordCounter) wordCounter.textContent = currentRound;
  if (message) {
    message.textContent = "";
    message.className = "message";
  }
  if (restartBtn) restartBtn.classList.remove("show");
  if (giveUpBtn) {
    giveUpBtn.disabled = false;
    giveUpBtn.style.opacity = "1";
  }
  if (hintBtn) {
    hintBtn.disabled = false;
    hintBtn.style.opacity = "1";
  }
  if (hintCount) hintCount.textContent = hintsRemaining;
  if (hintText) hintText.textContent = hint;

  resetHangman();

  const totalHearts = hearts.length;
  const heartsToLose = totalHearts - maxGuesses;
  hearts.forEach((h, i) => {
    h.classList.remove("lost");
    if (i < heartsToLose) {
      h.classList.add("lost");
    }
  });

  updateLivesCounter();

  if (keyboard) {
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i).toLowerCase();
      const btn = document.createElement("button");
      btn.className = "key-btn";
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.addEventListener("click", () => handleGuess(letter, btn));
      keyboard.appendChild(btn);
    }
  }

  initFireEffect(currentDifficulty === 'hard');

  if (settings.timeLimit > 0) {
    setTimeout(startTimer, 300);
  }
}

function renderWord() {
  let html = '';
  for (let i = 0; i < displayedWord.length; i++) {
    const char = displayedWord[i];
    if (char === ' ') {
      html += `<span style="display:inline-block; min-width:20px; border-bottom: none;">&nbsp;&nbsp;</span>`;
    } else if (char === '-') {
      html += `<span style="display:inline-block; color:#fff; min-width:10px; border-bottom: none;">-</span>`;
    } else if (char === '_') {
      html += `<span class="letter" style="border-bottom: 4px solid rgba(255,255,255,0.2); min-width:28px; display:inline-block;">&nbsp;</span>`;
    } else {
      html += `<span class="letter revealed" style="border-bottom: none; color:#fff;">${char}</span>`;
    }
  }
  if (wordDisplay) wordDisplay.innerHTML = html;
}

function updateProgress() {
  const total = selectedWord.replace(/[\s-]/g, '').length;
  const found = displayedWord.filter((char) => {
    if (char === ' ' || char === '-') return false;
    return char !== '_';
  }).length;
  const pct = total > 0 ? Math.round((found / total) * 100) : 0;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${pct}%`;
}

function useHint() {
  if (hintsRemaining <= 0 || !isGameActive) {
    message.textContent = "SEM DICAS RESTANTES!";
    message.className = "message show error";
    setTimeout(() => { message.className = "message"; }, 1500);
    return;
  }

  const hidden = displayedWord.map((char, i) => {
    if (char === '_' && selectedWord[i] !== ' ' && selectedWord[i] !== '-') return i;
    return -1;
  }).filter(i => i >= 0);

  if (!hidden.length) {
    message.textContent = "TODAS AS LETRAS JÁ FORAM REVELADAS!";
    message.className = "message show info";
    setTimeout(() => { message.className = "message"; }, 1500);
    return;
  }

  const randomIndex = hidden[Math.floor(Math.random() * hidden.length)];
  const letter = selectedWord[randomIndex];

  let revealed = false;
  for (let i = 0; i < selectedWord.length; i++) {
    const char = selectedWord[i];
    if (char === letter && displayedWord[i] === '_') {
      displayedWord[i] = char;
      revealed = true;
    }
  }

  if (revealed) {
    hintsRemaining--;
    if (hintCount) hintCount.textContent = hintsRemaining;
    renderWord();
    updateProgress();
    playSound("correct");

    const cleanLetter = letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const btn = document.querySelector(`.key-btn[data-letter="${cleanLetter}"]`);
    if (btn && !btn.classList.contains('correct')) {
      btn.classList.add('correct');
      btn.disabled = true;
    }

    message.textContent = `LETRA "${letter.toUpperCase()}" REVELADA!`;
    message.className = "message show info";
    setTimeout(() => { message.className = "message"; }, 1200);
  }

  if (hintsRemaining <= 0) {
    hintBtn.disabled = true;
    hintBtn.style.opacity = "0.3";
  }

  checkGameStatus();
}

function handleGuess(letter, btn) {
  if (!isGameActive) return;
  playSound("click");
  btn.disabled = true;

  const cleanLetter = letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const wordWithoutAccents = selectedWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (wordWithoutAccents.includes(cleanLetter)) {
    playSound("correct");
    btn.classList.add("correct");

    let revealed = false;
    for (let i = 0; i < selectedWord.length; i++) {
      const char = selectedWord[i];
      const cleanChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (cleanChar === cleanLetter && displayedWord[i] === '_') {
        displayedWord[i] = char;
        revealed = true;
      }
    }

    if (revealed) {
      renderWord();
      updateProgress();
    }
  } else {
    playSound("wrong");
    wrongGuesses++;
    if (wrongDisplay) wrongDisplay.textContent = wrongGuesses;
    btn.classList.add("wrong");

    const order = getActivePartOrder();

    if (wrongGuesses <= maxGuesses) {
      const id = order[wrongGuesses - 1];
      const p = partIds[id];
      if (p) p.classList.add("visible");
    }

    if (wrongGuesses <= maxGuesses) {
      const idx = maxGuesses - wrongGuesses;
      const heartIndex = hearts.length - 1 - idx;
      if (hearts[heartIndex]) hearts[heartIndex].classList.add("lost");
    }

    updateLivesCounter();
  }

  checkGameStatus();
}

function giveUp() {
  if (!isGameActive) return;
  totalWrong++;
  playSound("lose");
  stopTimer();
  message.innerHTML = `VOCÊ DESISTIU! A PALAVRA ERA "${selectedWord.toUpperCase()}"`;
  message.className = "message show error";
  isGameActive = false;
  shakeScreen();

  if (partIds.head) partIds.head.classList.add("dead");

  const order = getActivePartOrder();
  order.forEach(id => {
    const p = partIds[id];
    if (p) p.classList.add("dead");
  });

  hearts.forEach(h => h.classList.add("lost"));
  updateLivesCounter();

  document.querySelectorAll(".key-btn").forEach(b => b.disabled = true);
  if (giveUpBtn) {
    giveUpBtn.disabled = true;
    giveUpBtn.style.opacity = "0.3";
  }
  if (hintBtn) {
    hintBtn.disabled = true;
    hintBtn.style.opacity = "0.3";
  }

  handleEndOfGame(2000);
}

function handleEndOfGame(delay) {
  if (currentRound >= maxRounds) {
    setTimeout(() => {
      message.textContent = `FIM DE JOGO! ${totalCorrect} ACERTOS EM ${maxRounds} RODADAS!`;
      message.className = "message show success";
      addRankingEntry(totalCorrect, totalWrong);
      endGame();
    }, delay);
  } else {
    setTimeout(() => {
      currentRound++;
      initGame();
    }, delay);
  }
}

function checkGameStatus() {
  if (!isGameActive) return;

  const allRevealed = displayedWord.every((char, i) => {
    if (selectedWord[i] === ' ' || selectedWord[i] === '-') return true;
    return char !== '_';
  });

  if (allRevealed) {
    totalCorrect++;
    playSound("win");
    stopTimer();
    message.textContent = "VOCÊ VENCEU!";
    message.className = "message show success";
    isGameActive = false;
    createConfetti();
    handleEndOfGame(1500);
    return;
  }

  if (wrongGuesses >= maxGuesses) {
    totalWrong++;
    playSound("lose");
    stopTimer();
    message.innerHTML = `VOCÊ PERDEU! A PALAVRA ERA "${selectedWord.toUpperCase()}"`;
    message.className = "message show error";
    isGameActive = false;
    shakeScreen();

    if (partIds.head) partIds.head.classList.add("dead");

    const order = getActivePartOrder();
    order.forEach(id => {
      const p = partIds[id];
      if (p) p.classList.add("dead");
    });

    hearts.forEach(h => h.classList.add("lost"));
    updateLivesCounter();

    handleEndOfGame(2000);
  }
}

function endGame() {
  document.querySelectorAll(".key-btn").forEach(b => b.disabled = true);
  if (restartBtn) restartBtn.classList.add("show");
  stopTimer();
  isGameActive = false;
}

function startGame(difficulty, category) {
  currentDifficulty = difficulty;
  currentCategory = category;
  const settings = difficultySettings[difficulty];
  maxRounds = settings.rounds;
  maxGuesses = settings.lives;
  currentRound = 1;
  totalCorrect = 0;
  totalWrong = 0;
  usedWords = [];
  if (maxRoundsDisplay) maxRoundsDisplay.textContent = `/${maxRounds}`;
  if (maxGuessesDisplay) maxGuessesDisplay.textContent = `/${maxGuesses}`;
  initGame();
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    difficulty: params.get('difficulty') || 'easy',
    category: params.get('category') || 'random'
  };
}

function updateDifficultyBadge() {
  const badge = document.getElementById('difficultyBadge');
  if (!badge) return;
  const diffNames = {
    'easy': 'Fácil',
    'medium': 'Médio',
    'hard': 'Difícil'
  };
  badge.textContent = `${diffNames[currentDifficulty] || currentDifficulty}`;
}

function openRules() {
  if (rulesModal) rulesModal.style.display = 'flex';
}

function closeRules() {
  if (rulesModal) rulesModal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  if (homeBtn) {
    homeBtn.addEventListener('click', function() {
      playSound("click");
      goHome();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', function() {
      playSound("click");
      toggleMute();
    });
  }

  if (rulesHeaderBtn) {
    rulesHeaderBtn.addEventListener('click', function() {
      playSound("click");
      openRules();
    });
  }

  if (rulesCloseBtn) {
    rulesCloseBtn.addEventListener('click', function() {
      playSound("click");
      closeRules();
    });
  }

  if (rulesModal) {
    rulesModal.addEventListener('click', function(e) {
      if (e.target === this) {
        playSound("click");
        closeRules();
      }
    });
  }

  if (hintBtn) {
    hintBtn.addEventListener('click', function() {
      playSound("click");
      useHint();
    });
  }

  if (giveUpBtn) {
    giveUpBtn.addEventListener('click', function() {
      playSound("click");
      giveUp();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', function() {
      playSound("click");
      setTimeout(function() {
        stopLoseSound();
        stopTimer();
        currentRound = 1;
        totalCorrect = 0;
        totalWrong = 0;
        usedWords = [];
        const params = getQueryParams();
        startGame(params.difficulty, params.category);
      }, 300);
    });
  }

  document.addEventListener("keydown", function(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90 && isGameActive) {
      const letter = e.key.toLowerCase();
      const btn = document.querySelector(`.key-btn[data-letter="${letter}"]`);
      if (btn && !btn.disabled) btn.click();
    }
  });

  window.addEventListener('resize', function() {
    const c = fireCanvas;
    if (c) {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
  });

  loadRanking();
  renderRanking();

  const params = getQueryParams();
  startGame(params.difficulty, params.category);
});