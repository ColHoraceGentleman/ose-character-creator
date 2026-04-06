// OSE Character Creator — Main App Logic

// Always start at top of page on load
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Track the currently displayed entry so it's excluded from "previously generated"
let activeEntryId = null;

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
  document.getElementById("party-result").classList.add("hidden");
  document.getElementById("preview-placeholder").style.display = "";
  activeEntryId = null;
}

function displayParty(characters, pdfBlobs) {
  // Hide single result, show party panel
  document.getElementById("result").classList.add("hidden");
  document.getElementById("preview-placeholder").style.display = "none";

  const panel = document.getElementById("party-result");
  panel.classList.remove("hidden");

  const list = document.getElementById("party-list");
  list.innerHTML = '<div class="party-list-inner" id="party-list-inner"></div>';
  const inner = document.getElementById("party-list-inner");

  characters.forEach((c, i) => {
    const isDemiHuman = !c.class_field;
    const raceClass = isDemiHuman
      ? (c.race_field || c.character_class)
      : `${c.race_field} ${c.class_field || c.character_class}`;

    const item = document.createElement("div");
    item.className = "party-item";
    item.innerHTML = `
      <div class="party-item-info">
        <span class="party-item-name">${raceClass}</span>
        <span class="party-item-stats">Lvl ${c.level} &middot; HP ${c.hp} &middot; AC ${c.ac}</span>
      </div>
      <a class="btn-download party-dl" data-index="${i}" href="#" download>⬇ PDF</a>
    `;
    inner.appendChild(item);
  });

  // Bind individual PDF downloads
  inner.querySelectorAll(".party-dl").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const i = parseInt(this.dataset.index);
      const url = URL.createObjectURL(pdfBlobs[i]);
      const a = document.createElement("a");
      a.href = url;
      a.download = `character_${i+1}_${characters[i].character_class.toLowerCase()}.pdf`;
      a.click();
    });
  });
}

function displayCharacter(char, options) {
  const r = document.getElementById("result");
  r.classList.remove("hidden");
  document.getElementById("preview-placeholder").style.display = "none";
  hideError();

  // Header info
  document.getElementById("r-name").textContent = char.name || "";

  // Race/Class display: demi-humans (class_field is blank) get a single "Race/Class" box
  const isDemiHuman = !char.class_field;
  const raceBox = document.getElementById("r-race-box");
  const classBox = document.getElementById("r-class-box");
  if (isDemiHuman) {
    raceBox.querySelector(".stat-label").textContent = "Race/Class";
    document.getElementById("r-race").textContent = char.race_field || char.character_class;
    classBox.style.display = "none";
  } else {
    raceBox.querySelector(".stat-label").textContent = "Race";
    document.getElementById("r-race").textContent = char.race_field || "—";
    document.getElementById("r-class").textContent = char.class_field || char.character_class;
    classBox.style.display = "";
  }
  document.getElementById("r-level").textContent = char.level;
  // Keep hidden fields populated for PDF use
  document.getElementById("r-class-level").textContent = char.character_class + " " + char.level;
  document.getElementById("r-title").textContent = char.title || "";
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
const rulesetSelect = document.getElementById("ruleset");

// Class definitions for dropdown rebuilding
const CF_CLASSES = [
  { value: "Cleric",      label: "Cleric" },
  { value: "Dwarf",       label: "Dwarf" },
  { value: "Elf",         label: "Elf" },
  { value: "Fighter",     label: "Fighter" },
  { value: "Halfling",    label: "Halfling" },
  { value: "Magic-User",  label: "Magic-User" },
  { value: "Thief",       label: "Thief" },
];
const AF_HUMAN_CLASSES = [
  { value: "AF_Acrobat",    label: "Acrobat" },
  { value: "AF_Assassin",   label: "Assassin" },
  { value: "AF_Barbarian",  label: "Barbarian" },
  { value: "AF_Bard",       label: "Bard" },
  { value: "AF_Druid",      label: "Druid" },
  { value: "AF_Illusionist",label: "Illusionist" },
  { value: "AF_Knight",     label: "Knight" },
  { value: "AF_Paladin",    label: "Paladin" },
  { value: "AF_Ranger",     label: "Ranger" },
];
const AF_DEMI_CLASSES = [
  { value: "AF_Drow",    label: "Drow" },
  { value: "AF_Duergar", label: "Duergar" },
  { value: "AF_Gnome",   label: "Gnome" },
  { value: "AF_HalfElf", label: "Half-Elf" },
  { value: "AF_HalfOrc", label: "Half-Orc" },
];

// Rebuild the class dropdown from scratch based on ruleset
function updateClassDropdownForRuleset() {
  const ruleset = rulesetSelect.value;
  const prevVal = classSelect.value;

  // Clear and rebuild
  classSelect.innerHTML = "";

  function addOption(value, label) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    return opt;
  }
  function addGroup(label, classes) {
    const grp = document.createElement("optgroup");
    if (label) grp.label = label;
    classes.forEach(c => grp.appendChild(addOption(c.value, c.label)));
    classSelect.appendChild(grp);
  }

  classSelect.appendChild(addOption("random", "Random class"));

  if (ruleset === "advanced") {
    // Merge all AF classes into one alphabetically sorted list
    const allAF = [...CF_CLASSES, ...AF_HUMAN_CLASSES, ...AF_DEMI_CLASSES]
      .sort((a, b) => a.label.localeCompare(b.label));
    addGroup(null, allAF);
  } else if (ruleset === "advanced_rc") {
    // Advanced RC: human classes only, flat list (race filter applied by updateClassOptionsForRC)
    const allHuman = [...CF_CLASSES.filter(c => !["Dwarf","Elf","Halfling"].includes(c.value)), ...AF_HUMAN_CLASSES]
      .sort((a, b) => a.label.localeCompare(b.label));
    allHuman.forEach(c => classSelect.appendChild(addOption(c.value, c.label)));
  } else {
    // Classic mode: flat list, no group header
    CF_CLASSES.forEach(c => classSelect.appendChild(addOption(c.value, c.label)));
  }

  // Restore previous selection if still valid
  const stillValid = Array.from(classSelect.options).some(o => o.value === prevVal);
  classSelect.value = stillValid ? prevVal : "random";

  // Trigger downstream updates
  classSelect.dispatchEvent(new Event("change"));
}

rulesetSelect.addEventListener("change", updateClassDropdownForRuleset);
// Init on load
updateClassDropdownForRuleset();

function updateLevelDropdown() {
  const val = classSelect.value;
  const ruleset = rulesetSelect.value;
  const raceSelect = document.getElementById("race_selection");
  const selectedRace = (ruleset === "advanced_rc" && raceSelect) ? raceSelect.value : null;
  let maxLevel;
  if (val !== "random" && CLASSES[val]) {
    maxLevel = CLASSES[val].max_level;
    // In advanced_rc mode, cap by the race's class max level if a specific race is chosen
    if (selectedRace && selectedRace !== "random" && typeof RACES !== "undefined" && RACES[selectedRace]) {
      const raceCap = RACES[selectedRace].available_classes[val];
      if (raceCap !== undefined) maxLevel = Math.min(maxLevel, raceCap);
    }
  } else {
    // Random: cap to the max level of any class available in the current ruleset/race
    if (selectedRace && selectedRace !== "random" && typeof RACES !== "undefined" && RACES[selectedRace]) {
      // Use the max level of any class available to this race
      const raceCaps = Object.values(RACES[selectedRace].available_classes);
      maxLevel = raceCaps.length ? Math.max(...raceCaps) : 14;
    } else {
      const availableClasses = ruleset === "advanced" || ruleset === "advanced_rc"
        ? [...CF_CLASSES, ...AF_HUMAN_CLASSES, ...AF_DEMI_CLASSES]
        : CF_CLASSES;
      maxLevel = Math.max(...availableClasses.map(c => CLASSES[c.value] ? CLASSES[c.value].max_level : 1));
    }
  }
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

// ---------------------------------------------------------------------------
// Race dropdown and class filtering for Advanced RC
// ---------------------------------------------------------------------------_

// Show/hide race dropdown based on ruleset
function updateRaceVisibility() {
  const ruleset = document.getElementById("ruleset").value;
  const raceGroup = document.getElementById("race_option_group");
  if (raceGroup) raceGroup.style.display = (ruleset === "advanced_rc") ? "" : "none";
  updateClassOptionsForRC();
}

// Filter class dropdown for advanced_rc mode (works on flat rebuilt dropdown)
function updateClassOptionsForRC() {
  const ruleset = document.getElementById("ruleset").value;
  const raceSelect = document.getElementById("race_selection");
  const classSelect = document.getElementById("class_selection");
  if (!classSelect || ruleset !== "advanced_rc") return;

  // Filter class options to only those available to the selected race
  const race = raceSelect ? raceSelect.value : "random";
  const options = classSelect.querySelectorAll("option");
  if (race !== "random" && typeof RACES !== "undefined" && RACES[race]) {
    const available = RACES[race].available_classes;
    options.forEach(opt => {
      if (opt.value === "random") { opt.style.display = ""; return; }
      opt.style.display = (opt.value in available) ? "" : "none";
    });
    // Reset to random if current selection is no longer available
    if (classSelect.value !== "random" && !(classSelect.value in available)) {
      classSelect.value = "random";
    }
  } else {
    // Random race: show all options
    options.forEach(opt => { opt.style.display = ""; });
  }
}

document.getElementById("race_selection")?.addEventListener("change", function() {
  updateClassOptionsForRC();
  updateLevelDropdown();
});
document.getElementById("ruleset").addEventListener("change", updateRaceVisibility);
// Call once on load
updateRaceVisibility();

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
    ruleset: fd.get("ruleset") || "classic",
    dice_method: fd.get("dice_method"),
    class_selection: classSelection,
    chosen_class: chosenClass,
    race_selection: fd.get("race_selection") || "random",
    chosen_race: (fd.get("race_selection") && fd.get("race_selection") !== "random") ? fd.get("race_selection") : null,
    alignment_blank: alignBlank,
    allowed_alignments: allowedAlignments,
    ac_mode: fd.get("ac_mode"),
    encumbrance_mode: fd.get("encumbrance_mode"),
    equipment_mode: fd.get("equipment_mode"),
    level: parseInt(fd.get("level") || 1),
    num_characters: parseInt(fd.get("num_characters") || 1),
    max_hp_at_level1: fd.get("max_hp_at_level1") === "on",
    reroll_low_hp: fd.get("reroll_low_hp") === "on",
    reroll_ones_ability: fd.get("reroll_ones_ability") === "on",
    reroll_subpar: fd.get("reroll_subpar") === "on",
    give_read_magic: fd.get("give_read_magic") === "on",
    secondary_skill: fd.get("secondary_skill") === "on",
    weapon_proficiency: fd.get("weapon_proficiency") === "on",
    magic_items: fd.get("magic_items") === "on",
    magic_item_pct: parseInt(fd.get("magic_item_pct") || "10"),
    name_style: fd.get("name_style") || "fantasy",
    auto_adjust_scores: fd.get("auto_adjust_scores") === "on",
    random_spells: fd.get("random_spells") === "on",
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
      activeEntryId = saveCharacter({ options, character: characters[0] });
    } else {
      // Multiple — generate PDFs, create ZIP, show party list
      const pdfBlobs = [];
      const files = {};
      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        const blob = await generatePdfBlob(c);
        pdfBlobs.push(blob);
        const bytes = new Uint8Array(await blob.arrayBuffer());
        files[`character_${i+1}_${c.character_class.toLowerCase()}.pdf`] = bytes;
      }
      const zipBytes = fflate.zipSync(files);
      const zipBlob = new Blob([zipBytes], {type:"application/zip"});
      const zipUrl = URL.createObjectURL(zipBlob);

      // Wire up ZIP button in party header
      const zipBtn2 = document.getElementById("zip-btn2");
      zipBtn2.href = zipUrl;
      zipBtn2.download = `party_${Date.now()}.zip`;
      zipBtn2.classList.remove("hidden");

      // Display party list
      displayParty(characters, pdfBlobs);

      // Save as a single party entry
      activeEntryId = saveParty(characters, options);
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

function countFittingPrevious() {
  // Measure how many previous entries fit in the remaining left-pane height
  const builderPane = document.querySelector(".builder-pane");
  const previewPane = document.querySelector(".preview-pane");
  if (!builderPane || !previewPane) return 5;

  const builderHeight = builderPane.offsetHeight;
  const previewHeight = previewPane.offsetHeight;
  const remaining = builderHeight - previewHeight;

  if (remaining <= 0) return 0;

  // Each prev-item is roughly 56px (two lines + padding + border)
  const itemHeight = 56;
  // Header of the previous section is ~52px
  const headerHeight = 52;
  const count = Math.floor((remaining - headerHeight) / itemHeight);
  return Math.max(1, count);
}

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

  const filtered = saved.filter(e => e.id !== activeEntryId);
  const limit = countFittingPrevious();
  filtered.slice(0, limit).forEach(entry => {
    const item = document.createElement("div");
    item.className = "prev-item";

    if (entry.type === 'party') {
      // Summarise party: count identical race/class combos
      const counts = {};
      entry.characters.forEach(c => {
        const isDemi = !c.class_field;
        const label = isDemi
          ? (c.race_field || c.character_class)
          : `${c.race_field} ${c.class_field || c.character_class}`;
        counts[label] = (counts[label] || 0) + 1;
      });
      const summary = Object.entries(counts)
        .map(([label, n]) => n > 1 ? `${n} ${label}s` : label)
        .join(", ");

      item.innerHTML = `
        <div>
          <strong>${entry.characters.length} Characters</strong>
          <div class="prev-meta">${summary}</div>
          <div class="prev-meta">${new Date(entry.timestamp).toLocaleString()}</div>
        </div>
        <div class="prev-actions">
          <button data-id="${entry.id}" class="dl-party">⬇ ZIP</button>
          <button data-id="${entry.id}" class="del-single">✕</button>
        </div>
      `;
    } else {
      const c = entry.character;
      const isDemi = !c.class_field;
      const label = isDemi
        ? (c.race_field || c.character_class)
        : `${c.race_field} ${c.class_field || c.character_class}`;
      item.innerHTML = `
        <div>
          <strong>${label} ${c.level}</strong> — ${c.title}
          <div class="prev-meta">${new Date(entry.timestamp).toLocaleString()}</div>
        </div>
        <div class="prev-actions">
          <button data-id="${entry.id}" class="dl-single">⬇ PDF</button>
          <button data-id="${entry.id}" class="del-single">✕</button>
        </div>
      `;
    }
    list.appendChild(item);
  });

  // Single PDF download
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

  // Party ZIP download
  list.querySelectorAll(".dl-party").forEach(btn => {
    btn.addEventListener("click", async function() {
      const id = this.dataset.id;
      const entry = getCharacterById(id);
      if (!entry || entry.type !== 'party') return;
      try {
        const files = {};
        for (let i = 0; i < entry.characters.length; i++) {
          const c = entry.characters[i];
          const blob = await generatePdfBlob(c);
          const bytes = new Uint8Array(await blob.arrayBuffer());
          files[`character_${i+1}_${c.character_class.toLowerCase()}.pdf`] = bytes;
        }
        const zipBytes = fflate.zipSync(files);
        const zipBlob = new Blob([zipBytes], {type: "application/zip"});
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `party_${Date.now()}.zip`;
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

// Re-render on resize so count stays accurate
window.addEventListener("resize", renderPrevious);

// Init
renderPrevious();
