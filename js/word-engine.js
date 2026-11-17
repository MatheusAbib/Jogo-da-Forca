const WordEngine = (() => {
  const HISTORY_KEY = "forca_word_history_v5";
  const MAX_HISTORY = 180;

  const CATEGORIES = [
    "animais",
    "paises",
    "cinema",
    "musica",
    "tecnologia"
  ];

  const DIFFICULTIES = [
    "easy",
    "medium",
    "hard"
  ];

  function normalize(text) {
    return String(text ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function playable(text) {
    return normalize(text)
      .replace(/[^a-z\s-]/g, "")
      .replace(/\s+/g, " ")
      .replace(/-+/g, "-")
      .replace(/^[\s-]+|[\s-]+$/g, "");
  }

  function letterCount(text) {
    return playable(text).replace(/[^a-z]/g, "").length;
  }

  function wordKey(item) {
    return playable(item.word);
  }

  function historyKey(item) {
    return `${item.category}:${wordKey(item)}`;
  }

  function getWordList() {
    if (typeof wordList === "undefined" || !Array.isArray(wordList)) {
      throw new Error(
        "Banco de palavras não encontrado. Verifique se base64.js foi carregado antes de word-engine.js."
      );
    }

    return wordList;
  }

  function getCatalog() {
    const seen = new Set();

    return getWordList().filter(item => {
      if (!item || typeof item !== "object") {
        return false;
      }

      if (!CATEGORIES.includes(item.category)) {
        return false;
      }

      if (!DIFFICULTIES.includes(item.difficulty)) {
        return false;
      }

      if (typeof item.word !== "string") {
        return false;
      }

      if (typeof item.hint !== "string" || !item.hint.trim()) {
        return false;
      }

      const word = playable(item.word);
      const count = letterCount(word);

      if (count < 3 || count > 22) {
        return false;
      }

      if (!/[a-z]/.test(word)) {
        return false;
      }

      const key = historyKey(item);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });
  }

  function getHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(item => typeof item === "string")
        .slice(-MAX_HISTORY);
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history.slice(-MAX_HISTORY))
      );
    } catch {
      return;
    }
  }

  function getRandomItem(items) {
    if (!items.length) {
      return null;
    }

    const index = Math.floor(Math.random() * items.length);

    return items[index];
  }

  function getDifficultyOrder(difficulty) {
    const orders = {
      easy: ["easy", "medium", "hard"],
      medium: ["medium", "easy", "hard"],
      hard: ["hard", "medium", "easy"]
    };

    return orders[difficulty] || orders.easy;
  }

  function getDifficultyPool(catalog, difficulty) {
    const order = getDifficultyOrder(difficulty);

    for (const level of order) {
      const matches = catalog.filter(
        item => item.difficulty === level
      );

      if (matches.length) {
        return matches;
      }
    }

    return [];
  }

  function filterUsedWords(pool, used) {
    const usedSet = new Set(
      Array.isArray(used)
        ? used.map(word => playable(word))
        : []
    );

    const historySet = new Set(getHistory());

    let candidates = pool.filter(item => {
      return (
        !usedSet.has(wordKey(item)) &&
        !historySet.has(historyKey(item))
      );
    });

    if (candidates.length) {
      return candidates;
    }

    candidates = pool.filter(item => {
      return !usedSet.has(wordKey(item));
    });

    if (candidates.length) {
      return candidates;
    }

    candidates = pool.filter(item => {
      return !historySet.has(historyKey(item));
    });

    return candidates.length ? candidates : pool;
  }

  function balanceCategories(candidates) {
    if (!candidates.length) {
      return candidates;
    }

    const history = getHistory();
    const recent = history.slice(-10);

    const counts = new Map(
      CATEGORIES.map(category => [category, 0])
    );

    for (const entry of recent) {
      const category = entry.split(":")[0];

      if (counts.has(category)) {
        counts.set(category, counts.get(category) + 1);
      }
    }

    const availableCategories = [
      ...new Set(candidates.map(item => item.category))
    ];

    const minimum = Math.min(
      ...availableCategories.map(
        category => counts.get(category) ?? 0
      )
    );

    const balanced = candidates.filter(item => {
      return (counts.get(item.category) ?? 0) === minimum;
    });

    return balanced.length ? balanced : candidates;
  }

  function registerWord(item) {
    const history = getHistory();
    const key = historyKey(item);

    const updated = history.filter(entry => entry !== key);

    updated.push(key);

    saveHistory(updated);
  }

  function select(category = "random", difficulty = "easy", used = []) {
    const targetCategory = CATEGORIES.includes(category)
      ? category
      : "random";

    const targetDifficulty = DIFFICULTIES.includes(difficulty)
      ? difficulty
      : "easy";

    const catalog = getCatalog();

    if (!catalog.length) {
      throw new Error(
        "Nenhuma palavra válida foi encontrada no banco de palavras."
      );
    }

    const categoryPool = catalog.filter(item => {
      return (
        targetCategory === "random" ||
        item.category === targetCategory
      );
    });

    if (!categoryPool.length) {
      throw new Error(
        `Nenhuma palavra disponível para a categoria "${targetCategory}".`
      );
    }

    const difficultyPool = getDifficultyPool(
      categoryPool,
      targetDifficulty
    );

    if (!difficultyPool.length) {
      throw new Error(
        "Nenhuma palavra disponível para a dificuldade selecionada."
      );
    }

    let candidates = filterUsedWords(
      difficultyPool,
      used
    );

    if (targetCategory === "random") {
      candidates = balanceCategories(candidates);
    }

    const selected = getRandomItem(candidates);

    if (!selected) {
      throw new Error(
        "Não foi possível selecionar uma palavra."
      );
    }

    registerWord(selected);

    return {
      word: playable(selected.word),
      hint: selected.hint.trim(),
      category: selected.category,
      difficulty: selected.difficulty
    };
  }

  function getStats() {
    const catalog = getCatalog();

    const categories = Object.fromEntries(
      CATEGORIES.map(category => [
        category,
        catalog.filter(item => item.category === category).length
      ])
    );

    const difficulties = Object.fromEntries(
      DIFFICULTIES.map(difficulty => [
        difficulty,
        catalog.filter(item => item.difficulty === difficulty).length
      ])
    );

    return {
      total: catalog.length,
      categories,
      difficulties,
      history: getHistory().length
    };
  }

  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      return;
    }
  }

  return {
    select,
    getStats,
    clearHistory
  };
})();