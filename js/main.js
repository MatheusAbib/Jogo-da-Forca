const sounds = {
  correct: new Audio('./sounds/correct.mp3'),
  wrong: new Audio('./sounds/error.mp3'),
  win: new Audio('./sounds/win.mp3'),
  play: new Audio('./sounds/start.mp3'),
  click: new Audio('./sounds/click.wav'),
  hover: new Audio('./sounds/hover.mp3'),
  ambient: new Audio('./sounds/ambient.wav')
};

Object.values(sounds).forEach(s => {
  if (s) {
    s.load();
    s.volume = 0.3;
  }
});

sounds.ambient.volume = 0.15;
sounds.ambient.loop = true;

let soundEnabled = true;
let animationFrameId;
let currentCategory = "random";
let audioContext = null;
let isUserInteracted = false;
let ambientTimeout = null;
let ambientStarted = false;
let ambientAttempts = 0;
const MAX_AMBIENT_ATTEMPTS = 5;
let hangmanTimeoutId = null;

const fireCanvas = document.getElementById("fireCanvas");
const fireBackground = document.getElementById("fireBackground");
const modal = document.getElementById("rulesModal");
const playBtn = document.getElementById("playBtn");
const rulesHomeBtn = document.getElementById("rulesHomeBtn");
const rulesCloseBtn = document.getElementById("rulesCloseBtn");
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");
const toastClose = document.getElementById("toastClose");

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
  return audioContext;
}

function forcePlayAmbient() {
  if (!soundEnabled) return;
  if (ambientStarted) return;
  if (ambientAttempts >= MAX_AMBIENT_ATTEMPTS) return;

  ambientAttempts++;
  initAudio();
  const s = sounds.ambient;
  if (!s) return;

  s.currentTime = 0;
  s.play().then(() => {
    ambientStarted = true;
  }).catch(() => {
    if (ambientAttempts < MAX_AMBIENT_ATTEMPTS) {
      setTimeout(forcePlayAmbient, 1000);
    }
  });
}

function handleUserInteraction() {
  if (!isUserInteracted) {
    isUserInteracted = true;
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    if (soundEnabled && !ambientStarted) {
      clearTimeout(ambientTimeout);
      ambientTimeout = setTimeout(forcePlayAmbient, 100);
    }
  }
}

function playSound(name) {
  if (!soundEnabled) return;
  initAudio();
  const s = sounds[name];
  if (s) {
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}

function playHoverSound() {
  if (!soundEnabled) return;
  initAudio();
  const s = sounds.hover;
  if (s) {
    s.currentTime = 0;
    s.play().catch(() => {});
  }
}

function stopAmbientSound() {
  ambientStarted = false;
  ambientAttempts = 0;
  const s = sounds.ambient;
  if (s) {
    s.pause();
    s.currentTime = 0;
  }
  clearTimeout(ambientTimeout);
}

function showToast(text, icon = '⚠') {
  if (!toastNotification) return;
  toastMessage.textContent = text;
  toastIcon.textContent = icon;
  toastNotification.classList.add('show');
  clearTimeout(toastNotification._timeout);
  toastNotification._timeout = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3000);
}

function initFireEffect() {
  if (animationFrameId) return;
  if (!fireBackground || !fireCanvas) return;

  fireBackground.classList.add('active');

  const canvas = fireCanvas;
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

function openRules() {
  if (modal) modal.style.display = 'flex';
}

function closeRules() {
  if (modal) modal.style.display = 'none';
}

function startHangmanAnimation() {
  const parts = ['homeHead', 'homeBody', 'homeArmL', 'homeArmR', 'homeLegL', 'homeLegR'];
  let index = 0;

  parts.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  function showNext() {
    if (index < parts.length) {
      const el = document.getElementById(parts[index]);
      if (el) el.classList.remove('hidden');
      index++;
      hangmanTimeoutId = setTimeout(showNext, 400);
    } else {
      hangmanTimeoutId = setTimeout(() => {
        parts.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('hidden');
        });
        index = 0;
        hangmanTimeoutId = setTimeout(showNext, 500);
      }, 2000);
    }
  }

  showNext();
}

function stopHangmanAnimation() {
  clearTimeout(hangmanTimeoutId);
  hangmanTimeoutId = null;
}

function savePreferences() {
  try {
    localStorage.setItem('forca_prefs', JSON.stringify({
      category: currentCategory,
      difficulty: document.querySelector('.home-diff-options button.active')?.dataset.diff || 'easy'
    }));
  } catch {}
}

function loadPreferences() {
  try {
    const data = localStorage.getItem('forca_prefs');
    if (!data) return;
    const prefs = JSON.parse(data);
    const catBtn = document.querySelector(`.home-category-options button[data-cat="${prefs.category}"]`);
    const diffBtn = document.querySelector(`.home-diff-options button[data-diff="${prefs.difficulty}"]`);
    if (catBtn) {
      document.querySelectorAll('.home-category-options button').forEach(b => b.classList.remove('active'));
      catBtn.classList.add('active');
      currentCategory = prefs.category;
    }
    if (diffBtn) {
      document.querySelectorAll('.home-diff-options button').forEach(b => b.classList.remove('active'));
      diffBtn.classList.add('active');
    }
  } catch {}
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('keydown', handleUserInteraction);
  document.addEventListener('touchstart', handleUserInteraction);

  document.querySelectorAll('.home-category-options button').forEach(btn => {
    btn.addEventListener('mouseenter', playHoverSound);
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      handleUserInteraction();
      document.querySelectorAll('.home-category-options button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.cat;
      playSound("click");
      savePreferences();
    });
  });

  document.querySelectorAll('.home-diff-options button').forEach(btn => {
    btn.addEventListener('mouseenter', playHoverSound);
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      handleUserInteraction();
      document.querySelectorAll('.home-diff-options button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      playSound("click");
      savePreferences();
    });
  });

  if (playBtn) {
    playBtn.addEventListener('mouseenter', playHoverSound);
    playBtn.addEventListener('click', function() {
      handleUserInteraction();

      const diffBtn = document.querySelector('.home-diff-options button.active');
      const catBtn = document.querySelector('.home-category-options button.active');

      if (!catBtn) {
        showToast('Selecione uma categoria!', '⚠');
        return;
      }
      if (!diffBtn) {
        showToast('Selecione uma dificuldade!', '⚠');
        return;
      }

      stopAmbientSound();

      const s = sounds.play;
      if (s && soundEnabled) {
        s.currentTime = 0;
        s.volume = 0.4;
        s.play().catch(() => {});
      }

      const queryParams = new URLSearchParams({
        difficulty: diffBtn.dataset.diff,
        category: catBtn.dataset.cat
      });

      setTimeout(() => {
        window.location.href = 'GameScreen.html?' + queryParams.toString();
      }, 400);
    });
  }

  if (rulesHomeBtn) {
    rulesHomeBtn.addEventListener('mouseenter', playHoverSound);
    rulesHomeBtn.addEventListener('click', function() {
      handleUserInteraction();
      playSound("click");
      openRules();
    });
  }

  if (rulesCloseBtn) {
    rulesCloseBtn.addEventListener('mouseenter', playHoverSound);
    rulesCloseBtn.addEventListener('click', function() {
      handleUserInteraction();
      playSound("click");
      closeRules();
    });
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        handleUserInteraction();
        playSound("click");
        closeRules();
      }
    });
  }

  if (toastClose) {
    toastClose.addEventListener('click', function() {
      toastNotification.classList.remove('show');
    });
  }

  window.addEventListener('resize', function() {
    const c = fireCanvas;
    if (c) {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
  });

  loadPreferences();
  initFireEffect();
  startHangmanAnimation();

  setTimeout(function() {
    forcePlayAmbient();
  }, 800);
});