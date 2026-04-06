// OSE Character Creator — Equipment data (ported from src/equipment.js)

const ADVENTURING_GEAR = {
  "Backpack":            {cost:5,  encumbrance:"storage"},
  "Crowbar":             {cost:10, encumbrance:1},
  "Garlic":              {cost:5,  encumbrance:0},
  "Grappling hook":      {cost:25, encumbrance:1},
  "Hammer (small)":      {cost:2,  encumbrance:1},
  "Holy symbol":         {cost:25, encumbrance:0},
  "Holy water (vial)":   {cost:25, encumbrance:1},
  "Iron spikes (12)":    {cost:1,  encumbrance:1},
  "Lantern":             {cost:10, encumbrance:1},
  "Mirror (hand-sized, steel)": {cost:5, encumbrance:1},
  "Oil (1 flask)":      {cost:2,  encumbrance:1},
  "Pole (10' long, wooden)": {cost:1, encumbrance:2},
  "Rations (iron, 7 days)":   {cost:15, encumbrance:1},
  "Rations (standard, 7 days)": {cost:5, encumbrance:1},
  "Rope (50')":         {cost:1,  encumbrance:1},
  "Sack (small)":       {cost:1,  encumbrance:"storage"},
  "Sack (large)":       {cost:2,  encumbrance:"storage"},
  "Stakes (3) and mallet": {cost:3, encumbrance:2},
  "Thieves' tools":      {cost:25, encumbrance:1},
  "Tinder box":         {cost:3,  encumbrance:1},
  "Torches (6)":        {cost:1,  encumbrance:2},
  "Waterskin":          {cost:1,  encumbrance:1},
  "Wine (2 pints)":    {cost:1,  encumbrance:1},
  "Wolfsbane (1 bunch)": {cost:10, encumbrance:1},
};

const WEAPONS = {
  "Battle axe":       {cost:7,  damage:"1d8", qualities:["Melee","Slow","Two-handed"], encumbrance:2},
  "Club":             {cost:3,  damage:"1d4", qualities:["Blunt","Melee"], encumbrance:1},
  "Crossbow":         {cost:30, damage:"1d6", qualities:["Missile","Reload","Slow","Two-handed"], encumbrance:2},
  "Dagger":           {cost:3,  damage:"1d4", qualities:["Melee","Missile"], encumbrance:1},
  "Hand axe":         {cost:4,  damage:"1d6", qualities:["Melee","Missile"], encumbrance:1},
  "Javelin":          {cost:1,  damage:"1d4", qualities:["Missile"], encumbrance:1},
  "Lance":            {cost:5,  damage:"1d6", qualities:["Charge","Melee"], encumbrance:2},
  "Long bow":         {cost:40, damage:"1d6", qualities:["Missile","Two-handed"], encumbrance:2},
  "Mace":             {cost:5,  damage:"1d6", qualities:["Blunt","Melee"], encumbrance:1},
  "Polearm":          {cost:7,  damage:"1d10", qualities:["Brace","Melee","Slow","Two-handed"], encumbrance:2},
  "Short bow":        {cost:25, damage:"1d6", qualities:["Missile","Two-handed"], encumbrance:2},
  "Short sword":      {cost:7,  damage:"1d6", qualities:["Melee"], encumbrance:1},
  "Silver dagger":    {cost:30, damage:"1d4", qualities:["Melee","Missile"], encumbrance:1},
  "Sling":            {cost:2,  damage:"1d4", qualities:["Blunt","Missile"], encumbrance:1},
  "Spear":            {cost:4,  damage:"1d6", qualities:["Brace","Melee","Missile"], encumbrance:1},
  "Staff":            {cost:2,  damage:"1d4", qualities:["Blunt","Melee","Slow","Two-handed"], encumbrance:2},
  "Sword":            {cost:10, damage:"1d8", qualities:["Melee"], encumbrance:1},
  "Two-handed sword": {cost:15, damage:"1d10", qualities:["Melee","Slow","Two-handed"], encumbrance:2},
  "Warhammer":        {cost:5,  damage:"1d6", qualities:["Blunt","Melee"], encumbrance:1},
};

const ARMOUR = {
  "Leather":     {aac:12, cost:20, encumbrance:1},
  "Chainmail":  {aac:14, cost:40, encumbrance:2},
  "Plate mail":  {aac:16, cost:60, encumbrance:2},
  "Shield":      {aac_bonus:1, cost:10, encumbrance:1},
};

const ARMOUR_DAC_BONUS = {
  "Leather":2, "Chainmail":4, "Plate mail":6, "Shield":1,
};

// Standard Encumbrance weights in coins (cn)
const STANDARD_ENCUMBRANCE_WEIGHTS = {
  // Armour
  "Leather":150, "Chainmail":400, "Plate mail":500, "Shield":100,
  // Weapons
  "Battle axe":100, "Club":50, "Crossbow":100, "Dagger":10, "Hand axe":50,
  "Javelin":10, "Lance":100, "Long bow":30, "Mace":60, "Polearm":150,
  "Short bow":30, "Short sword":30, "Silver dagger":10, "Sling":20,
  "Spear":30, "Staff":40, "Sword":60, "Two-handed sword":150, "Warhammer":100,
  // Gear
  "Backpack":10, "Crowbar":50, "Garlic":10, "Grappling hook":80, "Hammer (small)":10,
  "Holy symbol":10, "Holy water (vial)":10, "Iron spikes (12)":100, "Lantern":30,
  "Mirror (hand-sized, steel)":5, "Oil (1 flask)":10, "Pole (10' long, wooden)":100,
  "Rations (iron, 7 days)":100, "Rations (standard, 7 days)":70, "Rope (50')":50,
  "Sack (small)":5, "Sack (large)":15, "Stakes (3) and mallet":30, "Thieves' tools":10,
  "Tinder box":10, "Torches (6)":60, "Waterskin":50, "Wine (2 pints)":50, "Wolfsbane (1 bunch)":10,
};

const CLASS_WEAPON_RULES = {
  // Classic
  "Cleric":        {allowed_qualities:["Blunt"], excluded:["Long bow","Two-handed sword","Battle axe","Polearm"]},
  "Dwarf":         {allowed_qualities:["any"], excluded:["Long bow","Two-handed sword","Polearm"]},
  "Elf":           {allowed_qualities:["any"], excluded:[]},
  "Fighter":       {allowed_qualities:["any"], excluded:[]},
  "Halfling":      {allowed_qualities:["any"], excluded:["Long bow","Two-handed sword","Polearm","Lance"]},
  "Magic-User":    {allowed_qualities:["any"], only:["Dagger"]},
  "Thief":         {allowed_qualities:["any"], excluded:[]},
  // Advanced Fantasy — Race as Class
  "AF_Acrobat":    {allowed_qualities:["any"], excluded:["Battle axe","Club","Crossbow","Hand axe","Lance","Long bow","Mace","Polearm","Two-handed sword","Warhammer"]},
  "AF_Assassin":   {allowed_qualities:["any"], excluded:[]},
  "AF_Barbarian":  {allowed_qualities:["any"], excluded:[]},
  "AF_Bard":       {allowed_qualities:["any"], excluded:["Battle axe","Crossbow","Lance","Polearm","Two-handed sword","Warhammer"], melee_only_two_handed:true},
  "AF_Druid":      {allowed_qualities:["any"], only:["Club","Dagger","Sling","Spear","Staff"]},
  "AF_Illusionist":{allowed_qualities:["any"], only:["Dagger"]},
  "AF_Knight":     {allowed_qualities:["any"], excluded:[]},
  "AF_Paladin":    {allowed_qualities:["any"], excluded:[]},
  "AF_Ranger":     {allowed_qualities:["any"], excluded:[]},
  // Advanced Fantasy — Demihuman
  "AF_Drow":       {allowed_qualities:["any"], excluded:[]},
  "AF_Duergar":    {allowed_qualities:["any"], excluded:["Long bow","Two-handed sword"]},
  "AF_Gnome":      {allowed_qualities:["any"], excluded:["Long bow","Two-handed sword"]},
  "AF_HalfElf":   {allowed_qualities:["any"], excluded:[]},
  "AF_HalfOrc":   {allowed_qualities:["any"], excluded:[]},
};

const CLASS_ARMOUR_RULES = {
  // Classic
  "Cleric":        {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Dwarf":         {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Elf":           {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Fighter":       {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Halfling":      {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Magic-User":    {can_wear:[], can_use_shield:false},
  "Thief":         {can_wear:["Leather"], can_use_shield:false},
  // Advanced Fantasy — Race as Class
  "AF_Acrobat":    {can_wear:["Leather"], can_use_shield:false},
  "AF_Assassin":   {can_wear:["Leather"], can_use_shield:true},
  "AF_Barbarian":  {can_wear:["Leather","Chainmail"], can_use_shield:true},
  "AF_Bard":       {can_wear:["Leather","Chainmail"], can_use_shield:false},
  "AF_Druid":      {can_wear:["Leather"], can_use_shield:true},  // wooden shields only (handled in notes)
  "AF_Illusionist":{can_wear:[], can_use_shield:false},
  "AF_Knight":     {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "AF_Paladin":    {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "AF_Ranger":     {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  // Advanced Fantasy — Demihuman
  "AF_Drow":       {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "AF_Duergar":    {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "AF_Gnome":      {can_wear:["Leather"], can_use_shield:true},
  "AF_HalfElf":   {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "AF_HalfOrc":   {can_wear:["Leather","Chainmail"], can_use_shield:true},
};

const CLASS_ESSENTIALS = {
  // Classic
  "Cleric":["Holy symbol"], "Dwarf":[], "Elf":[], "Fighter":[], "Halfling":[], "Magic-User":[], "Thief":["Thieves' tools"],
  // Advanced Fantasy — Race as Class
  "AF_Acrobat":[], "AF_Assassin":["Thieves' tools"], "AF_Barbarian":[],
  "AF_Bard":[], "AF_Druid":[], "AF_Illusionist":[],
  "AF_Knight":[], "AF_Paladin":["Holy symbol"], "AF_Ranger":[],
  // Advanced Fantasy — Demihuman
  "AF_Drow":["Holy symbol"], "AF_Duergar":[], "AF_Gnome":[],
  "AF_HalfElf":[], "AF_HalfOrc":[],
};

const STANDARD_KIT_ITEMS = [
  "Backpack","Torches (6)","Tinder box","Rations (standard, 7 days)",
  "Waterskin","Rope (50')","Iron spikes (12)","Sack (large)",
];

function getAllowedWeapons(charClass) {
  const rules = CLASS_WEAPON_RULES[charClass];
  if (rules.only) return rules.only;
  const excluded = rules.excluded || [];
  if (rules.allowed_qualities && rules.allowed_qualities.includes("Blunt")) {
    return Object.entries(WEAPONS).filter(([w,d]) => d.qualities.includes("Blunt") && !excluded.includes(w)).map(e => e[0]);
  }
  return Object.keys(WEAPONS).filter(w => !excluded.includes(w));
}

function bestAffordableShield(charClass, gold) {
  if (CLASS_ARMOUR_RULES[charClass].can_use_shield && gold >= 10) return 10;
  return 0;
}

function bestAffordableArmour(charClass, gold) {
  const allowed = CLASS_ARMOUR_RULES[charClass].can_wear;
  const options = Object.entries(ARMOUR)
    .filter(([name]) => allowed.includes(name))
    .filter(([name,d]) => d.cost <= gold)
    .sort((a,b) => b[1].aac - a[1].aac);
  if (options.length) return [options[0][0], options[0][1].cost];
  return [null,0];
}

function bestAffordableWeapon(charClass, gold) {
  const allowed = getAllowedWeapons(charClass);
  const damageRank = {"1d4":1,"1d6":2,"1d8":3,"1d10":4};
  const options = Object.entries(WEAPONS)
    .filter(([w]) => allowed.includes(w))
    .filter(([w,d]) => d.cost <= gold)
    .sort((a,b) => {
      const da = damageRank[a[1].damage]||0, db = damageRank[b[1].damage]||0;
      return da!==db ? db-da : a[1].cost-b[1].cost;
    });
  if (options.length) return [options[0][0], options[0][1].cost];
  return [null,0];
}

function itemEncumbrance(itemName, inUse=true) {
  if (WEAPONS[itemName]) return WEAPONS[itemName].encumbrance || 1;
  if (ARMOUR[itemName]) return ARMOUR[itemName].encumbrance || 1;
  if (ADVENTURING_GEAR[itemName]) {
    const enc = ADVENTURING_GEAR[itemName].encumbrance;
    if (enc === "storage") return inUse ? 0 : 1;
    return enc;
  }
  return 1;
}

function countEncumbrance(items, containersInUse=true) {
  return items.reduce((sum,item) => sum + itemEncumbrance(item,containersInUse), 0);
}

// Item-Based Encumbrance movement table
// [max_equipped, max_packed, exploration, encounter, overland]
const ENCUMBRANCE_TABLE = [
  [3,10,"120'","40'","24"],
  [5,12,"90'","30'","18"],
  [7,14,"60'","20'","12"],
  [9,16,"30'","10'","6"],
];

function calculateMovement(equippedItems, packedItems, strMeleeMod=0) {
  const eqCount = countEncumbrance(equippedItems, true);
  const pkCount = countEncumbrance(packedItems, true);

  function rateForEquipped(count) {
    for (const row of ENCUMBRANCE_TABLE) {
      if (count <= row[0]) return [row[2],row[3],row[4]];
    }
    return ["0'","0'","0"];
  }

  function rateForPacked(count, strMod) {
    for (const row of ENCUMBRANCE_TABLE) {
      if (count <= row[1] + strMod) return [row[2],row[3],row[4]];
    }
    return ["0'","0'","0"];
  }

  const eqRate = rateForEquipped(eqCount);
  const pkRate = rateForPacked(pkCount, strMeleeMod);

  const mv = s => s==="0'" ? 0 : parseInt(s.replace("'",""));
  const chosen = mv(eqRate[0]) <= mv(pkRate[0]) ? eqRate : pkRate;

  return {
    exploration_movement:chosen[0],
    encounter_movement:chosen[1],
    overland_movement:chosen[2],
    equipped_item_count:eqCount,
    packed_item_count:pkCount,
  };
}

function calculateStandardEncumbrance(equipped, packed, unencumbering=[]) {
  const allItems = equipped.concat(packed).concat(unencumbering);
  let totalCn = 0;
  for (const item of allItems) {
    totalCn += STANDARD_ENCUMBRANCE_WEIGHTS[item] || 0;
  }

  let exploration, encounter, overland;
  if (totalCn <= 400)      { exploration="120'"; encounter="40'"; overland="24"; }
  else if (totalCn <= 800)  { exploration="90'"; encounter="30'"; overland="18"; }
  else if (totalCn <= 1200) { exploration="60'"; encounter="20'"; overland="12"; }
  else if (totalCn <= 1600) { exploration="30'"; encounter="10'"; overland="6"; }
  else                      { exploration="0'"; encounter="0'"; overland="0"; }

  return {
    equipment_cn:totalCn,
    treasure_cn:0,
    total_cn:totalCn,
    exploration_movement:exploration,
    encounter_movement:encounter,
    overland_movement:overland,
  };
}

// ---------------------------------------------------------------------------
// CC2 Quick Equipment (Carcass Crawler #2, by Gavin Norman)
// ---------------------------------------------------------------------------

// Armour table (d6) — used for classes that roll armour
const CC2_ARMOUR_TABLE = [
  "Leather",             // 1
  "Leather + Shield",    // 2
  "Chainmail",           // 3
  "Chainmail + Shield",  // 4
  "Plate mail",          // 5
  "Plate mail + Shield", // 6
];

// Standard weapon table (d12)
const CC2_WEAPONS_TABLE = [
  "Battle axe",             // 1
  "Crossbow + 20 bolts",    // 2
  "Hand axe",               // 3
  "Mace",                   // 4
  "Polearm",                // 5
  "Short bow + 20 arrows",  // 6
  "Short sword",            // 7
  "Silver dagger",          // 8
  "Sling + 20 stones",      // 9
  "Spear",                  // 10
  "Sword",                  // 11
  "Warhammer",              // 12
];

// Class-specific weapon sub-tables (d4)
const CC2_ACROBAT_WEAPONS  = ["Polearm","Short bow + 20 arrows","Spear","Staff"];
const CC2_BARD_WEAPONS     = ["Crossbow + 20 bolts","Short sword","Sling + 20 stones","Sword"];
const CC2_CLERIC_WEAPONS   = ["Mace","Sling + 20 stones","Staff","Warhammer"];
const CC2_DRUID_WEAPONS    = ["Club","Dagger","Sling + 20 stones","Staff"];
const CC2_KNIGHT_WEAPONS   = ["Lance","Short sword","Sword","Warhammer"];

// Adventuring gear table (d12)
const CC2_GEAR_TABLE = [
  "Crowbar",                     // 1
  "Hammer (small) + 12 iron spikes", // 2
  "Holy water (vial)",           // 3
  "Lantern + 3 flasks of oil",   // 4
  "Mirror (hand-sized, steel)",  // 5
  "Pole (10' long, wooden)",     // 6
  "Rope (50')",                  // 7
  "Rope (50') + grappling hook", // 8
  "Sack (large)",                // 9
  "Sack (small)",                // 10
  "Stakes (3) and mallet",       // 11
  "Wolfsbane (1 bunch)",         // 12
];

// Per-class equipment config for CC2
// armour: "d6" = roll on armour table, "leather" = fixed leather, "none" = no armour
// weapons: array of table refs, each is rolled independently
// extra: fixed items always added
const CC2_CLASS_CONFIG = {
  // Classic
  "Cleric":         {armour:"d6",    weapons:[CC2_CLERIC_WEAPONS, CC2_CLERIC_WEAPONS], extra:["Holy symbol"]},
  "Dwarf":          {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],  extra:[]},
  "Elf":            {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],  extra:[]},
  "Fighter":        {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],  extra:[]},
  "Halfling":       {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],  extra:[]},
  "Magic-User":     {armour:"none",  weapons:["Dagger"],                               extra:[]},
  "Thief":          {armour:"leather",weapons:[CC2_WEAPONS_TABLE, CC2_WEAPONS_TABLE],  extra:["Thieves' tools"]},
  // AF human
  "AF_Acrobat":     {armour:"leather",weapons:[CC2_ACROBAT_WEAPONS, CC2_ACROBAT_WEAPONS], extra:[]},
  "AF_Assassin":    {armour:"leather",weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:[]},
  "AF_Barbarian":   {armour:"d4",    weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:[]},
  "AF_Bard":        {armour:"d4",    weapons:[CC2_BARD_WEAPONS,    CC2_BARD_WEAPONS],    extra:[]},
  "AF_Druid":       {armour:"leather",weapons:[CC2_DRUID_WEAPONS,  CC2_DRUID_WEAPONS],   extra:["Sprig of mistletoe"]},
  "AF_Illusionist": {armour:"none",  weapons:["Dagger"],                                extra:[]},
  "AF_Knight":      {armour:"d4+2",  weapons:[CC2_KNIGHT_WEAPONS, CC2_KNIGHT_WEAPONS],  extra:[]},
  "AF_Paladin":     {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:["Holy symbol"]},
  "AF_Ranger":      {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:[]},
  // AF demihuman
  "AF_Drow":        {armour:"leather",weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],   extra:["Holy symbol"]},
  "AF_Duergar":     {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:[]},
  "AF_Gnome":       {armour:"leather",weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],   extra:[]},
  "AF_HalfElf":    {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:[]},
  "AF_HalfOrc":    {armour:"d6",    weapons:[CC2_WEAPONS_TABLE,   CC2_WEAPONS_TABLE],   extra:[]},
  "AF_Svirfneblin":{armour:"leather",weapons:[CC2_WEAPONS_TABLE,  CC2_WEAPONS_TABLE],   extra:[]},
};

function rollCC2Armour(armourCode) {
  if (armourCode === "none")    return [];
  if (armourCode === "leather") return ["Leather"];
  if (armourCode === "d4") {
    // d4: results 1-4 = Leather, Leather+Shield, Chainmail, Chainmail+Shield
    const idx = Math.floor(Math.random() * 4);
    return CC2_ARMOUR_TABLE[idx].split(" + ");
  }
  if (armourCode === "d4+2") {
    // d4+2: results 3-6 = Chainmail, Chainmail+Shield, Plate mail, Plate mail+Shield
    const idx = 2 + Math.floor(Math.random() * 4);
    return CC2_ARMOUR_TABLE[idx].split(" + ");
  }
  // d6: full table
  const idx = Math.floor(Math.random() * 6);
  return CC2_ARMOUR_TABLE[idx].split(" + ");
}

function rollCC2Weapon(table) {
  if (typeof table === "string") return table; // fixed item like "Dagger"
  return table[Math.floor(Math.random() * table.length)];
}

function expandCC2Item(itemStr) {
  // Expand compound items like "Crossbow + 20 bolts" or "Lantern + 3 flasks of oil"
  // into individual items for the equipment list
  const expansions = {
    "Crossbow + 20 bolts":       ["Crossbow", "Crossbow bolts (20)"],
    "Short bow + 20 arrows":     ["Short bow", "Arrows (20)"],
    "Sling + 20 stones":         ["Sling", "Sling stones (20)"],
    "Hammer (small) + 12 iron spikes": ["Hammer (small)", "Iron spikes (12)"],
    "Lantern + 3 flasks of oil": ["Lantern", "Oil (1 flask)", "Oil (1 flask)", "Oil (1 flask)"],
    "Rope (50') + grappling hook": ["Rope (50')", "Grappling hook"],
    "Stakes (3) and mallet":     ["Stakes (3) and mallet"],
    "Club":                      ["Club"],
    "Lance":                     ["Lance"],
    "Sprig of mistletoe":        ["Sprig of mistletoe"],
  };
  return expansions[itemStr] || [itemStr];
}

function autoKit(charClass, gold) {
  const equipped = [];
  const packed = [];
  const unencumbering = [];

  function addItem(itemName, location) {
    const enc = itemEncumbrance(itemName, true);
    if (enc === 0) { if (!unencumbering.includes(itemName)) unencumbering.push(itemName); }
    else if (location === "equipped") equipped.push(itemName);
    else packed.push(itemName);
  }

  const cfg = CC2_CLASS_CONFIG[charClass] || CC2_CLASS_CONFIG["Fighter"];

  // 1. Basic equipment (all characters)
  addItem("Backpack", "packed");
  addItem("Tinder box", "packed");
  addItem("Torches (6)", "packed");
  addItem("Waterskin", "packed");
  addItem("Rations (iron, 7 days)", "packed"); // up to 7 days = 1 slot (item-based rule)

  // 2. Armour
  const armourItems = rollCC2Armour(cfg.armour);
  for (const a of armourItems) addItem(a, "equipped");

  // 3. Weapons (roll each table entry)
  const weaponsRolled = [];
  for (const table of cfg.weapons) {
    const result = rollCC2Weapon(table);
    if (!weaponsRolled.includes(result)) {
      weaponsRolled.push(result);
      for (const item of expandCC2Item(result)) addItem(item, "equipped");
    }
  }

  // 4. Extra items
  for (const item of cfg.extra) addItem(item, "packed");

  // 5. Adventuring gear (roll 1d12 twice, no duplicates)
  const gearRolled = [];
  let attempts = 0;
  while (gearRolled.length < 2 && attempts < 20) {
    attempts++;
    const result = CC2_GEAR_TABLE[Math.floor(Math.random() * 12)];
    if (!gearRolled.includes(result)) {
      gearRolled.push(result);
      for (const item of expandCC2Item(result)) addItem(item, "packed");
    }
  }

  // Starting gold: 3d6 gp (CC2 rule)
  const startingCash = (Math.floor(Math.random()*6)+1) + (Math.floor(Math.random()*6)+1) + (Math.floor(Math.random()*6)+1);

  return {equipped, packed, unencumbering, gold_spent:0, gold_remaining:startingCash};
}

// Magic Item Lists
const CF_MAGIC_ITEMS = [
  "Amulet of Prot. Against Scrying", "Bag of Devouring", "Bag of Holding",
  "Boots of Levitation", "Boots of Speed", "Boots of Travelling and Leaping",
  "Broom of Flying", "Crystal Ball", "Displacer Cloak", "Drums of Panic",
  "Efreeti Bottle", "Elemental Summoning Device", "Elven Cloak and Boots",
  "Flying Carpet", "Gauntlets of Ogre Power", "Girdle of Giant Strength",
  "Helm of Alignment Changing", "Helm of Reading Lang. and Magic", "Helm of Telepathy",
  "Helm of Teleportation", "Horn of Blasting", "Medallion of ESP 30'",
  "Medallion of ESP 90'", "Mirror of Life Trapping", "Rope of Climbing",
  "Scarab of Protection", "Potion of Clairaudience", "Potion of Clairvoyance",
  "Potion of Control", "Potion of Delusion", "Potion of Diminution", "Potion of ESP",
  "Potion of Fire Resistance", "Potion of Flying", "Potion of Gaseous Form",
  "Potion of Giant Strength", "Potion of Growth", "Potion of Healing",
  "Potion of Heroism", "Potion of Invisibility", "Potion of Invulnerability",
  "Potion of Levitation", "Potion of Longevity", "Potion of Poison",
  "Potion of Polymorph Self", "Potion of Speed", "Potion of Treasure Finding",
  "Ring of Controlling Animals", "Ring of Controlling Humans", "Ring of Controlling Plants",
  "Ring of Delusion", "Ring of Djinni Summoning", "Ring of Fire Resistance",
  "Ring of Invisibility", "Ring of Protection", "Ring of Regeneration",
  "Ring of Spell Storing", "Ring of Spell Turning", "Ring of Telekinesis",
  "Ring of Water Walking", "Ring of Weakness", "Ring of Wishes", "Ring of X-Ray Vision",
  "Rod of Cancellation", "Staff of Commanding", "Staff of Healing", "Staff of Power",
  "Staff of Snakes", "Staff of Striking", "Staff of Withering", "Staff of Wizardry",
  "Wand of Cold", "Wand of Enemy Detection", "Wand of Fear", "Wand of Fire Balls",
  "Wand of Illusion", "Wand of Lightning Bolts", "Wand of Magic Detection",
  "Wand of Metal Detection", "Wand of Negation", "Wand of Paralysation",
  "Wand of Polymorph", "Wand of Secret Door Detection", "Wand of Trap Detection",
  "Cursed Scroll", "Protection Scroll", "Spell Scroll", "Treasure Map",
  "Sword +1, Energy Drain", "Sword +1, Flaming", "Sword +1, Light",
  "Sword +2, Charm Person", "Sword +1, Locate Objects", "Sword +1, Wishes",
  "War Hammer +3, Dwarven Thrower"
];

const AF_MAGIC_ITEMS = [
  "Alchemist's Beaker", "Amulet Prot. vs Possess.", "Amulet Prot. vs Scrying",
  "Apparatus of the Crab", "Arrow +1, Slaying", "Arrow of Location",
  "Bag of Devouring", "Bag of Holding", "Bag of Transformation",
  "Book of Foul Corruption", "Book of Infinite Spells", "Book of Subl. Holiness",
  "Boots of Dancing", "Boots of Levitation", "Boots of Speed",
  "Boots of Tr. and Leaping", "Bracers of Armour", "Bracers of Defenceless.",
  "Brooch of Shielding", "Broom of Flying", "Candle of Invocation",
  "Chime of Opening", "Chime of Ravening", "Cloak of Defence", "Cloak of Flight",
  "Cloak of Poison", "Cloak of the Manta Ray", "Crossbow +1, Distance",
  "Crossbow +1, Speed", "Crossbow +2, Accuracy", "Crystal Ball",
  "Crystal Hypnosis Ball", "Cube of Force", "Cube of Frost Resistance",
  "Cursed Scroll", "Dagger +1, Buckle", "Dagger +1, Throwing",
  "Dagger +1, Venomous", "Dagger +2, Biter", "Dec. of Endless Water",
  "Deck of Many Things", "Displacer Cloak", "Drums of Panic", "Drums of Thunder",
  "Dust of Appearance", "Dust of Disappearance", "Dust of Sn. and Choking",
  "Efreeti Bottle", "Elem. Summ. Device", "Elven Cloak and Boots",
  "Eyes of Charming", "Eyes of Minuscule Sight", "Eyes of Petrification",
  "Eyes of the Eagle", "Feather Token", "Fig. of Wondrous Power", "Flying Carpet",
  "Folding Boat", "Gauntlets of Ogre Power", "Gem of Brightness",
  "Gem of Monster Attr.", "Gem of Pristine Faceting", "Gem of Seeing",
  "Girdle of Giant Strength", "Gloves of Dexterity", "Gloves of Sw. and Cl.",
  "Helm of Align. Changing", "Helm of Reading L. & M.", "Helm of Telepathy",
  "Helm of Teleportation", "Horn of Blasting", "Horn of Cave-Ins",
  "Horn of Frothing", "Horn of the Tritons", "Horn of Valhalla",
  "Horseshoes of a Zephyr", "Horseshoes of Speed", "Immovable Rod",
  "Incense of Meditation", "Incense of Obsession", "Instant Fortress",
  "Ioun Stones", "Iron Flask", "Javelin of Lightning", "Javelin of Seeking",
  "Jug of Endless Liquids", "Libram of Arcane Power", "Loadstone", "Luckstone",
  "Lyre of Building", "Mace +1, Disrupting", "Marvellous Pigments",
  "Medallion of ESP 30'", "Medallion of ESP 90'", "Med. of Thought Proj.",
  "Mirror of Life Trapping", "Mirror of Mental Prow.", "Mirror of Opposition",
  "Necklace of Adaptation", "Necklace of Fireballs", "Necklace of Strang.",
  "Net of Snaring", "Oil of Insubstantiality", "Oil of Slipperiness",
  "Pearl of Power", "Pearl of Wisdom", "Periapt of Foul Rotting",
  "Periapt of Health", "Per. of Proof vs Poison", "Per. of Wound Closure",
  "Phylactery of Betrayal", "Phyl. of Faithfulness", "Phylactery of Longevity",
  "Pipes of the Sewers", "Portable Hole",
  "Potion of Clairaudience", "Potion of Clairvoyance", "Potion of Control",
  "Potion of Delusion", "Potion of Diminution", "Potion of ESP",
  "Potion of Fire Resistance", "Potion of Flying", "Potion of Gaseous Form",
  "Potion of Giant Strength", "Potion of Growth", "Potion of Healing",
  "Potion of Heroism", "Potion of Invisibility", "Potion of Invulnerability",
  "Potion of Levitation", "Potion of Longevity", "Potion of Poison",
  "Potion of Polymorph Self", "Potion of Speed", "Potion of Treas. Finding",
  "Protection Scroll", "Purse of Plentiful Coin", "Restorative Ointment",
  "Ring of Contr. Animals", "Ring of Contr. Humans", "Ring of Contr. Plants",
  "Ring of Delusion", "Ring of Djinni Summ.", "Ring of Fire Resistance",
  "Ring of Invisibility", "Ring of Protection", "Ring of Regeneration",
  "Ring of Spell Storing", "Ring of Spell Turning", "Ring of Telekinesis",
  "Ring of Water Walking", "Ring of Weakness", "Ring of Wishes", "Ring of X-Ray Vision",
  "Robe of Blending", "Robe of Eyes", "Robe of Powerlessness",
  "Robe of Scint. Colours", "Robe of the Archmagi", "Robe of Useful Items",
  "Rod of Absorption", "Rod of Cancellation", "Rod of Captivation",
  "Rod of Lordly Might", "Rod of Parrying", "Rod of Resurrection",
  "Rod of Striking", "Rope of Climbing", "Rope of Entanglement",
  "Rope of Strangulation", "Rug of Suffocation", "Saw of Felling",
  "Scarab of Chaos", "Scarab of Death", "Scarab of Protection", "Scarab of Rage",
  "Sh. Sword +2, Quickness", "Sling Bullet +1, Impact", "Spade of Mighty Digging",
  "Spear -1, Backbiter", "Spell Scroll",
  "Sphere of Annihilation", "Staff +1, Growing", "Staff of Commanding",
  "Staff of Dispelling", "Staff of Healing", "Staff of Power", "Staff of Snakes",
  "Staff of Striking", "Staff of Swarming Insects", "Staff of the Healer",
  "Staff of the Woodlands", "Staff of Withering", "Staff of Wizardry",
  "Sweet Water", "Sword +1, Dragon Slayer", "Sword +1, Energy Drain",
  "Sword +1, Flaming", "Sword +1, Frost Brand", "Sword +1, Giant Slayer",
  "Sword +1, Light", "Sword +1, Locate Objects", "Sword +1, Luck Blade",
  "Sword +1, Sharpness", "Sword +1, Sun Blade", "Sword +1, Wishes",
  "Sword +1, Wounding", "Sword +2, Charm Person", "Sword +2, Dancing",
  "Sword +2, 9 Lives Stealer", "Sword +2, Venger", "Sword +2, Vorpal",
  "Sword +3, Defender", "Sword +3, Holy Avenger", "Sword -1, Berserker",
  "Talisman of the Sphere", "Treasure Map", "Trident +1, Fish Comm.",
  "Trident +1, Submission", "Trident +2, Warning", "Trident -2, Yearning (Cursed)",
  "Vacuous Grimoire", "Wand of Cold", "Wand of Enemy Detect.", "Wand of Fear",
  "Wand of Fire Balls", "Wand of Illusion", "Wand of Lightning Bolts",
  "Wand of Magic Detect.", "Wand of Magic Missiles", "Wand of Metal Detection",
  "Wand of Negation", "Wand of Paralysation", "Wand of Polymorph",
  "Wand of Radiance", "Wand of S. Door Detect.", "Wand of Summoning",
  "Wand of Trap Detection", "War Ham. +3, Thrower", "War Ham. +3, Thunder.",
  "Well of Many Worlds"
];
