/* OSE Character Creator — App JavaScript */

const form = document.getElementById("gen-form");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error-msg");
const generateBtn = document.getElementById("generate-btn");

// Class selection: dropdown where "Random class" = random, any other = choose that class
const CLASS_SELECTION = document.getElementById("class_selection");
const DICE_METHOD = document.getElementById("dice_method");

const DICE_OPTIONS_RANDOM = [
  { value: "3d6_order",             label: "3d6 in order" },
  { value: "4d6_order_drop_lowest", label: "4d6 in order, drop lowest" },
];
const DICE_OPTIONS_CHOOSE = [
  { value: "3d6_optimized",             label: "3d6 optimized" },
  { value: "4d6_optimized_drop_lowest", label: "4d6 optimized, drop lowest" },
];

function updateDiceOptions() {
  const isRandom = CLASS_SELECTION.value === "random";
  const opts = isRandom ? DICE_OPTIONS_RANDOM : DICE_OPTIONS_CHOOSE;
  DICE_METHOD.innerHTML = "";
  opts.forEach(o => {
    const el = document.createElement("option");
    el.value = o.value;
    el.textContent = o.label;
    DICE_METHOD.appendChild(el);
  });
}

CLASS_SELECTION.addEventListener("change", updateDiceOptions);
updateDiceOptions(); // run on load

// Grey out alignment options when "Leave blank" is checked
const ALIGNMENT_BLANK = document.getElementById("alignment_blank");
const ALIGNMENT_OPTIONS = document.getElementById("alignment-options");

ALIGNMENT_BLANK.addEventListener("change", function () {
  const disabled = this.checked;
  ALIGNMENT_OPTIONS.querySelectorAll("input[type=checkbox]").forEach(cb => cb.disabled = disabled);
  ALIGNMENT_OPTIONS.classList.toggle("disabled", disabled);
});

function fmtMod(val) {
  if (val > 0) return "+" + val;
  if (val < 0) return String(val);
  return "—";
}

function displayCharacter(data) {
  const c = data.character;

  // Identity
  document.getElementById("r-class").textContent = c.character_class;
  document.getElementById("r-title").textContent = c.title;
  document.getElementById("r-alignment").textContent = c.alignment;
  document.getElementById("r-hp").textContent = c.hp;
  document.getElementById("r-ac").textContent = c.ac;

  // Abilities
  const abilities = ["str", "int", "wis", "dex", "con", "cha"];
  const mods = [
    c.str_melee_mod,
    c.int_languages, // just for display
    c.wis_magic_saves,
    c.dex_ac_mod,
    c.con_hp_mod,
    c.cha_npc_reactions
  ];

  abilities.forEach((stat, i) => {
    const el = document.getElementById("r-" + stat);
    el.querySelector(".ab-score").textContent = c[stat];
    el.querySelector(".ab-mod").textContent = fmtMod(mods[i]);
  });

  // Saves
  document.getElementById("r-save-d").textContent = c.save_death;
  document.getElementById("r-save-w").textContent = c.save_wands;
  document.getElementById("r-save-p").textContent = c.save_paralysis;
  document.getElementById("r-save-b").textContent = c.save_breath;
  document.getElementById("r-save-s").textContent = c.save_spells;

  // Equipment
  const equippedList = document.getElementById("r-equipped");
  const packedList = document.getElementById("r-packed");
  equippedList.innerHTML = "";
  packedList.innerHTML = "";

  (c.equipped || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    equippedList.appendChild(li);
  });

  (c.packed || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    packedList.appendChild(li);
  });

  // Notes
  document.getElementById("r-abilities").textContent = c.abilities || "—";
  document.getElementById("r-notes").textContent = c.notes || "—";

  // Download link
  const downloadLink = document.getElementById("download-link");
  downloadLink.href = data.pdf_url;

  // Show result
  resultDiv.classList.remove("hidden");
  errorDiv.classList.add("hidden");
}

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove("hidden");
  resultDiv.classList.add("hidden");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Gather form data
  const formData = new FormData(form);

  // Class: if "Random class", mode = random, else mode = choose with chosen_class
  const classValue = formData.get("class_selection");
  const classSelection = classValue === "random" ? "random" : "choose";
  const chosenClass = classValue === "random" ? null : classValue;

  // Build allowed alignments list
  const alignmentBlank = formData.get("alignment_blank") === "on";
  const allowedAlignments = [];
  if (!alignmentBlank) {
    if (formData.get("align_lawful") === "on") allowedAlignments.push("Lawful");
    if (formData.get("align_neutral") === "on") allowedAlignments.push("Neutral");
    if (formData.get("align_chaotic") === "on") allowedAlignments.push("Chaotic");
  }

  const options = {
    ruleset: formData.get("ruleset") || "classic",
    dice_method: formData.get("dice_method"),
    class_selection: classSelection,
    chosen_class: chosenClass,
    alignment_blank: alignmentBlank,
    allowed_alignments: allowedAlignments,
    ac_mode: formData.get("ac_mode") || "aac",
    encumbrance_mode: formData.get("encumbrance_mode") || "item_based",
    equipment_mode: formData.get("equipment_mode"),
    reroll_low_hp: formData.get("reroll_low_hp") === "on",
    reroll_subpar: formData.get("reroll_subpar") === "on",
    give_read_magic: formData.get("give_read_magic") === "on",
  };

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (data.success) {
      displayCharacter(data);
    } else {
      showError("Error: " + data.error);
    }
  } catch (err) {
    showError("Network error: " + err.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "🎲 Generate Character";
  }
});
