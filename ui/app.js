/* OSE Character Creator — App JavaScript */

const form = document.getElementById("gen-form");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error-msg");
const generateBtn = document.getElementById("generate-btn");

// Show/hide class picker based on selection
document.getElementById("class_selection").addEventListener("change", function () {
  const pickerGroup = document.getElementById("class-picker-group");
  pickerGroup.style.display = this.value === "choose_after" ? "block" : "none";
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
  const options = {
    dice_method: formData.get("dice_method"),
    class_selection: formData.get("class_selection"),
    chosen_class: formData.get("chosen_class") || null,
    alignment: formData.get("alignment"),
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
