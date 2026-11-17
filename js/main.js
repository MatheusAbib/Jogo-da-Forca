
const sounds = {
  correct: new Audio("./sounds/correct.mp3"),
  wrong: new Audio("./sounds/error.mp3"),
  win: new Audio("./sounds/win.mp3"),
  play: new Audio("./sounds/start.mp3"),
  click: new Audio("./sounds/click.wav"),
  ambient: new Audio("./sounds/ambient.wav")
};

sounds.click.volume = 0.25;
sounds.play.volume = 0.4;
sounds.correct.volume = 0.3;
sounds.wrong.volume = 0.3;
sounds.win.volume = 0.3;
sounds.ambient.volume = 0.12;
sounds.ambient.loop = true;

const homeScreen = document.getElementById("homeScreen");
const curtainTransition = document.getElementById("curtainTransition");
const characterSpeech = document.getElementById("characterSpeech");

const categoryButtons = Array.from(
  document.querySelectorAll(".home-category-options button[data-cat]")
);

const difficultyButtons = Array.from(
  document.querySelectorAll(".home-diff-options button[data-diff]")
);

const footlights = Array.from(document.querySelectorAll(".footlight"));
const modal = document.getElementById("rulesModal");
const playBtn = document.getElementById("playBtn");
const rulesHomeBtn = document.getElementById("rulesHomeBtn");
const rulesCloseBtn = document.getElementById("rulesCloseBtn");
const soundToggle = document.getElementById("soundToggle");
const soundToggleLabel = soundToggle?.querySelector(".sound-toggle-label");
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");
const toastClose = document.getElementById("toastClose");

const historyHomeBtn = document.getElementById("historyHomeBtn");
const historyModal = document.getElementById("historyModal");
const historyCloseBtn = document.getElementById("historyCloseBtn");
const historyList = document.getElementById("historyList");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const THEATER_TIMING = {
  openingDelay: 350,
  openingDuration: 2300,
  lightsStart: 1150,
  lightInterval: 125,
  navigationDelay: 1350
};

let currentCategory = "random";
let currentDifficulty = "easy";
let soundEnabled = true;
let ambientStarted = false;
let ambientWasPlaying = false;
let toastTimeoutId = null;
let previousFocus = null;
let isNavigating = false;
let theaterOpened = false;
let theaterOpening = false;
let theaterClosing = false;
let theaterTimers = [];
let lightTimers = [];
let historyPreviousFocus = null;


function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function scheduleTheater(callback, delay) {
  const timer = window.setTimeout(() => {
    theaterTimers = theaterTimers.filter(id => id !== timer);
    callback();
  }, delay);

  theaterTimers.push(timer);
  return timer;
}

function clearTheaterTimers() {
  theaterTimers.forEach(timer => clearTimeout(timer));
  theaterTimers = [];
}

function clearLightTimers() {
  lightTimers.forEach(timer => clearTimeout(timer));
  lightTimers = [];
}

function showCharacterSpeech() {
  if (!characterSpeech || theaterClosing || isNavigating) return;

  characterSpeech.classList.add("is-visible");
  characterSpeech.setAttribute("aria-hidden", "false");
}

function hideCharacterSpeech() {
  if (!characterSpeech) return;

  characterSpeech.classList.remove("is-visible");
  characterSpeech.setAttribute("aria-hidden", "true");
}

function playSound(name) {
  if (!soundEnabled) return;

  const sound = sounds[name];

  if (!sound) return;

  try {
    sound.pause();
    sound.currentTime = 0;

    const playback = sound.play();

    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {});
    }
  } catch {}
}

function loadHomeHistory() {
  let entries = [];

  try {
    const stored = JSON.parse(localStorage.getItem("forca_ranking") || "[]");
    if (Array.isArray(stored)) {
      entries = stored;
    }
  } catch {
    entries = [];
  }

  entries = entries
    .filter(item => item && Number.isFinite(Number(item.score)))
    .sort((a, b) => Number(b.score) - Number(a.score) || Number(a.errors) - Number(b.errors))
    .slice(0, 10);

  historyList.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "Nenhum espetáculo registrado ainda.";
    historyList.appendChild(empty);
    return;
  }

  entries.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "history-entry";

    const position = document.createElement("span");
    position.className = "history-position";
    position.textContent = `#${index + 1}`;

    const score = document.createElement("span");
    score.className = "history-score";
    score.textContent = Number(entry.score);

    const errors = document.createElement("span");
    errors.className = "history-errors";
    errors.textContent = Number.isFinite(Number(entry.errors))
      ? Number(entry.errors)
      : "—";

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = typeof entry.date === "string" ? entry.date : "—";

    row.append(position, score, errors, date);
    historyList.appendChild(row);
  });
}

function openHomeHistory() {
  historyPreviousFocus = document.activeElement;
  loadHomeHistory();
  historyModal.hidden = false;
  historyModal.querySelector(".history-modal").focus();
}

function closeHomeHistory() {
  historyModal.hidden = true;
  historyPreviousFocus?.focus();
}
historyHomeBtn.addEventListener("click", () => {
  playSound("click");
  openHomeHistory();
});

historyCloseBtn.addEventListener("click", () => {
  playSound("click");
  closeHomeHistory();
});

historyModal.addEventListener("click", event => {
  if (event.target === historyModal) {
    closeHomeHistory();
  }
});

document.addEventListener("keydown", event => {
  if (historyModal.hidden) return;

  if (event.key === "Escape") {
    closeHomeHistory();
  }

  if (event.key === "Tab") {
    const focusable = Array.from(
      historyModal.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")
    );

    if (!focusable.length) {
      event.preventDefault();
      historyModal.querySelector(".history-modal").focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function startAmbientSound() {
  if (!soundEnabled || ambientStarted || document.hidden) return;

  try {
    const playback = sounds.ambient.play();

    if (playback && typeof playback.then === "function") {
      playback.then(() => {
        ambientStarted = true;
      }).catch(() => {
        ambientStarted = false;
      });
    }
  } catch {
    ambientStarted = false;
  }
}

function stopAmbientSound() {
  sounds.ambient.pause();
  ambientStarted = false;
}

function updateSoundToggle() {
  if (!soundToggle) return;

  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute(
    "aria-label",
    soundEnabled ? "Desativar som" : "Ativar som"
  );

  if (soundToggleLabel) {
    soundToggleLabel.textContent = soundEnabled
      ? "SOM LIGADO"
      : "SOM DESLIGADO";
  }
}

function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  writeStorage("forca_sound", String(soundEnabled));

  if (soundEnabled) {
    startAmbientSound();
  } else {
    Object.values(sounds).forEach(sound => sound.pause());
    ambientStarted = false;
    ambientWasPlaying = false;
  }

  updateSoundToggle();
}

function loadSoundPreference() {
  soundEnabled = readStorage("forca_sound") !== "false";
  updateSoundToggle();
}

function savePreferences() {
  writeStorage(
    "forca_prefs",
    JSON.stringify({
      category: currentCategory,
      difficulty: currentDifficulty
    })
  );
}

function activateSelection(buttons, selectedButton) {
  buttons.forEach(button => {
    const active = button === selectedButton;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function selectCategory(category, playFeedback = true) {
  if (isNavigating || theaterClosing) return false;

  const button = categoryButtons.find(
    item => item.dataset.cat === category
  );

  if (!button) return false;

  currentCategory = category;
  activateSelection(categoryButtons, button);

  if (playFeedback) {
    playSound("click");
  }

  savePreferences();
  return true;
}

function selectDifficulty(difficulty, playFeedback = true) {
  if (isNavigating || theaterClosing) return false;

  const button = difficultyButtons.find(
    item => item.dataset.diff === difficulty
  );

  if (!button) return false;

  currentDifficulty = difficulty;
  activateSelection(difficultyButtons, button);

  if (playFeedback) {
    playSound("click");
  }

  savePreferences();
  return true;
}

function loadPreferences() {
  const saved = readStorage("forca_prefs");

  if (saved) {
    try {
      const preferences = JSON.parse(saved);

      if (preferences && typeof preferences === "object") {
        if (
          categoryButtons.some(
            button => button.dataset.cat === preferences.category
          )
        ) {
          currentCategory = preferences.category;
        }

        if (
          difficultyButtons.some(
            button => button.dataset.diff === preferences.difficulty
          )
        ) {
          currentDifficulty = preferences.difficulty;
        }
      }
    } catch {}
  }

  const categoryButton = categoryButtons.find(
    button => button.dataset.cat === currentCategory
  );

  const difficultyButton = difficultyButtons.find(
    button => button.dataset.diff === currentDifficulty
  );

  if (categoryButton) {
    activateSelection(categoryButtons, categoryButton);
  }

  if (difficultyButton) {
    activateSelection(difficultyButtons, difficultyButton);
  }
}

function showToast(message, icon = "!") {
  if (!toastNotification || !toastMessage) return;

  toastMessage.textContent = message;

  if (toastIcon) {
    toastIcon.textContent = icon;
  }

  toastNotification.classList.add("show");

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(hideToast, 3500);
}

function hideToast() {
  if (!toastNotification) return;

  toastNotification.classList.remove("show");
  clearTimeout(toastTimeoutId);
  toastTimeoutId = null;
}

function getModalFocusables() {
  if (!modal) return [];

  return Array.from(
    modal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(element => element.getClientRects().length > 0);
}

function openRules() {
  if (!modal || theaterClosing) return;

  previousFocus = document.activeElement;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  rulesCloseBtn?.focus();
}

function closeRules() {
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "";

  if (previousFocus instanceof HTMLElement) {
    previousFocus.focus();
  }

  previousFocus = null;
}

function handleModalKeyboard(event) {
  if (!modal || modal.style.display !== "flex") return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeRules();
    return;
  }

  if (event.key !== "Tab") return;

  const focusables = getModalFocusables();

  if (!focusables.length) {
    event.preventDefault();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    document.activeElement === last
  ) {
    event.preventDefault();
    first.focus();
  }
}

function resetFootlights() {
  clearLightTimers();

  footlights.forEach(light => {
    light.classList.remove("light-on");
  });

  homeScreen?.classList.remove("stage-lit");
}

function illuminateStage() {
  clearLightTimers();

  if (!homeScreen) return;

  homeScreen.classList.add("stage-lit");

  if (reducedMotion.matches) {
    footlights.forEach(light => {
      light.classList.add("light-on");
    });

    return;
  }

  footlights.forEach((light, index) => {
    const timer = window.setTimeout(() => {
      light.classList.add("light-on");
      lightTimers = lightTimers.filter(id => id !== timer);
    }, index * THEATER_TIMING.lightInterval);

    lightTimers.push(timer);
  });
}

function completeCurtainOpening() {
  if (!homeScreen || theaterClosing) return;

  homeScreen.classList.remove("curtains-opening");
  homeScreen.classList.add("curtains-open");

  theaterOpening = false;
  theaterOpened = true;

  curtainTransition?.setAttribute("aria-hidden", "true");

  showCharacterSpeech();
  startAmbientSound();
}

function openTheaterImmediately() {
  clearTheaterTimers();
  clearLightTimers();

  if (!homeScreen) return;

  homeScreen.classList.remove(
    "curtains-opening",
    "curtains-closing"
  );

  homeScreen.classList.add(
    "curtains-open",
    "stage-lit"
  );

  footlights.forEach(light => {
    light.classList.add("light-on");
  });

  theaterOpening = false;
  theaterClosing = false;
  theaterOpened = true;

  curtainTransition?.setAttribute("aria-hidden", "true");

  showCharacterSpeech();
  startAmbientSound();
}

function beginTheaterOpening() {
  if (!homeScreen || theaterOpening || theaterOpened) return;

  clearTheaterTimers();
  resetFootlights();
  hideCharacterSpeech();

  theaterOpening = true;
  theaterClosing = false;

  homeScreen.classList.remove(
    "curtains-open",
    "curtains-closing",
    "curtains-opening"
  );

  if (reducedMotion.matches) {
    openTheaterImmediately();
    return;
  }

  scheduleTheater(() => {
    if (theaterClosing) return;

    homeScreen.classList.add("curtains-opening");
  }, THEATER_TIMING.openingDelay);

  scheduleTheater(() => {
    if (theaterClosing) return;

    illuminateStage();
  }, THEATER_TIMING.lightsStart);

  scheduleTheater(() => {
    completeCurtainOpening();
  }, THEATER_TIMING.openingDelay + THEATER_TIMING.openingDuration + 100);
}

function closeTheater(callback) {
  if (!homeScreen || theaterClosing) return;

  clearTheaterTimers();
  clearLightTimers();
  hideCharacterSpeech();

  theaterClosing = true;
  theaterOpening = false;
  theaterOpened = false;

  if (reducedMotion.matches) {
    callback?.();
    return;
  }

  homeScreen.classList.remove(
    "curtains-opening",
    "curtains-open"
  );

  homeScreen.classList.add("curtains-closing");

  curtainTransition?.setAttribute("aria-hidden", "true");

  scheduleTheater(() => {
    callback?.();
  }, THEATER_TIMING.navigationDelay);
}

function startGame() {
  if (isNavigating || theaterClosing) return;

  const categoryButton = categoryButtons.find(
    button => button.classList.contains("active")
  );

  const difficultyButton = difficultyButtons.find(
    button => button.classList.contains("active")
  );

  if (!categoryButton) {
    showToast("Escolha o tema do espetáculo.");
    return;
  }

  if (!difficultyButton) {
    showToast("Escolha um dos três atos.");
    return;
  }

  currentCategory = categoryButton.dataset.cat;
  currentDifficulty = difficultyButton.dataset.diff;

  savePreferences();

  isNavigating = true;

  if (playBtn) {
    playBtn.disabled = true;
    playBtn.setAttribute("aria-busy", "true");
  }

  hideCharacterSpeech();
  stopAmbientSound();
  playSound("play");

  const query = new URLSearchParams({
    difficulty: currentDifficulty,
    category: currentCategory
  });

  const destination = `GameScreen.html?${query.toString()}`;

  closeTheater(() => {
    window.location.href = destination;
  });
}

function handleFirstInteraction() {
  if (!theaterOpened || isNavigating || theaterClosing) return;

  document.removeEventListener("pointerdown", handleFirstInteraction);
  document.removeEventListener("keydown", handleFirstInteraction);

  if (soundEnabled) {
    startAmbientSound();
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    ambientWasPlaying = ambientStarted;
    stopAmbientSound();
    return;
  }

  if (ambientWasPlaying && soundEnabled && !isNavigating) {
    ambientWasPlaying = false;
    startAmbientSound();
  }
}

function handlePageReturn(event) {
  if (!event.persisted) return;

  isNavigating = false;
  theaterClosing = false;

  if (playBtn) {
    playBtn.disabled = false;
    playBtn.removeAttribute("aria-busy");
  }

  openTheaterImmediately();
}

function initHome() {
  loadSoundPreference();
  loadPreferences();

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectCategory(button.dataset.cat);
    });
  });

  difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectDifficulty(button.dataset.diff);
    });
  });

  soundToggle?.addEventListener("click", () => {
    setSoundEnabled(!soundEnabled);
  });

  playBtn?.addEventListener("click", startGame);

  rulesHomeBtn?.addEventListener("click", () => {
    playSound("click");
    openRules();
  });

  rulesCloseBtn?.addEventListener("click", () => {
    playSound("click");
    closeRules();
  });

  modal?.addEventListener("click", event => {
    if (event.target === modal) {
      closeRules();
    }
  });

  toastClose?.addEventListener("click", hideToast);

  document.addEventListener("keydown", handleModalKeyboard);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("pointerdown", handleFirstInteraction);
  document.addEventListener("keydown", handleFirstInteraction);

  window.addEventListener("pageshow", handlePageReturn);

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches && !isNavigating) {
        openTheaterImmediately();
      }
    });
  }

  beginTheaterOpening();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHome, {
    once: true
  });
} else {
  initHome();
}
