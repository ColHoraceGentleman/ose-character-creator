// OSE Character Creator — Character Generation Engine

function isValidClass(charClass, scores) {
  const reqs = CLASSES[charClass].requirements || {};
  for (const [stat, min] of Object.entries(reqs)) {
    if ((scores[stat] || 0) < min) return false;
  }
  return true;
}

// Returns display name for AF classes (strip AF_ prefix, handle special cases)
const AF_DISPLAY_NAMES = {
  "AF_HalfElf": "Half-Elf",
  "AF_HalfOrc": "Half-Orc",
};
function classDisplayName(charClass) {
  if (AF_DISPLAY_NAMES[charClass]) return AF_DISPLAY_NAMES[charClass];
  return charClass.startsWith("AF_") ? charClass.slice(3) : charClass;
}

function calcPrXpBonus(scores, charClass) {
  const prs = CLASSES[charClass].prime_requisites;
  if (prs.length === 1) return prXpMod(scores[prs[0]]);
  const minScore = Math.min(...prs.map(p => scores[p]));
  return prXpMod(minScore);
}

function pickRandomClassByXp(scores, ruleset="classic") {
  // Filter by ruleset: classic excludes AF classes, advanced includes only AF classes
  const valid = Object.keys(CLASSES).filter(c => {
    const isAF = !!CLASSES[c].af_class;
    if (ruleset === "advanced") return isAF && isValidClass(c, scores);
    return !isAF && isValidClass(c, scores);
  });
  const fallback = ruleset === "advanced" ? "AF_Fighter" : "Fighter";
  if (!valid.length) return ruleset === "advanced" ? "AF_Barbarian" : "Fighter";

  const plus=[], none=[], minus10=[];
  for (const c of valid) {
    const b = calcPrXpBonus(scores, c);
    if (b==="+5%"||b==="+10%") plus.push(c);
    else if (b==="None") none.push(c);
    else if (b==="-10%") minus10.push(c);
  }

  if (plus.length) return randomChoice(plus);
  if (none.length) return randomChoice(none);
  if (minus10.length) return randomChoice(minus10);
  return randomChoice(valid);
}

function rollAbilityScores(method, chosenClass=null) {
  const ORDER = ["STR","INT","WIS","DEX","CON","CHA"];

  if (method === "3d6_order") {
    const s = {};
    for (const stat of ORDER) s[stat] = roll3d6();
    return s;
  }

  if (method === "4d6_order_drop_lowest") {
    const s = {};
    for (const stat of ORDER) s[stat] = roll4d6DropLowest();
    return s;
  }

  if (method === "3d6_optimized" || method === "4d6_optimized_drop_lowest") {
    const rollFn = method === "3d6_optimized" ? roll3d6 : roll4d6DropLowest;
    const rolls = shuffle([rollFn(),rollFn(),rollFn(),rollFn(),rollFn(),rollFn()]).sort((a,b)=>b-a);
    const prs = chosenClass ? CLASSES[chosenClass].prime_requisites : [];
    const nonPr = ORDER.filter(s => !prs.includes(s));
    const s = {};
    if (prs.length === 1) {
      s[prs[0]] = rolls[0];
      const remaining = rolls.slice(1);
      const shuffledNonPr = shuffle(nonPr);
      shuffledNonPr.forEach((stat,i) => s[stat] = remaining[i]);
    } else if (prs.length === 2) {
      const top2 = shuffle(rolls.slice(0,2));
      s[prs[0]] = top2[0]; s[prs[1]] = top2[1];
      const remaining = rolls.slice(2);
      const shuffledNonPr = shuffle(nonPr);
      shuffledNonPr.forEach((stat,i) => s[stat] = remaining[i]);
    } else {
      const shuffledOrder = shuffle(ORDER);
      shuffledOrder.forEach((stat,i) => s[stat] = rolls[i]);
    }
    return s;
  }

  // fallback
  const s = {};
  for (const stat of ORDER) s[stat] = roll3d6();
  return s;
}

function determineClass(scores, options) {
  const mode = options.class_selection || "random";
  if (mode === "choose" && options.chosen_class) {
    if (isValidClass(options.chosen_class, scores)) return options.chosen_class;
  }
  return pickRandomClassByXp(scores, options.ruleset || "classic");
}

function determineAlignment(options, charClass) {
  if (options.alignment_blank) return "";
  // Class alignment restrictions override user selection
  const classRestriction = (CLASSES[charClass] || {}).alignment_restriction;
  if (classRestriction) {
    // Intersect user allowed with class restriction; if nothing left, use class restriction
    const userAllowed = options.allowed_alignments || [];
    const valid = userAllowed.length
      ? classRestriction.filter(a => userAllowed.includes(a))
      : classRestriction;
    const pool = valid.length ? valid : classRestriction;
    return pool.length === 1 ? pool[0] : randomChoice(pool);
  }
  const allowed = options.allowed_alignments || [];
  if (!allowed.length) return "Neutral";
  if (allowed.length === 1) return allowed[0];
  return randomChoice(allowed);
}

function rollHp(charClass, conModVal, rerollLow, maxHpAt1=false, targetLevel=1) {
  const hd = CLASSES[charClass].hit_die;
  const hdCap = HD_CAP[charClass];
  const flatBonus = FLAT_HP_PER_LEVEL[charClass];
  let total = 0;

  for (let lvl = 1; lvl <= targetLevel; lvl++) {
    if (lvl > hdCap) {
      total += flatBonus;
    } else {
      let r;
      if (lvl === 1 && maxHpAt1) {
        r = hd;
      } else {
        r = rollHitDie(hd);
        if (rerollLow) while (r <= 2) r = rollHitDie(hd);
      }
      total += Math.max(1, r + conModVal);
    }
  }
  return total;
}

function calculateAac(dexModVal, armourName, hasShield) {
  let base = 10;
  if (armourName && ARMOUR[armourName] && ARMOUR[armourName].aac) base = ARMOUR[armourName].aac;
  return base + dexModVal + (hasShield ? 1 : 0);
}

function determineLanguages(charClass, intScore, extraLanguages) {
  const base = [...(CLASSES[charClass].languages || []), "Common"];
  base.push("Alignment");
  const available = LANGUAGE_PICK_LIST.filter(l => !base.includes(l));
  const shuffled = shuffle(available);
  for (let i = 0; i < extraLanguages && i < shuffled.length; i++) base.push(shuffled[i]);
  return base;
}

function fmtBonus(val) {
  if (val > 0) return `+${val}`;
  if (val < 0) return `${val}`;
  return "";
}

function fmtDamage(die, bonus) {
  if (bonus > 0) return `${die}+${bonus}`;
  if (bonus < 0) return `${die}${bonus}`;
  return die;
}

// Name generation: map class to name set key
function getNameSetKey(charClass) {
  const map = {
    // Classic
    "Fighter": "human", "Cleric": "human", "Magic-User": "human", "Thief": "human",
    "Dwarf": "dwarf", "Elf": "elf", "Halfling": "halfling",
    // AF human classes
    "AF_Acrobat": "human", "AF_Assassin": "human", "AF_Barbarian": "human",
    "AF_Bard": "human", "AF_Druid": "human", "AF_Illusionist": "human",
    "AF_Knight": "human", "AF_Paladin": "human", "AF_Ranger": "human",
    // AF demihuman
    "AF_Drow": "drow", "AF_Duergar": "duergar", "AF_Gnome": "gnome",
    "AF_HalfElf": "half-elf", "AF_HalfOrc": "half-orc",
  };
  return map[charClass] || "human";
}

function formatEquippedItems(equipped, strMeleeModVal, dexMissileModVal) {
  return equipped.map(item => {
    if (WEAPONS[item]) {
      const w = WEAPONS[item];
      const quals = w.qualities || [];
      const isMelee = quals.includes("Melee");
      const isMissile = quals.includes("Missile");
      const dmg = w.damage;

      if (isMelee && isMissile) {
        const mHit = strMeleeModVal; const mDmg = strMeleeModVal;
        const rHit = dexMissileModVal;
        const mParts = [];
        if (mHit !== 0) mParts.push(`${fmtBonus(mHit)} to hit`);
        mParts.push(`${fmtDamage(dmg,mDmg)} dmg`);
        const rParts = [];
        if (rHit !== 0) rParts.push(`${fmtBonus(rHit)} to hit (thrown)`);
        return `${item}: ${mParts.join("; ")}${rParts.length ? " / " + rParts.join("; ") : ""}`;
      } else if (isMelee) {
        const hit = strMeleeModVal; const dmgB = strMeleeModVal;
        const parts = [];
        if (hit !== 0) parts.push(`${fmtBonus(hit)} to hit`);
        parts.push(`${fmtDamage(dmg,dmgB)} dmg`);
        return `${item}: ${parts.join("; ")}`;
      } else if (isMissile) {
        const hit = dexMissileModVal;
        const parts = [];
        if (hit !== 0) parts.push(`${fmtBonus(hit)} to hit`);
        parts.push(`${fmtDamage(dmg,0)} dmg`);
        return `${item}: ${parts.join("; ")}`;
      }
      return item;
    }
    if (ARMOUR[item]) {
      const a = ARMOUR[item];
      if (a.aac_bonus) return `${item} (+${a.aac_bonus} AC)`;
      return `${item} (${a.aac} AC)`;
    }
    return item;
  });
}

// Secondary Skill table (d100 roll -> profession)
function rollSecondarySkill(depth=0) {
  if (depth > 4) return "Farmer"; // recursion guard (99-00 re-rolls)
  const SECONDARY_SKILLS = [
    "Animal trainer", "Animal trainer", "Animal trainer", // 01-03
    "Armourer", "Armourer", // 04-05
    "Baker", "Baker", "Baker", "Baker", // 06-09
    "Blacksmith", "Blacksmith", "Blacksmith", // 10-12
    "Bookbinder", // 13
    "Bowyer / fletcher", "Bowyer / fletcher", "Bowyer / fletcher", // 14-16
    "Brewer", "Brewer", "Brewer", "Brewer", // 17-20
    "Butcher", "Butcher", "Butcher", // 21-23
    "Carpenter", "Carpenter", "Carpenter", // 24-26
    "Chandler", "Chandler", // 27-28
    "Cooper", "Cooper", "Cooper", "Cooper", "Cooper", // 29-33
    "Coppersmith", "Coppersmith", // 34-35
    "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", // 36-46
    "Fisher", "Fisher", "Fisher", "Fisher", // 47-50
    "Furrier", "Furrier", "Furrier", "Furrier", // 51-54
    "Glassblower", // 55
    "Huntsman", "Huntsman", "Huntsman", "Huntsman", // 56-59
    "Lapidary / jeweller", "Lapidary / jeweller", "Lapidary / jeweller", // 60-62
    "Lorimer", "Lorimer", "Lorimer", "Lorimer", // 63-66
    "Mapmaker", // 67
    "Mason", "Mason", // 68-69
    "Miner", "Miner", "Miner", "Miner", // 70-73
    "Potter", "Potter", "Potter", // 74-76
    "Roper", "Roper", // 77-78
    "Seafarer", "Seafarer", "Seafarer", // 79-81
    "Shipwright", "Shipwright", "Shipwright", // 82-84
    "Tailor", "Tailor", "Tailor", // 85-87
    "Tanner", "Tanner", "Tanner", // 88-90
    "Thatcher / roofer", "Thatcher / roofer", "Thatcher / roofer", // 91-93
    "Woodcutter", "Woodcutter", "Woodcutter", // 94-96
    "Vintner", "Vintner", // 97-98
  ];
  const roll = Math.floor(Math.random() * 100) + 1;
  if (roll >= 99) {
    // Roll twice
    return rollSecondarySkill(depth+1) + " / " + rollSecondarySkill(depth+1);
  }
  const idx = Math.min(roll - 1, 98);
  return SECONDARY_SKILLS[idx] || "Farmer";
}

function generateCharacter(options) {
  const classSelection = options.class_selection || "random";
  const chosenClass = options.chosen_class || null;
  const diceMethod = options.dice_method || "3d6_order";
  const acMode = options.ac_mode || "aac";
  const encMode = options.encumbrance_mode || "item_based";
  const targetLevelRaw = parseInt(options.level || 1);

  // Roll scores
  let scores;
  const useOptimized = diceMethod.includes("optimized");
  const effectiveClass = (classSelection === "choose" && chosenClass) ? chosenClass : null;

  function doRoll() {
    return rollAbilityScores(diceMethod, effectiveClass || "Fighter");
  }

  if (options.reroll_subpar) {
    do { scores = doRoll(); } while (!Object.values(scores).some(s => s > 8));
  } else {
    scores = doRoll();
  }

  // Determine class
  const charClass = (classSelection === "choose" && chosenClass && isValidClass(chosenClass, scores))
    ? chosenClass
    : pickRandomClassByXp(scores, options.ruleset || "classic");

  // Clamp level to class max
  const maxLevel = CLASSES[charClass].max_level;
  const targetLevel = Math.max(1, Math.min(targetLevelRaw, maxLevel));

  // Modifiers
  const mods = {
    STR: strMod(scores.STR),
    INT: intMod(scores.INT),
    WIS: wisMod(scores.WIS),
    DEX: dexMod(scores.DEX),
    CON: conMod(scores.CON),
    CHA: chaMod(scores.CHA),
  };

  const prog = LEVEL_PROGRESSION[charClass][targetLevel];
  const alignment = determineAlignment(options, charClass);

  // HP
  const hp = rollHp(charClass, mods.CON.hp, options.reroll_low_hp||false, options.max_hp_at_level1||false, targetLevel);

  // Attack / saves
  const attackBonus = prog.aac_ab;
  const saves = prog.saves;

  // Languages / literacy
  const languages = determineLanguages(charClass, scores.INT, mods.INT.languages);
  const literate = mods.INT.literacy === "Literate";

  // Level info
  const title = LEVEL_TITLES[charClass][targetLevel - 1];
  const xpCurrent = prog.xp;
  const xpNext = targetLevel < maxLevel ? LEVEL_PROGRESSION[charClass][targetLevel+1].xp : xpCurrent;
  const prXp = calcPrXpBonus(scores, charClass);

  // Equipment
  const startingGold = rollStartingGold();
  const kit = (options.equipment_mode === "auto")
    ? autoKit(charClass, startingGold)
    : {equipped:[],packed:[],unencumbering:[],gold_spent:0,gold_remaining:startingGold};

  // Spells
  const spellsKnown = [];
  const classData = CLASSES[charClass];
  if (classData.spellcaster) {
    const spellsStartLevel = classData.spells_start_level || 1;
    const hasSpellsAtLevel = targetLevel >= spellsStartLevel;

    if (charClass === "Cleric" || charClass === "AF_Paladin" || charClass === "AF_Drow" || !hasSpellsAtLevel) {
      // Clerics, Paladins, and Drow don't start with a spell book
    } else if (charClass === "AF_Druid" || charClass === "AF_Bard" || charClass === "AF_Ranger") {
      // Druid-list casters: pick one random 1st-level druid spell as known
      spellsKnown.push(randomChoice(DRUID_SPELLS_L1));
    } else if (charClass === "AF_Illusionist" || charClass === "AF_Gnome") {
      let list = [...ILLUSIONIST_SPELLS_L1];
      if (options.give_read_magic) {
        spellsKnown.push("Read Magic");
        list = list.filter(s => s !== "Read Magic");
      }
      spellsKnown.push(randomChoice(list));
    } else {
      // MU / Elf / Half-Elf
      let spellList = [...MU_ELF_SPELLS_L1];
      if (options.give_read_magic) {
        spellsKnown.push("Read Magic");
        spellList = spellList.filter(s => s !== "Read Magic");
      }
      spellsKnown.push(randomChoice(spellList));
    }
  }

  // Notes
  const notes = [];
  for (const spell of spellsKnown) {
    const page = SPELL_PAGE_NUMBERS[spell];
    notes.push(`Spell: ${spell}${page ? ` (p. ${page})` : ""}`);
  }
  if (charClass === "Thief") {
    const ts = CLASSES["Thief"].thief_skills_lvl1;
    notes.push(`Thief Skills: CS ${ts.CS}, TR ${ts.TR}, HN ${ts.HN}, HS ${ts.HS}, MS ${ts.MS}, OL ${ts.OL}, PP ${ts.PP}`);
  }
  if (charClass === "AF_Acrobat") {
    const sk = ACROBAT_SKILLS[targetLevel];
    notes.push(`Acrobat Skills (level ${targetLevel}): Climb ${sk.climb}, Falling (reduce dmg by ${sk.falling}), Hide in Shadows ${sk.hide}, Move Silently ${sk.move}, Tightrope Walking ${sk.tightrope}`);
  }
  if (charClass === "AF_Assassin") {
    const sk = ASSASSIN_SKILLS[targetLevel];
    const asn = sk.assassination ? `Assassination (victim saves vs death ${sk.assassination})` : "Assassination: not yet available (gained at 2nd level)";
    notes.push(`Assassin Skills (level ${targetLevel}): ${asn}, Climb ${sk.climb}, Hear Noise ${sk.hear}, Hide in Shadows ${sk.hide}, Move Silently ${sk.move}`);
  }
  if (charClass === "AF_Barbarian") {
    notes.push("Illiterate at 1st level (cannot read or write regardless of INT)");
  }
  if (charClass === "AF_Druid") {
    notes.push("Armour: leather only; shields must be wooden (no metal)");
  }
  if (charClass === "AF_Paladin" && targetLevel < 9) {
    notes.push("Cleric spells available from 9th level");
  }
  if (charClass === "AF_Ranger" && targetLevel < 8) {
    notes.push("Druid spells available from 8th level");
  }
  if (charClass === "AF_Drow" && targetLevel === 1) {
    notes.push("Spell restriction: at 1st level may only pray for Light (Darkness); full cleric list from 2nd level; may also pray for web (MU spell) from 3rd level");
  }
  if (charClass === "AF_Drow" && targetLevel >= 3) {
    notes.push("May also pray for web (Magic-User spell) in addition to cleric spells");
  }
  if (charClass === "AF_HalfElf" && targetLevel < 2) {
    notes.push("Arcane spells (Magic-User list) available from 2nd level");
  }
  if (charClass === "AF_HalfOrc") {
    const sk = HALFORC_SKILLS[targetLevel];
    notes.push(`Half-Orc Skills (level ${targetLevel}): Hide in Shadows ${sk.hide}, Move Silently ${sk.move}, Pick Pockets ${sk.pp}`);
    notes.push("Pick Pockets: −5% per level of target above 5th; rolling >2× success means caught");
  }
  if (charClass === "AF_Duergar") {
    notes.push("Mental Powers (1/day/level): Enlargement (double size/dmg 1d4 rds), Invisibility (1 turn, affects 1HD/level), Shrinking (6\" tall, 1 turn/level), Heat (1d4 dmg/rd, 1 rd/level)");
    notes.push("Activating a mental power requires full concentration (no movement, attacks, or other actions that round)");
  }
  if (charClass === "AF_Drow" || charClass === "AF_Duergar") {
    notes.push("Light sensitivity: −2 to attack rolls and −1 AC in bright light (daylight or continual light)");
  }
  // Spell slots for AF spellcasters
  const afSlotClass = AF_SPELL_SLOTS[charClass];
  if (afSlotClass) {
    const slots = afSlotClass[targetLevel];
    if (slots && slots.length > 0) {
      const slotStr = slots.map((n, i) => `L${i+1}:${n}`).join(", ");
      notes.push(`Spell Slots: ${slotStr}`);
    }
  }
  if (kit.gold_remaining > 0 && encMode === "item_based") {
    notes.push(`Remaining gold: ${kit.gold_remaining} gp`);
  }

  // Secondary Skill
  if (options.secondary_skill) {
    const secSkill = rollSecondarySkill();
    notes.push(`Secondary Skill: ${secSkill}`);
  }

  // Magic Item
  if (options.magic_items) {
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= (options.magic_item_pct || 10)) {
      const itemList = (options.ruleset === "advanced") ? AF_MAGIC_ITEMS : CF_MAGIC_ITEMS;
      const item = itemList[Math.floor(Math.random() * itemList.length)];
      notes.push(`Magic Item: ${item}`);
    }
  }

  // Weapon Proficiency
  if (options.weapon_proficiency) {
    const martialCat = MARTIAL_CATEGORY[charClass] || "non-martial";
    const classProgs = LEVEL_PROGRESSION[charClass];
    // Count THAC0 improvements from level 1 to targetLevel
    let thac0ImprovementCount = 0;
    let prevThac0 = classProgs[1].thac0;
    for (let lvl = 2; lvl <= targetLevel; lvl++) {
      const currThac0 = classProgs[lvl].thac0;
      if (currThac0 < prevThac0) thac0ImprovementCount++;
      prevThac0 = currThac0;
    }
    const totalProfs = MARTIAL_STARTING_PROFS[martialCat] + thac0ImprovementCount;
    
    // Build available weapon list
    const weaponRules = CLASS_WEAPON_RULES[charClass];
    let availableWeapons;
    if (weaponRules && weaponRules.only) {
      availableWeapons = weaponRules.only;
    } else {
      availableWeapons = Object.keys(WEAPONS);
      if (weaponRules && weaponRules.excluded) {
        availableWeapons = availableWeapons.filter(w => !weaponRules.excluded.includes(w));
      }
    }
    // Shuffle and pick
    const shuffled = shuffle(availableWeapons);
    const profs = shuffled.slice(0, Math.min(totalProfs, availableWeapons.length)).sort();
    const catName = martialCat.charAt(0).toUpperCase() + martialCat.slice(1);
    const penalty = MARTIAL_NONPROF_PENALTY[martialCat];
    notes.push(`Weapon Proficiencies (${catName}): ${profs.join(", ")}`);
    notes.push(`Non-proficiency penalty: ${penalty} to attack rolls`);
  }

  // AC calculations
  const equippedItems = kit.equipped || [];
  let armourName = null;
  for (const item of equippedItems) {
    if (ARMOUR[item] && !ARMOUR[item].aac_bonus) armourName = item;
  }
  const hasShield = equippedItems.includes("Shield");
  const aac = calculateAac(mods.DEX.ac, armourName, hasShield);
  const unarmAac = calculateAac(mods.DEX.ac, null, false);

  let ac, unarmAc, thac = {};
  if (acMode === "dac") {
    const dexModAc = mods.DEX.ac;
    const armourDac = armourName ? (ARMOUR_DAC_BONUS[armourName]||0) : 0;
    const shieldDac = hasShield ? (ARMOUR_DAC_BONUS["Shield"]||0) : 0;
    ac = 9 - dexModAc - armourDac - shieldDac;
    unarmAc = 9 - dexModAc;
    const thac0 = prog.thac0;
    const sMod = mods.STR.melee;
    for (let n = 0; n <= 9; n++) thac[`thac${n}`] = Math.max(1, Math.min(20, thac0 - n - sMod));
  } else {
    ac = aac;
    unarmAc = unarmAac;
  }

  // Encumbrance / movement
  let mv, encFields;
  if (encMode === "standard") {
    mv = calculateStandardEncumbrance(equippedItems, kit.packed||[], kit.unencumbering||[]);
    encFields = {equipment_cn:mv.equipment_cn, treasure_cn:mv.treasure_cn, total_cn:mv.total_cn};
  } else {
    mv = calculateMovement(equippedItems, kit.packed||[], mods.STR.melee);
    encFields = {
      equipped_item_count:mv.equipped_item_count,
      packed_item_count:mv.packed_item_count,
      packed_str_threshold_18: 14 + mods.STR.melee,
      packed_str_threshold_16: 12 + mods.STR.melee,
      packed_str_threshold_13: 10 + mods.STR.melee,
    };
  }

  // Race/Class display
  const DEMI_HUMANS = new Set(["Dwarf","Elf","Halfling"]);
  const AF_DEMI_HUMANS = new Set(["AF_Drow","AF_Duergar","AF_Gnome","AF_HalfElf","AF_HalfOrc"]);
  const isDemiHuman = DEMI_HUMANS.has(charClass) || AF_DEMI_HUMANS.has(charClass);
  const displayClass = classDisplayName(charClass);
  // For AF demihumans, race = friendly name, class = blank
  const AF_DEMIHUMAN_RACE_NAMES = {
    "AF_Drow": "Drow", "AF_Duergar": "Duergar", "AF_Gnome": "Gnome",
    "AF_HalfElf": "Half-Elf", "AF_HalfOrc": "Half-Orc",
  };
  const raceField = isDemiHuman
    ? (AF_DEMIHUMAN_RACE_NAMES[charClass] || charClass)
    : "Human";
  const classField = isDemiHuman ? "" : displayClass;
  const oldSheetClass = isDemiHuman
    ? (AF_DEMIHUMAN_RACE_NAMES[charClass] || charClass)
    : `Human ${displayClass}`;

  // Special abilities (filter already-shown-elsewhere)
  const abilities = (CLASSES[charClass].special_abilities || [])
    .filter(a => !ABILITIES_SHOWN_ELSEWHERE.has(a))
    .join("\n");

  // Exploration skills
  let findRoomTrap = "—", findSecretDoor = "—", listenAtDoor = "—";
  if (charClass === "Dwarf") { findRoomTrap = "2-in-6"; listenAtDoor = "2-in-6"; }
  if (charClass === "Elf")  { findSecretDoor = "2-in-6"; listenAtDoor = "2-in-6"; }
  if (charClass === "Halfling") { listenAtDoor = "2-in-6"; }

  const openStuckDoor = `${mods.STR.open_doors}-in-6`;

  // Halfling AC bonus vs large (show on sheet)
  const dexAcForSheet = charClass === "Halfling" ? mods.DEX.ac + 2 : mods.DEX.ac;

  // Name generation
  let charName = "";
  if (options.generate_name) {
    const nameKey = getNameSetKey(charClass);
    charName = generate_name(nameKey) || "Unknown";
  }

  // Format languages (exclude "Alignment", deduplicate)
  const langsForSheet = [...new Set(languages.filter(l => l !== "Alignment"))].sort().join(", ");

  return {
    name: charName,
    character_class: displayClass,
    old_sheet_class: oldSheetClass,
    race_field: raceField,
    class_field: classField,
    title,
    level: targetLevel,
    alignment,
    ac_mode: acMode,
    encumbrance_mode: encMode,
    str: scores.STR, int: scores.INT, wis: scores.WIS,
    dex: scores.DEX, con: scores.CON, cha: scores.CHA,
    str_melee_mod: mods.STR.melee,
    str_open_doors: mods.STR.open_doors,
    int_languages: mods.INT.languages,
    int_literacy: mods.INT.literacy,
    wis_magic_saves: mods.WIS.magic_saves,
    dex_ac_mod: dexAcForSheet,
    dex_missile_mod: mods.DEX.missile,
    dex_initiative_mod: mods.DEX.initiative,
    con_hp_mod: mods.CON.hp,
    cha_npc_reactions: mods.CHA.npc_reactions,
    cha_max_retainers: mods.CHA.max_retainers,
    cha_loyalty: mods.CHA.loyalty,
    hp, max_hp: hp,
    ac, unarmoured_ac: unarmAc,
    attack_bonus: attackBonus,
    ...thac,
    save_death: saves.D, save_wands: saves.W, save_paralysis: saves.P,
    save_breath: saves.B, save_spells: saves.S,
    encounter_movement: mv.encounter_movement,
    exploration_movement: mv.exploration_movement,
    overland_movement: mv.overland_movement,
    ...encFields,
    find_room_trap: findRoomTrap,
    find_secret_door: findSecretDoor,
    open_stuck_door: openStuckDoor,
    listen_at_door: listenAtDoor,
    languages: langsForSheet,
    literate,
    abilities,
    notes: notes.join("\n"),
    xp: xpCurrent,
    xp_next_level: xpNext,
    pr_xp_bonus: prXp,
    equipped: formatEquippedItems(equippedItems, mods.STR.melee, mods.DEX.missile),
    packed: kit.packed || [],
    unencumbering: kit.unencumbering || [],
    gold_remaining: kit.gold_remaining,
    spells_known: spellsKnown,
    starting_gold: startingGold,
  };
}
