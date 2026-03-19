// OSE Character Creator — localStorage persistence

const STORAGE_KEY = "ose_characters";
const MAX_SAVED = 20;

function getSavedCharacters() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveCharacter(charData) {
  const saved = getSavedCharacters();
  // Keep full options + character + timestamp
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2,5),
    timestamp: new Date().toISOString(),
    options: charData.options,
    character: charData.character,
  };
  saved.unshift(entry);
  // Trim to max
  while (saved.length > MAX_SAVED) saved.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return entry.id;
}

function getCharacterById(id) {
  const saved = getSavedCharacters();
  return saved.find(e => e.id === id) || null;
}

function clearSavedCharacters() {
  localStorage.setItem(STORAGE_KEY, "[]");
}

function deleteCharacterById(id) {
  const saved = getSavedCharacters().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}
