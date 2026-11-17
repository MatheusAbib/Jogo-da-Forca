
const sounds = {
  correct: new Audio("./sounds/correct.mp3"),
  wrong: new Audio("./sounds/error.mp3"),
  win: new Audio("./sounds/win.mp3"),
  lose: new Audio("./sounds/lost.wav"),
  click: new Audio("./sounds/click.wav"),
  play: new Audio("./sounds/start.mp3")
};

Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
  sound.load();
});

let soundEnabled = true;
let animationFrameId = null;
let timerInterval = null;
let roundTimeout = null;
let messageTimeout = null;
let timeLeft = 30;
let selectedWord = "";
let displayedWord = [];
let wrongGuesses = 0;
let maxGuesses = 6;
let currentDifficulty = "easy";
let currentCategory = "random";
let currentRound = 1;
let maxRounds = 10;
let hintsRemaining = 3;
let totalWrong = 0;
let totalCorrect = 0;
let ranking = [];
let isGameActive = false;
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
const hearts = [...document.querySelectorAll(".heart")];
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

const partOrder = [
  "head",
  "body",
  "armLeft",
  "armRight",
  "legLeft",
  "legRight"
];

const partOrderHard = [
  "head",
  "body",
  "legLeft"
];

const difficultySettings = {
  easy: {
    minLen: 4,
    maxLen: 6,
    maxHints: 3,
    rounds: 10,
    timeLimit: 0,
    lives: 6
  },
  medium: {
    minLen: 6,
    maxLen: 9,
    maxHints: 2,
    rounds: 8,
    timeLimit: 0,
    lives: 6
  },
  hard: {
    minLen: 9,
    maxLen: 14,
    maxHints: 1,
    rounds: 6,
    timeLimit: 30,
    lives: 3
  }
};

const categoryNames = {
  random: "Aleatório",
  animais: "Animais",
  paises: "Países",
  tecnologia: "Tecnologia",
  cinema: "Cinema",
  musica: "Música"
};

const difficultyNames = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil"
};

function playSound(name) {
  if (!soundEnabled) return;

  const sound = sounds[name];

  if (!sound) return;

  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function stopAllSounds() {
  Object.values(sounds).forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });
}

function stopLoseSound() {
  sounds.lose.pause();
  sounds.lose.currentTime = 0;
}

function toggleMute() {
  soundEnabled = !soundEnabled;

  if (!soundEnabled) {
    stopAllSounds();
  }

  if (!muteBtn) return;

  muteBtn.setAttribute(
    "aria-label",
    soundEnabled ? "Desativar som" : "Ativar som"
  );

  muteBtn.setAttribute(
    "title",
    soundEnabled ? "Desativar som" : "Ativar som"
  );

  muteBtn.setAttribute("aria-pressed", String(!soundEnabled));

  muteBtn.innerHTML = soundEnabled
    ? `<svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M3 9v6h4l5 5V4L7 9H3z"/>
         <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
         <path d="M19.5 12c0-3.35-1.98-6.22-4.5-7.68v1.5c2.04 1.04 3.5 3.14 3.5 5.18s-1.46 4.14-3.5 5.18v1.5c2.52-1.46 4.5-4.33 4.5-7.68z"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
       </svg>`;
}

function goHome() {
  stopAllSounds();
  stopTimer();
  clearTimeout(roundTimeout);
  clearTimeout(messageTimeout);
  initFireEffect(false);
  window.location.href = "index.html";
}

function loadRanking() {
  try {
    const stored = localStorage.getItem("forca_ranking");
    const parsed = stored ? JSON.parse(stored) : [];

    ranking = Array.isArray(parsed) ? parsed : [];
  } catch {
    ranking = [];
  }
}

function saveRanking() {
  try {
    localStorage.setItem("forca_ranking", JSON.stringify(ranking));
  } catch {}
}

function addRankingEntry(score, errors) {
  loadRanking();

  ranking.push({
    score,
    errors,
    date: new Date().toLocaleDateString("pt-BR")
  });

  ranking.sort((a, b) => {
    return b.score - a.score || a.errors - b.errors;
  });

  ranking = ranking.slice(0, 10);

  saveRanking();
  renderRanking();
}

function renderRanking() {
  if (!rankingList) return;

  rankingList.replaceChildren();

  if (!ranking.length) {
    const empty = document.createElement("div");
    empty.className = "rank-empty";
    empty.textContent = "Nenhuma partida ainda";
    rankingList.appendChild(empty);
    return;
  }

  ranking.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "rank-item";

    const position = document.createElement("span");
    position.className = "pos";
    position.textContent = `#${index + 1}`;

    const score = document.createElement("span");
    score.textContent = `${item.score} acertos`;

    const errors = document.createElement("span");
    errors.className = "score";
    errors.textContent = `${item.errors} erros`;

    const date = document.createElement("span");
    date.className = "date";
    date.textContent = item.date;

    row.append(position, score, errors, date);
    rankingList.appendChild(row);
  });
}

function normalizeWord(word) {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getRandomWord() {
  const settings = difficultySettings[currentDifficulty];

  const buildPool = () => {
    return wordList.filter(item => {
      if (
        currentCategory !== "random" &&
        item.category !== currentCategory
      ) {
        return false;
      }

      const clean = normalizeWord(item.word);

      if (
        clean.length < settings.minLen ||
        clean.length > settings.maxLen
      ) {
        return false;
      }

      return !usedWords.includes(item.word.toLowerCase());
    });
  };

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

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);

  const requestedDifficulty = params.get("difficulty") || "easy";
  const requestedCategory = params.get("category") || "random";

  return {
    difficulty: difficultySettings[requestedDifficulty]
      ? requestedDifficulty
      : "easy",
    category: requestedCategory
  };
}

function updateDifficultyBadge() {
  const badge = document.getElementById("difficultyBadge");

  if (!badge) return;

  badge.textContent =
    `Dificuldade: ${difficultyNames[currentDifficulty] || currentDifficulty}`;
}

function updateCategoryBadge() {
  const badge = document.getElementById("categoryBadge");

  if (!badge) return;

  badge.textContent =
    `Categoria: ${categoryNames[currentCategory] || currentCategory}`;
}

function initFireEffect(forceActive) {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (fireBackground) {
    fireBackground.classList.toggle("active", Boolean(forceActive));
  }

  if (!forceActive || !fireCanvas) return;

  const context = fireCanvas.getContext("2d");

  if (!context) return;

  const width = 100;
  const height = 100;
  const pixels = new Float32Array(width * height);

  const resizeCanvas = () => {
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
  };

  resizeCanvas();

  const update = () => {
    for (let y = 1; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const nextY = Math.max(0, y - Math.floor(Math.random() * 3));
        const nextIndex = nextY * width + x;

        pixels[nextIndex] = Math.max(
          0,
          pixels[index] - Math.random() * 0.2
        );
      }
    }

    for (let x = 0; x < width; x++) {
      pixels[(height - 1) * width + x] =
        Math.random() > 0.3 ? 1 : 0;
    }

    for (let x = 1; x < width - 1; x++) {
      for (let y = 0; y < height; y++) {
        const index = y * width + x;

        if (pixels[index] > 0.1) {
          const spread = Math.random() * 0.2;

          pixels[index - 1] = Math.min(
            1,
            pixels[index - 1] + spread
          );

          pixels[index + 1] = Math.min(
            1,
            pixels[index + 1] + spread
          );
        }
      }
    }
  };

  const render = () => {
    const canvasWidth = fireCanvas.width;
    const canvasHeight = fireCanvas.height;
    const pixelWidth = canvasWidth / width;
    const pixelHeight = canvasHeight / height;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const intensity = pixels[y * width + x];

        if (intensity <= 0) continue;

        let red;
        let green;
        let blue;

        if (intensity > 0.8) {
          red = 255;
          green = 221;
          blue = 143;
        } else if (intensity > 0.6) {
          red = 210;
          green = 132;
          blue = 81;
        } else if (intensity > 0.3) {
          red = 145;
          green = 65;
          blue = 61;
        } else {
          red = 91;
          green = 37;
          blue = 56;
        }

        context.fillStyle =
          `rgba(${red}, ${green}, ${blue}, ${intensity * 0.7})`;

        context.fillRect(
          x * pixelWidth,
          canvasHeight - (y + 1) * pixelHeight,
          Math.ceil(pixelWidth),
          Math.ceil(pixelHeight)
        );
      }
    }
  };

  const animate = () => {
    update();
    render();
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  if (timerDisplay) {
    timerDisplay.classList.remove("active", "warning");
  }
}

function startTimer() {
  const settings = difficultySettings[currentDifficulty];

  stopTimer();

  if (!settings.timeLimit || !isGameActive) return;

  timeLeft = settings.timeLimit;

  if (timerDisplay) {
    timerDisplay.textContent = `${timeLeft}s`;
    timerDisplay.classList.add("active");
  }

  timerInterval = setInterval(() => {
    if (!isGameActive) {
      stopTimer();
      return;
    }

    timeLeft = Math.max(0, timeLeft - 1);

    if (timerDisplay) {
      timerDisplay.textContent = `${timeLeft}s`;
      timerDisplay.classList.toggle("warning", timeLeft <= 5);
    }

    if (timeLeft === 0) {
      finishRound(
        false,
        `TEMPO ESGOTADO! A PALAVRA ERA "${selectedWord.toUpperCase()}"`,
        true
      );
    }
  }, 1000);
}

function createConfetti() {
  const container = document.createElement("div");
  container.className = "confetti-container";

  document.body.appendChild(container);

  const colors = [
    "#e3c38d",
    "#c6a16b",
    "#762d47",
    "#a34460",
    "#f1e3c8",
    "#80533a"
  ];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    const size = Math.random() * 7 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (Math.random() + 0.6)}px`;
    piece.style.backgroundColor = color;
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "1px";
    piece.style.animationDuration = `${Math.random() * 2 + 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}

function shakeScreen() {
  if (!appContainer) return;

  appContainer.classList.remove("shake-screen");
  void appContainer.offsetWidth;
  appContainer.classList.add("shake-screen");

  setTimeout(() => {
    appContainer.classList.remove("shake-screen");
  }, 400);
}

function resetHangman() {
  partOrder.forEach(id => {
    const part = partIds[id];

    if (part) {
      part.classList.remove("visible", "dead");
    }
  });

  const mouth = document.querySelector(".mouth");

  if (mouth) {
    mouth.classList.remove("dead");
  }
}

function getActivePartOrder() {
  return currentDifficulty === "hard"
    ? partOrderHard
    : partOrder;
}

function updateLivesCounter() {
  const remaining = Math.max(0, maxGuesses - wrongGuesses);

  if (livesCounter) {
    livesCounter.textContent = `${remaining}/${maxGuesses}`;
  }

  const inactiveHearts = hearts.length - maxGuesses;

  hearts.forEach((heart, index) => {
    const unavailable = index < inactiveHearts;
    const activeIndex = index - inactiveHearts;
    const lost = activeIndex >= remaining;

    heart.classList.toggle("lost", unavailable || lost);
  });
}

function updateProgress() {
  const total = selectedWord.replace(/[\s-]/g, "").length;

  const found = displayedWord.filter(char => {
    return char !== "_" && char !== " " && char !== "-";
  }).length;

  const percentage = total
    ? Math.round((found / total) * 100)
    : 0;

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  if (progressText) {
    progressText.textContent = `${percentage}%`;
  }

  const progressBar = document.querySelector(".progress-bar");

  if (progressBar) {
    progressBar.setAttribute("aria-valuenow", String(percentage));
  }
}

function renderWord() {
  if (!wordDisplay) return;

  wordDisplay.replaceChildren();

  displayedWord.forEach(char => {
    const span = document.createElement("span");

    if (char === " ") {
      span.className = "word-space";
      span.textContent = "\u00a0\u00a0";
    } else if (char === "-") {
      span.className = "word-hyphen";
      span.textContent = "-";
    } else {
      span.className = char === "_" ? "letter" : "letter revealed";
      span.textContent = char === "_" ? "\u00a0" : char;
    }

    wordDisplay.appendChild(span);
  });
}

function showMessage(text, type = "info", duration = 0) {
  if (!message) return;

  clearTimeout(messageTimeout);

  message.textContent = text;
  message.className = `message show ${type}`;

  if (duration > 0) {
    messageTimeout = setTimeout(() => {
      message.className = "message";
    }, duration);
  }
}

function clearMessage() {
  clearTimeout(messageTimeout);

  if (message) {
    message.textContent = "";
    message.className = "message";
  }
}

function renderKeyboard() {
  if (!keyboard) return;

  keyboard.replaceChildren();

  for (let code = 65; code <= 90; code++) {
    const letter = String.fromCharCode(code).toLowerCase();
    const button = document.createElement("button");

    button.type = "button";
    button.className = "key-btn";
    button.textContent = letter.toUpperCase();
    button.dataset.letter = letter;
    button.setAttribute("aria-label", `Letra ${letter.toUpperCase()}`);

    button.addEventListener("click", () => {
      handleGuess(letter, button);
    });

    keyboard.appendChild(button);
  }
}

function initGame() {
  stopLoseSound();
  stopTimer();
  clearTimeout(roundTimeout);
  clearMessage();

  isGameActive = true;

  const settings = difficultySettings[currentDifficulty];
  const selection = getRandomWord();

  selectedWord = selection.word;

  displayedWord = [...selectedWord].map(char => {
    return char === " " || char === "-" ? char : "_";
  });

  wrongGuesses = 0;
  maxGuesses = settings.lives;
  hintsRemaining = settings.maxHints;

  updateCategoryBadge();
  updateDifficultyBadge();

  if (wrongDisplay) {
    wrongDisplay.textContent = "0";
  }

  if (wordCounter) {
    wordCounter.textContent = String(currentRound);
  }

  if (maxRoundsDisplay) {
    maxRoundsDisplay.textContent = String(maxRounds);
  }

  if (maxGuessesDisplay) {
    maxGuessesDisplay.textContent = String(maxGuesses);
  }

  if (hintCount) {
    hintCount.textContent = String(hintsRemaining);
  }

  if (hintText) {
    hintText.textContent = selection.hint;
  }

  if (restartBtn) {
    restartBtn.classList.remove("show");
  }

  if (giveUpBtn) {
    giveUpBtn.disabled = false;
    giveUpBtn.style.opacity = "";
  }

  if (hintBtn) {
    hintBtn.disabled = false;
    hintBtn.style.opacity = "";
  }

  resetHangman();
  updateLivesCounter();
  renderWord();
  updateProgress();
  renderKeyboard();

  initFireEffect(currentDifficulty === "hard");

  if (settings.timeLimit > 0) {
    startTimer();
  }
}

function useHint() {
  if (!isGameActive) return;

  if (hintsRemaining <= 0) {
    showMessage("SEM DICAS RESTANTES!", "error", 1500);
    return;
  }

  const hidden = displayedWord
    .map((char, index) => char === "_" ? index : -1)
    .filter(index => index >= 0);

  if (!hidden.length) {
    showMessage(
      "TODAS AS LETRAS JÁ FORAM REVELADAS!",
      "info",
      1500
    );
    return;
  }

  const randomIndex = hidden[Math.floor(Math.random() * hidden.length)];
  const letter = selectedWord[randomIndex];
  const normalizedLetter = normalizeWord(letter);

  for (let i = 0; i < selectedWord.length; i++) {
    if (
      normalizeWord(selectedWord[i]) === normalizedLetter &&
      displayedWord[i] === "_"
    ) {
      displayedWord[i] = selectedWord[i];
    }
  }

  hintsRemaining--;

  if (hintCount) {
    hintCount.textContent = String(hintsRemaining);
  }

  const button = document.querySelector(
    `.key-btn[data-letter="${normalizedLetter}"]`
  );

  if (button) {
    button.classList.add("correct");
    button.disabled = true;
  }

  if (hintsRemaining <= 0 && hintBtn) {
    hintBtn.disabled = true;
  }

  renderWord();
  updateProgress();
  playSound("correct");

  showMessage(
    `LETRA "${letter.toUpperCase()}" REVELADA!`,
    "info",
    1200
  );

  checkGameStatus();
}

function handleGuess(letter, button) {
  if (!isGameActive || button.disabled) return;

  playSound("click");

  button.disabled = true;

  const cleanLetter = normalizeWord(letter);
  const cleanWord = normalizeWord(selectedWord);

  if (cleanWord.includes(cleanLetter)) {
    playSound("correct");
    button.classList.add("correct");

    for (let i = 0; i < selectedWord.length; i++) {
      if (
        normalizeWord(selectedWord[i]) === cleanLetter &&
        displayedWord[i] === "_"
      ) {
        displayedWord[i] = selectedWord[i];
      }
    }

    renderWord();
    updateProgress();
  } else {
    playSound("wrong");

    wrongGuesses++;
    button.classList.add("wrong");

    if (wrongDisplay) {
      wrongDisplay.textContent = String(wrongGuesses);
    }

    const order = getActivePartOrder();
    const part = partIds[order[wrongGuesses - 1]];

    if (part) {
      part.classList.add("visible");
    }

    updateLivesCounter();
  }

  checkGameStatus();
}

function disableRoundControls() {
  document.querySelectorAll(".key-btn").forEach(button => {
    button.disabled = true;
  });

  if (giveUpBtn) {
    giveUpBtn.disabled = true;
  }

  if (hintBtn) {
    hintBtn.disabled = true;
  }
}

function showDefeatedCharacter() {
  const order = getActivePartOrder();

  order.forEach(id => {
    const part = partIds[id];

    if (part) {
      part.classList.add("visible", "dead");
    }
  });

  if (partIds.head) {
    partIds.head.classList.add("dead");
  }

  const mouth = document.querySelector(".mouth");

  if (mouth) {
    mouth.classList.add("dead");
  }
}

function finishRound(won, text, timedOut = false) {
  if (!isGameActive) return;

  isGameActive = false;
  stopTimer();
  disableRoundControls();

  if (won) {
    totalCorrect++;
    playSound("win");
    showMessage(text, "success");
    createConfetti();
  } else {
    totalWrong++;
    playSound("lose");
    showDefeatedCharacter();
    shakeScreen();

    wrongGuesses = maxGuesses;

    if (wrongDisplay) {
      wrongDisplay.textContent = String(maxGuesses);
    }

    updateLivesCounter();
    showMessage(text, timedOut ? "error timer" : "error");
  }

  handleEndOfGame(won ? 1500 : 2000);
}

function checkGameStatus() {
  if (!isGameActive) return;

  const allRevealed = displayedWord.every(char => char !== "_");

  if (allRevealed) {
    finishRound(true, "PALAVRA DESCOBERTA! VOCÊ VENCEU!");
    return;
  }

  if (wrongGuesses >= maxGuesses) {
    finishRound(
      false,
      `VOCÊ PERDEU! A PALAVRA ERA "${selectedWord.toUpperCase()}"`
    );
  }
}

function giveUp() {
  if (!isGameActive) return;

  finishRound(
    false,
    `VOCÊ DESISTIU! A PALAVRA ERA "${selectedWord.toUpperCase()}"`
  );
}

function handleEndOfGame(delay) {
  clearTimeout(roundTimeout);

  roundTimeout = setTimeout(() => {
    if (currentRound >= maxRounds) {
      showMessage(
        `FIM DO ESPETÁCULO! ${totalCorrect} ACERTOS EM ${maxRounds} RODADAS!`,
        "success"
      );

      addRankingEntry(totalCorrect, totalWrong);
      endGame();
      return;
    }

    currentRound++;
    initGame();
  }, delay);
}

function endGame() {
  isGameActive = false;
  stopTimer();
  disableRoundControls();

  if (restartBtn) {
    restartBtn.classList.add("show");
  }
}

function startGame(difficulty, category) {
  currentDifficulty = difficultySettings[difficulty]
    ? difficulty
    : "easy";

  currentCategory = category || "random";

  const settings = difficultySettings[currentDifficulty];

  maxRounds = settings.rounds;
  maxGuesses = settings.lives;
  currentRound = 1;
  totalCorrect = 0;
  totalWrong = 0;
  usedWords = [];

  initGame();
}

function restartGame() {
  clearTimeout(roundTimeout);
  clearTimeout(messageTimeout);

  stopLoseSound();
  stopTimer();

  const params = getQueryParams();

  startGame(params.difficulty, params.category);
}

function openRules() {
  if (!rulesModal) return;

  rulesModal.style.display = "flex";

  if (rulesCloseBtn) {
    rulesCloseBtn.focus();
  }
}

function closeRules() {
  if (!rulesModal) return;

  rulesModal.style.display = "none";

  if (rulesHeaderBtn) {
    rulesHeaderBtn.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      playSound("click");
      goHome();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      playSound("click");
      toggleMute();
    });
  }

  if (rulesHeaderBtn) {
    rulesHeaderBtn.addEventListener("click", () => {
      playSound("click");
      openRules();
    });
  }

  if (rulesCloseBtn) {
    rulesCloseBtn.addEventListener("click", () => {
      playSound("click");
      closeRules();
    });
  }

  if (rulesModal) {
    rulesModal.addEventListener("click", event => {
      if (event.target === rulesModal) {
        closeRules();
      }
    });
  }

  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      playSound("click");
      useHint();
    });
  }

  if (giveUpBtn) {
    giveUpBtn.addEventListener("click", () => {
      playSound("click");
      giveUp();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      playSound("click");
      restartGame();
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (rulesModal && rulesModal.style.display !== "none") {
        closeRules();
      }
      return;
    }

    if (!isGameActive) return;

    if (rulesModal && rulesModal.style.display !== "none") {
      return;
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    const letter = event.key.toLowerCase();

    if (!/^[a-z]$/.test(letter)) return;

    const button = document.querySelector(
      `.key-btn[data-letter="${letter}"]`
    );

    if (button && !button.disabled) {
      button.click();
    }
  });

  window.addEventListener("resize", () => {
    if (!fireCanvas) return;

    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
  });

  loadRanking();
  renderRanking();

  const params = getQueryParams();

  startGame(params.difficulty, params.category);
});
