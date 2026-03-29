// OSE Character Creator — Main App Logic

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtMod(val) {
  if (val > 0) return "+" + val;
  if (val < 0) return String(val);
  return "—";
}

function showError(msg) {
  const el = document.getElementById("error-msg");
  el.textContent = msg;
  el.classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
}

function hideError() {
  document.getElementById("error-msg").classList.add("hidden");
}

function hideResult() {
  document.getElementById("result").classList.add("hidden");
}

function displayCharacter(char, options) {
  const r = document.getElementById("result");
  r.classList.remove("hidden");
  hideError();

  // Header info
  document.getElementById("r-class-level").textContent = char.character_class + " " + char.level;
  document.getElementById("r-title").textContent = char.title;
  document.getElementById("r-alignment").textContent = char.alignment || "—";
  document.getElementById("r-hp").textContent = char.hp;
  document.getElementById("r-ac").textContent = char.ac;
  // Show AB for AAC (always show), "—" for DAC (uses THAC0 matrix instead)
  document.getElementById("r-ab").textContent = (char.ac_mode === "dac") ? "—" : (char.attack_bonus === 0 ? "+0" : fmtMod(char.attack_bonus));
  document.getElementById("r-xp-bonus").textContent = char.pr_xp_bonus;
  document.getElementById("r-movement").textContent = char.exploration_movement;

  // Abilities
  const stats = [
    ["str", char.str_melee_mod],
    ["int", char.int_languages],
    ["wis", char.wis_magic_saves],
    ["dex", char.dex_ac_mod],
    ["con", char.con_hp_mod],
    ["cha", char.cha_npc_reactions],
  ];
  stats.forEach(([stat, mod]) => {
    const el = document.getElementById("r-" + stat);
    el.querySelector(".ab-score").textContent = (char[stat] ?? "—");
    el.querySelector(".ab-mod").textContent = fmtMod(mod);
  });

  // Saves
  document.getElementById("r-save-d").textContent = char.save_death;
  document.getElementById("r-save-w").textContent = char.save_wands;
  document.getElementById("r-save-p").textContent = char.save_paralysis;
  document.getElementById("r-save-b").textContent = char.save_breath;
  document.getElementById("r-save-s").textContent = char.save_spells;

  // Equipment
  const eqList = document.getElementById("r-equipped");
  const pkList = document.getElementById("r-packed");
  eqList.innerHTML = "";
  pkList.innerHTML = "";
  (char.equipped || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    eqList.appendChild(li);
  });
  (char.packed || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    pkList.appendChild(li);
  });

  // Notes
  document.getElementById("r-abilities").textContent = char.abilities || "—";
  document.getElementById("r-notes").textContent = char.notes || "";

  // Download buttons handled by caller
}

// ---------------------------------------------------------------------------
// Form handling
// ---------------------------------------------------------------------------

const form = document.getElementById("gen-form");
const generateBtn = document.getElementById("generate-btn");

// Update dice method options based on class selection
const classSelect = document.getElementById("class_selection");
const diceSelect = document.getElementById("dice_method");
const levelSelect = document.getElementById("level");

function updateLevelDropdown() {
  const val = classSelect.value;
  const maxLevel = (val === "random" || !CLASSES[val])
    ? 14
    : CLASSES[val].max_level;
  const current = parseInt(levelSelect.value) || 1;
  levelSelect.innerHTML = "";
  for (let i = 1; i <= maxLevel; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    if (i === Math.min(current, maxLevel)) opt.selected = true;
    levelSelect.appendChild(opt);
  }
}

classSelect.addEventListener("change", function() {
  const isRandom = this.value === "random";
  diceSelect.innerHTML = "";
  if (isRandom) {
    diceSelect.innerHTML = `
      <option value="3d6_order">3d6 in order</option>
      <option value="4d6_order_drop_lowest">4d6 in order, drop lowest</option>
    `;
  } else {
    diceSelect.innerHTML = `
      <option value="3d6_optimized">3d6 optimised</option>
      <option value="4d6_optimized_drop_lowest">4d6 optimised, drop lowest</option>
    `;
  }
  updateLevelDropdown();
});

// Init level dropdown on page load
updateLevelDropdown();

// Alignment blank toggle
const alignBlank = document.getElementById("alignment_blank");
const alignOpts = document.getElementById("alignment-options");
alignBlank.addEventListener("change", function() {
  const disabled = this.checked;
  alignOpts.querySelectorAll("input").forEach(cb => cb.disabled = disabled);
  alignOpts.classList.toggle("disabled", disabled);
});

// Show/hide Read Magic toggle based on class
function updateReadMagicToggle() {
  const isRandom = classSelect.value === "random";
  const toggle = document.getElementById("read_magic_toggle");
  // Show always for now (simplified)
  toggle.style.display = "block";
}
classSelect.addEventListener("change", updateReadMagicToggle);
updateReadMagicToggle();

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

async function doGenerate(options) {
  const numChars = parseInt(options.num_characters || 1);
  const characters = [];

  for (let i = 0; i < numChars; i++) {
    const char = generateCharacter(options);
    characters.push(char);
  }

  return characters;
}

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  hideError();
  hideResult();

  // Gather options
  const fd = new FormData(form);
  const classVal = fd.get("class_selection");
  const classSelection = classVal === "random" ? "random" : "choose";
  const chosenClass = classVal === "random" ? null : classVal;

  const alignBlank = fd.get("alignment_blank") === "on";
  const allowedAlignments = [];
  if (!alignBlank) {
    if (fd.get("align_lawful") === "on") allowedAlignments.push("Lawful");
    if (fd.get("align_neutral") === "on") allowedAlignments.push("Neutral");
    if (fd.get("align_chaotic") === "on") allowedAlignments.push("Chaotic");
  }

  const options = {
    dice_method: fd.get("dice_method"),
    class_selection: classSelection,
    chosen_class: chosenClass,
    alignment_blank: alignBlank,
    allowed_alignments: allowedAlignments,
    ac_mode: fd.get("ac_mode"),
    encumbrance_mode: fd.get("encumbrance_mode"),
    equipment_mode: fd.get("equipment_mode"),
    level: parseInt(fd.get("level") || 1),
    num_characters: parseInt(fd.get("num_characters") || 1),
    max_hp_at_level1: fd.get("max_hp_at_level1") === "on",
    reroll_low_hp: fd.get("reroll_low_hp") === "on",
    reroll_subpar: fd.get("reroll_subpar") === "on",
    give_read_magic: fd.get("give_read_magic") === "on",
  };

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  try {
    const characters = await doGenerate(options);

    if (characters.length === 1) {
      // Single PDF
      const blob = await generatePdfBlob(characters[0]);
      const url = URL.createObjectURL(blob);
      const dlBtn = document.getElementById("dl-btn");
      const zipBtn = document.getElementById("zip-btn");
      dlBtn.href = url;
      dlBtn.download = `character_${characters[0].character_class.toLowerCase()}_${Date.now()}.pdf`;
      dlBtn.classList.remove("hidden");
      zipBtn.classList.add("hidden");

      // Display
      displayCharacter(characters[0], options);

      // Save to localStorage
      saveCharacter({ options, character: characters[0] });
    } else {
      // Multiple — create ZIP
      const files = {};
      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        const blob = await generatePdfBlob(c);
        const bytes = new Uint8Array(await blob.arrayBuffer());
        files[`character_${i+1}_${c.character_class.toLowerCase()}.pdf`] = bytes;
      }
      const zipBytes = fflate.zipSync(files);
      const blob = new Blob([zipBytes], {type:"application/zip"});
      const url = URL.createObjectURL(blob);
      const dlBtn = document.getElementById("dl-btn");
      const zipBtn = document.getElementById("zip-btn");
      dlBtn.classList.add("hidden");
      zipBtn.href = url;
      zipBtn.download = `party_${Date.now()}.zip`;
      zipBtn.classList.remove("hidden");

      // Display first character as preview
      displayCharacter(characters[0], options);

      // Save all to localStorage
      for (const c of characters) {
        saveCharacter({ options, character: c });
      }
    }

    // Refresh previous list
    renderPrevious();

  } catch(err) {
    console.error(err);
    showError("Error: " + err.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "🎲 Generate Character";
  }
});

// ---------------------------------------------------------------------------
// Previous characters
// ---------------------------------------------------------------------------

function renderPrevious() {
  const saved = getSavedCharacters();
  const section = document.getElementById("previous-section");
  const list = document.getElementById("prev-list");

  if (!saved.length) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  list.innerHTML = "";

  saved.slice(0, 10).forEach(entry => {
    const c = entry.character;
    const item = document.createElement("div");
    item.className = "prev-item";
    item.innerHTML = `
      <div>
        <strong>${c.character_class} ${c.level}</strong> — ${c.title}
        <div class="prev-meta">${new Date(entry.timestamp).toLocaleString()}</div>
      </div>
      <div class="prev-actions">
        <button data-id="${entry.id}" class="dl-single">Download</button>
        <button data-id="${entry.id}" class="del-single">✕</button>
      </div>
    `;
    list.appendChild(item);
  });

  // Bind events
  list.querySelectorAll(".dl-single").forEach(btn => {
    btn.addEventListener("click", async function() {
      const id = this.dataset.id;
      const entry = getCharacterById(id);
      if (!entry) return;
      try {
        const blob = await generatePdfBlob(entry.character);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `character_${entry.character.character_class.toLowerCase()}.pdf`;
        a.click();
      } catch(e) {
        showError("Error: " + e.message);
      }
    });
  });

  list.querySelectorAll(".del-single").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.dataset.id;
      deleteCharacterById(id);
      renderPrevious();
    });
  });
}

document.getElementById("clear-btn").addEventListener("click", function() {
  if (confirm("Clear all saved characters?")) {
    clearSavedCharacters();
    renderPrevious();
  }
});

// Init
renderPrevious();
