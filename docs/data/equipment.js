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
  "Cleric":     {allowed_qualities:["Blunt"], excluded:["Long bow","Two-handed sword","Battle axe","Polearm"]},
  "Dwarf":      {allowed_qualities:["any"], excluded:["Long bow","Two-handed sword","Polearm"]},
  "Elf":        {allowed_qualities:["any"], excluded:[]},
  "Fighter":    {allowed_qualities:["any"], excluded:[]},
  "Halfling":   {allowed_qualities:["any"], excluded:["Long bow","Two-handed sword","Polearm","Lance"]},
  "Magic-User": {allowed_qualities:["any"], only:["Dagger"]},
  "Thief":      {allowed_qualities:["any"], excluded:[]},
};

const CLASS_ARMOUR_RULES = {
  "Cleric":     {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Dwarf":      {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Elf":        {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Fighter":    {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Halfling":   {can_wear:["Leather","Chainmail","Plate mail"], can_use_shield:true},
  "Magic-User": {can_wear:[], can_use_shield:false},
  "Thief":      {can_wear:["Leather"], can_use_shield:false},
};

const CLASS_ESSENTIALS = {
  "Cleric":["Holy symbol"], "Dwarf":[], "Elf":[], "Fighter":[], "Halfling":[], "Magic-User":[], "Thief":["Thieves' tools"],
};

const STANDARD_KIT_ITEMS = [
  "Backpack","Torches (6)","Tinder box","Rations (standard, 7 days)",
  "Waterskin","Rope (50')","Oil (1 flask)","Iron spikes (12)","Sack (large)",
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

function autoKit(charClass, gold) {
  const equipped = [];
  const packed = [];
  const unencumbering = [];
  let spent = 0;
  let remaining = gold;

  function buy(itemName, cost, location) {
    spent += cost;
    remaining = gold - spent;
    const enc = itemEncumbrance(itemName, true);
    if (enc === 0) unencumbering.push(itemName);
    else if (location === "equipped") equipped.push(itemName);
    else packed.push(itemName);
    return remaining;
  }

  // Essentials
  for (const item of (CLASS_ESSENTIALS[charClass] || [])) {
    const cost = ADVENTURING_GEAR[item]?.cost || 0;
    if (remaining >= cost) buy(item, cost, "packed");
  }

  // Armour
  const [armourName, armourCost] = bestAffordableArmour(charClass, remaining);
  if (armourName) {
    remaining = buy(armourName, armourCost, "equipped");
    if (CLASS_ARMOUR_RULES[charClass].can_use_shield && remaining >= 10) {
      remaining = buy("Shield",10,"equipped");
    }
  }

  // Weapon
  const [weaponName, weaponCost] = bestAffordableWeapon(charClass, remaining);
  if (weaponName) remaining = buy(weaponName, weaponCost, "equipped");

  // Standard kit
  for (const item of STANDARD_KIT_ITEMS) {
    const cost = ADVENTURING_GEAR[item]?.cost || 0;
    if (remaining >= cost && !packed.includes(item) && !equipped.includes(item) && !unencumbering.includes(item)) {
      remaining = buy(item,cost,"packed");
    }
  }

  return {equipped, packed, unencumbering, gold_spent:spent, gold_remaining:remaining};
}
