// OSE Character Creator — Character Generation Engine

function isValidClass(charClass, scores) {
  const reqs = CLASSES[charClass].requirements || {};
  for (const [stat, min] of Object.entries(reqs)) {
    if ((scores[stat] || 0) < min) return false;
  }
  return true;
}

function calcPrXpBonus(scores, charClass) {
  const prs = CLASSES[charClass].prime_requisites;
  if (prs.length === 1) return prXpMod(scores[prs[0]]);
  const minScore = Math.min(...prs.map(p => scores[p]));
  return prXpMod(minScore);
}

function pickRandomClassByXp(scores) {
  const valid = Object.keys(CLASSES).filter(c => isValidClass(c, scores));
  if (!valid.length) return "Fighter";

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
  return pickRandomClassByXp(scores);
}

function determineAlignment(options) {
  if (options.alignment_blank) return "";
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
    : pickRandomClassByXp(scores);

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
  const alignment = determineAlignment(options);

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
  if (CLASSES[charClass].spellcaster && charClass !== "Cleric") {
    let spellList = [...MU_ELF_SPELLS_L1];
    if (options.give_read_magic) {
      spellsKnown.push("Read Magic");
      spellList = spellList.filter(s => s !== "Read Magic");
    }
    spellsKnown.push(randomChoice(spellList));
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
  if (kit.gold_remaining > 0 && encMode === "item_based") {
    notes.push(`Remaining gold: ${kit.gold_remaining} gp`);
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
  const isDemiHuman = DEMI_HUMANS.has(charClass);
  const raceField = isDemiHuman ? charClass : "Human";
  const classField = isDemiHuman ? "" : charClass;
  const oldSheetClass = isDemiHuman ? charClass : `Human ${charClass}`;

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

  // Format languages (exclude "Alignment", deduplicate)
  const langsForSheet = [...new Set(languages.filter(l => l !== "Alignment"))].sort().join(", ");

  return {
    character_class: charClass,
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
