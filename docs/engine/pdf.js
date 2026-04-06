// OSE Character Creator — PDF filling using pdf-lib

// Cache raw PDF bytes (ArrayBuffer) so we can create a fresh PDFDocument each time.
const pdfBytesCache = {};

async function loadPdfBytes(path) {
  if (pdfBytesCache[path]) return pdfBytesCache[path];
  const resp = await fetch(path);
  const buf = await resp.arrayBuffer();
  pdfBytesCache[path] = buf;
  return buf;
}

const SHEET_MAP = {
  "aac-item": "assets/sheet-aac-item.pdf",
  "aac-standard": "assets/sheet-aac-standard.pdf",
  "dac-item": "assets/sheet-dac-item.pdf",
  "dac-standard": "assets/sheet-dac-standard.pdf",
};

function fmtMod(val) {
  if (val > 0) return `+${val}`;
  if (val < 0) return `${val}`;
  return "";
}

function fmtXp(val) {
  try { return Number(val).toLocaleString(); } catch { return String(val); }
}

function fmtSkill(val) {
  if (!val || val === "—") return "";
  return val.replace("-in-6","").trim();
}

function fmtMultiline(items) {
  if (!items) return "";
  if (Array.isArray(items)) return items.filter(x=>x).join("\n");
  return String(items).split(";").map(s=>s.trim()).filter(s=>s).join("\n");
}

async function fillPdf(character, pdfPath) {
  const bytes = await loadPdfBytes(pdfPath);
  const pdfDoc = await PDFLib.PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  const acMode = character.ac_mode || "aac";
  const encMode = character.encumbrance_mode || "item_based";

  // Helper to set text field
  function setText(name, value) {
    try {
      const f = form.getTextField(name);
      if (f) f.setText(String(value));
    } catch(e) { /* field not found */ }
  }

  function setTextGrey(name, value) {
    try {
      const f = form.getTextField(name);
      if (f) {
        f.setText(String(value));
        f.setFontColor(PDFLib.rgb(0.7, 0.7, 0.7));
      }
    } catch(e) { /* field not found */ }
  }

  // Helper to set checkbox
  function setCheck(name, checked) {
    try {
      const f = form.getCheckBox(name);
      if (f) checked ? f.check() : f.uncheck();
    } catch(e) { /* field not found */ }
  }

  if (acMode === "aac") {
    // AAC sheets — field names with " 2" suffix
    setText("Name 2", character.name || "");
    setText("Character Class 2", " " + (character.old_sheet_class || character.character_class || ""));
    setText("Title 2", " " + (character.title || ""));
    setText("Level 2", String(character.level || 1));
    setText("Alignment 2", " " + (character.alignment || ""));
    setText("STR 2", String(character.str || ""));
    setText("INT 2", String(character.int || ""));
    setText("WIS 2", String(character.wis || ""));
    setText("DEX 2", String(character.dex || ""));
    setText("CON 2", String(character.con || ""));
    setText("CHA 2", String(character.cha || ""));
    setText("STR Melee Mod", fmtMod(character.str_melee_mod));
    setText("DEX Missile Mod", fmtMod(character.dex_missile_mod));
    setText("DEX AC Mod 2", fmtMod(character.dex_ac_mod));
    setText("Initiative DEX Mod 2", fmtMod(character.dex_initiative_mod));
    setText("Reactions CHA Mod 2", fmtMod(character.cha_npc_reactions));
    setText("Magic Save Mod 2", fmtMod(character.wis_magic_saves));
    setText("CON HP Mod 2", fmtMod(character.con_hp_mod));
    setText("HP 2", String(character.hp || ""));
    setText("Max HP 2", String(character.max_hp || ""));
    setText("AC 2", String(character.ac || ""));
    setText("Unarmoured AC 2", String(character.unarmoured_ac || ""));
    setText("Attack Bonus", fmtMod(character.attack_bonus));
    setText("Death Save 2", String(character.save_death || ""));
    setText("Wands Save 2", String(character.save_wands || ""));
    setText("Paralysis Save 2", String(character.save_paralysis || ""));
    setText("Breath Save 2", String(character.save_breath || ""));
    setText("Spells Save 2", String(character.save_spells || ""));
    setText("Encounter Movement 2", character.encounter_movement || "40'");
    setText("Exporation Movement 2", character.exploration_movement || "120'");
    setText("Overland Movement 2", character.overland_movement || "24");
    setText("Find Room Trap 2", fmtSkill(character.find_room_trap));
    setText("Find Secret Door 2", fmtSkill(character.find_secret_door));
    setText("Open Stuck Door 2", fmtSkill(character.open_stuck_door));
    setText("Listen at Door 2", fmtSkill(character.listen_at_door));
    setText("Languages 2", character.languages || "");
    setText("Abilities, Skills, Weapons 2", fmtMultiline(character.abilities));
    setText("Notes 2", fmtMultiline(character.notes));
    setText("XP 2", String(character.xp || 0));
    setText("XP for Next Level 2", fmtXp(character.xp_next_level));
    setText("PR XP Bonus 2", character.pr_xp_bonus || "None");
    setCheck("Literacy 2", character.literate);
  } else {
    // DAC sheets — plain field names
    setText("Name", character.name || "");
    setText("Title", " " + (character.title || ""));
    setText("Race", " " + (character.race_field || ""));
    setText("Class", " " + (character.class_field || ""));
    setText("Level", String(character.level || 1));
    setText("Alignment", " " + (character.alignment || ""));
    setText("STR", String(character.str || ""));
    setText("INT", String(character.int || ""));
    setText("WIS", String(character.wis || ""));
    setText("DEX", String(character.dex || ""));
    setText("CON", String(character.con || ""));
    setText("CHA", String(character.cha || ""));
    setText("STR Melee Mod", fmtMod(character.str_melee_mod));
    setText("DEX Missile Mod", fmtMod(character.dex_missile_mod));
    setText("DEX AC Mod", fmtMod(character.dex_ac_mod));
    setText("Initiative DEX Mod", fmtMod(character.dex_initiative_mod));
    setText("Reactions CHA Mod", fmtMod(character.cha_npc_reactions));
    setText("Magic Save Mod", fmtMod(character.wis_magic_saves));
    setText("CON HP Mod", fmtMod(character.con_hp_mod));
    setText("HP", String(character.hp || ""));
    setText("Max HP", String(character.max_hp || ""));
    setText("AC", String(character.ac || ""));
    setText("Unarmoured AC", String(character.unarmoured_ac || ""));
    // Attack Bonus left blank for DAC
    // THAC0-9
    for (let n = 0; n <= 9; n++) {
      setText(`THAC${n}`, String(character[`thac${n}`] || ""));
    }
    setText("Death Save", String(character.save_death || ""));
    setText("Wands Save", String(character.save_wands || ""));
    setText("Paralysis Save", String(character.save_paralysis || ""));
    setText("Breath Save", String(character.save_breath || ""));
    setText("Spells Save", String(character.save_spells || ""));
    setText("Encounter Movement", character.encounter_movement || "40'");
    setText("Exporation Movement", character.exploration_movement || "120'");
    setText("Overland Movement", character.overland_movement || "24");
    setText("Find Room Trap", fmtSkill(character.find_room_trap));
    setText("Find Secret Door", fmtSkill(character.find_secret_door));
    setText("Open Stuck Door", fmtSkill(character.open_stuck_door));
    setText("Listen at Door", fmtSkill(character.listen_at_door));
    setText("Forage", "1");
    setText("Hunt", "1");
    setText("Languages", character.languages || "");
    setText("Abilities, Skills, Weapons", fmtMultiline(character.abilities));
    setText("Notes", fmtMultiline(character.notes));
    setText("XP", String(character.xp || 0));
    setText("XP for Next Level", fmtXp(character.xp_next_level));
    setText("PR XP Bonus", character.pr_xp_bonus || "None");
    setCheck("Literacy", character.literate);
  }

  // Page 2 — encumbrance specific
  if (encMode === "item_based") {
    // Both AAC and DAC item sheets use " 2" suffix for page 2 fields
    const suf = " 2";
    setText(`Notes${suf}`, fmtMultiline(character.notes));
    setText(`XP${suf}`, String(character.xp || 0));
    setText(`XP for Next Level${suf}`, fmtXp(character.xp_next_level));
    setText(`PR XP Bonus${suf}`, character.pr_xp_bonus || "None");
    setText("Unencumbering Items", (character.unencumbering || []).join(", "));

    // STR thresholds
    character.str >= 13 ? setText("Packed STR 13+", String(character.packed_str_threshold_13 || 10)) : setTextGrey("Packed STR 13+", "Slot Unavailable");
    character.str >= 16 ? setText("Packed STR 16+", String(character.packed_str_threshold_16 || 12)) : setTextGrey("Packed STR 16+", "Slot Unavailable");
    character.str >= 18 ? setText("Packed STR 18+", String(character.packed_str_threshold_18 || 14)) : setTextGrey("Packed STR 18+", "Slot Unavailable");

    // Equipped slots 1-9
    const eq = character.equipped || [];
    for (let i = 1; i <= 9; i++) {
      setText(`Equipped ${i}`, eq[i-1] || "");
    }

    // Packed slots 1-16
    const pk = character.packed || [];
    const PACKED_STR = {1:9, 2:6, 3:4};
    const UNAVAIL = "Slot Unavailable";
    let pkIdx = 0;
    for (let slot = 1; slot <= 16; slot++) {
      const strReq = PACKED_STR[slot];
      if (strReq && character.str < strReq) {
        setTextGrey(`Packed ${slot}`, UNAVAIL);
      } else {
        setText(`Packed ${slot}`, pk[pkIdx] || "");
        pkIdx++;
      }
    }
  } else {
    // Standard encumbrance
    const eq = character.equipped || [];
    const pk = character.packed || [];
    const unenc = character.unencumbering || [];

    // Split equipped into weapons/armour vs other gear
    const weaponsArmour = [];
    const otherGear = [];
    for (const item of eq) {
      const base = item.split(" (")[0];
      if (WEAPONS[base] || ARMOUR[base]) weaponsArmour.push(item);
      else otherGear.push(item);
    }
    const allGear = otherGear.concat(pk).concat(unenc);

    setText("Weapons and Armour", fmtMultiline(weaponsArmour));
    setText("Equipment", fmtMultiline(allGear));
    setText("Magic Items", "");
    setText("Treasure", "");
    setText("Notes", fmtMultiline(character.notes));
    setText("PP", ""); setText("EP", ""); setText("SP", ""); setText("CP", "");
    const gpRem = character.gold_remaining || 0;
    setText("GP", gpRem > 0 ? String(gpRem) : "");
    setText("XP", String(character.xp || 0));
    setText("XP for Next Level", fmtXp(character.xp_next_level));
    setText("PR XP Bonus", character.pr_xp_bonus || "None");
    setText("Equipment Encumbrance", String(character.equipment_cn || ""));
    setText("Treasure Encumbrance", String(character.treasure_cn || 0));
    setText("Total Encumbrance", String(character.total_cn || ""));
  }

  // Regenerate field appearances so font colour changes (e.g. grey "Slot Unavailable") take effect
  try { form.updateFieldAppearances(); } catch(e) { /* best-effort */ }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function generatePdfBlob(character) {
  const acMode = character.ac_mode || "aac";
  const encMode = character.encumbrance_mode || "item_based";
  // Normalise encMode: "item_based" → "item", "standard" → "standard"
  const encKey = encMode === "item_based" ? "item" : "standard";
  const key = `${acMode}-${encKey}`;
  const pdfPath = SHEET_MAP[key];
  if (!pdfPath) throw new Error("Unknown AC/encumbrance combo: " + key);
  const pdfBytes = await fillPdf(character, pdfPath);
  return new Blob([pdfBytes], {type:"application/pdf"});
}
