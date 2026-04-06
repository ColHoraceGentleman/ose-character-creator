// OSE Character Creator — Spell data

// ── Classic MU / Elf ────────────────────────────────────────────────────────

const MU_ELF_SPELLS_L1 = [
  "Charm Person",
  "Detect Magic",
  "Floating Disc",
  "Hold Portal",
  "Light",
  "Magic Missile",
  "Protection from Evil",
  "Read Languages",
  "Read Magic",
  "Shield",
  "Sleep",
  "Ventriloquism",
];

const SPELL_PAGE_NUMBERS = {
  // Classic Fantasy (OSE Players Rules Tome)
  "Charm Person":          65,
  "Detect Magic":          64,
  "Floating Disc":         65,
  "Hold Portal":           65,
  "Light":                 50,
  "Magic Missile":         65,
  "Protection from Evil":  64,
  "Read Languages":        36,
  "Read Magic":            65,
  "Shield":                46,
  "Sleep":                 65,
  "Ventriloquism":         65,
  // Cleric spells (CPRT)
  "Cure Light Wounds":     46,
  "Detect Evil":           44,
  "Light":                 50,
  "Protection from Evil":  64,
  "Purify Food and Water": 44,
  "Remove Fear":           44,
  "Bless":                 45,
  "Find Traps":            45,
  "Hold Person":           45,
  "Know Alignment":        45,
  "Resist Cold":           45,
  "Snake Charm":           45,
  "Speak with Animals":    45,
  "Continual Light":       50,
  "Cure Disease":          46,
  "Growth of Animal":      46,
  "Locate Object":         46,
  "Remove Curse":          46,
  // Druid spells (Druid & Illusionist Spells supplement)
  "Animal Friendship":    3,
  "Detect Danger":         3,
  "Entangle":               3,
  "Faerie Fire":            3,
  "Invisibility to Animals": 3,
  "Locate Plant or Animal": 3,
  "Predict Weather":       3,
  "Speak with Animals":    3,
  "Barkskin":               4,
  "Create Water":          4,
  "Cure Light Wounds":     4,
  "Heat Metal":            4,
  "Obscuring Mist":        4,
  "Produce Flame":         4,
  "Slow Poison":           4,
  "Warp Wood":              4,
  "Call Lightning":        5,
  "Growth of Nature":      5,
  "Hold Animal":           5,
  "Protection from Poison": 5,
  "Tree Shape":            5,
  "Water Breathing":       5,
  "Cure Serious Wounds":   6,
  "Dispel Magic":           6,
  "Protection from Fire and Lightning": 6,
  "Speak with Plants":     6,
  "Summon Animals":        6,
  "Temperature Control":   6,
  "Commune with Nature":   8,
  "Control Weather":       8,
  "Pass Plant":            8,
  "Protection from Plants and Animals": 8,
  "Transmute Rock to Mud": 8,
  "Wall of Thorns":        8,
  // Illusionist spells (Druid & Illusionist Spells supplement)
  "Auditory Illusion":     16,
  "Chromatic Orb":         16,
  "Colour Spray":          16,
  "Dancing Lights":        16,
  "Detect Illusion":       16,
  "Glamour":               16,
  "Hypnotism":             16,
  "Light":                 16,
  "Phantasmal Force":      16,
  "Read Magic":            16,
  "Spook":                 16,
  "Wall of Fog":           16,
  "Blindness / Deafness":  22,
  "Blur":                  22,
  "Detect Magic":          22,
  "False Aura":            22,
  "Fascinate":             22,
  "Hypnotic Pattern":      22,
  "Improved Phantasmal Force": 22,
  "Invisibility":          22,
  "Magic Mouth":           22,
  "Mirror Image":          22,
  "Quasimorph":            22,
  "Whispering Wind":        22,
  "Blacklight":            25,
  "Dispel Illusion":       25,
  "Fear":                  25,
  "Hallucinatory Terrain": 25,
  "Invisibility 10' Radius": 25,
  "Nondetection":          25,
  "Paralysation":          25,
  "Phantom Steed":         25,
  "Rope Trick":            25,
  "Spectral Force":        25,
  "Suggestion":            25,
  "Wraithform":            25,
  "Confusion":             29,
  "Dispel Magic":          29,
  "Emotion":               29,
  "Illusory Stamina":      29,
  "Improved Invisibility": 29,
  "Massmorph":             29,
  "Minor Creation":        29,
  "Phantasmal Killer":     29,
  "Rainbow Pattern":       29,
  "Shadow Monsters":      29,
  "Solid Fog":             29,
  "Veil of Abandonment":  29,
  "Chaos":                 33,
  "Demi-Shadow Monsters": 33,
  "Illusion":              33,
  "Looking Glass":         33,
  "Major Creation":        33,
  "Maze of Mirrors":       33,
  "Projected Image":       33,
  "Seeming":               33,
  "Shadowcast":            33,
  "Shadowy Transformation": 33,
  "Time Flow":             33,
  "Visitation":            33,
  "Acid Fog":              38,
  "Dream Quest":           38,
  "Impersonation":         38,
  "Manifest Dream":        38,
  "Mass Suggestion":       38,
  "Mislead":               38,
  "Permanent Illusion":    38,
  "Shades":                38,
  "Through the Looking Glass": 38,
  "Triggered Illusion":   38,
  "True Seeing":           38,
  "Vision":                38,
};

// ── Advanced Fantasy: Druid spells ──────────────────────────────────────────
const DRUID_SPELLS_L1 = [
  "Animal Friendship","Detect Danger","Entangle","Faerie Fire",
  "Invisibility to Animals","Locate Plant or Animal","Predict Weather","Speak with Animals",
];
const DRUID_SPELLS_L2 = [
  "Barkskin","Create Water","Cure Light Wounds","Heat Metal",
  "Obscuring Mist","Produce Flame","Slow Poison","Warp Wood",
];
const DRUID_SPELLS_L3 = [
  "Call Lightning","Growth of Nature","Hold Animal",
  "Protection from Poison","Tree Shape","Water Breathing",
];
const DRUID_SPELLS_L4 = [
  "Cure Serious Wounds","Dispel Magic","Protection from Fire and Lightning",
  "Speak with Plants","Summon Animals","Temperature Control",
];
const DRUID_SPELLS_L5 = [
  "Commune with Nature","Control Weather","Pass Plant",
  "Protection from Plants and Animals","Transmute Rock to Mud","Wall of Thorns",
];

// ── Advanced Fantasy: Illusionist spells ────────────────────────────────────
const ILLUSIONIST_SPELLS_L1 = [
  "Auditory Illusion","Chromatic Orb","Colour Spray","Dancing Lights",
  "Detect Illusion","Glamour","Hypnotism","Light","Phantasmal Force",
  "Read Magic","Spook","Wall of Fog",
];
const ILLUSIONIST_SPELLS_L2 = [
  "Blindness / Deafness","Blur","Detect Magic","False Aura","Fascinate",
  "Hypnotic Pattern","Improved Phantasmal Force","Invisibility","Magic Mouth",
  "Mirror Image","Quasimorph","Whispering Wind",
];
const ILLUSIONIST_SPELLS_L3 = [
  "Blacklight","Dispel Illusion","Fear","Hallucinatory Terrain",
  "Invisibility 10' Radius","Nondetection","Paralysation","Phantom Steed",
  "Rope Trick","Spectral Force","Suggestion","Wraithform",
];
const ILLUSIONIST_SPELLS_L4 = [
  "Confusion","Dispel Magic","Emotion","Illusory Stamina","Improved Invisibility",
  "Massmorph","Minor Creation","Phantasmal Killer","Rainbow Pattern",
  "Shadow Monsters","Solid Fog","Veil of Abandonment",
];
const ILLUSIONIST_SPELLS_L5 = [
  "Chaos","Demi-Shadow Monsters","Illusion","Looking Glass","Major Creation",
  "Maze of Mirrors","Projected Image","Seeming","Shadowcast",
  "Shadowy Transformation","Time Flow","Visitation",
];
const ILLUSIONIST_SPELLS_L6 = [
  "Acid Fog","Dream Quest","Impersonation","Manifest Dream","Mass Suggestion",
  "Mislead","Permanent Illusion","Shades","Through the Looking Glass",
  "Triggered Illusion","True Seeing","Vision",
];

// ── Spell slot tables (AF classes) ──────────────────────────────────────────
// Indexed by level (1-based). Each entry is an array of slot counts per spell level.
const AF_SPELL_SLOTS = {
  // Bard: druid spell list, up to 4th level spells
  "AF_Bard": [
    null,           // placeholder (levels are 1-based)
    [],             // 1: no spells
    [1],            // 2
    [2],            // 3
    [3],            // 4
    [3,1],          // 5
    [3,2],          // 6
    [3,3],          // 7
    [3,3,1],        // 8
    [3,3,2],        // 9
    [3,3,3],        // 10
    [3,3,3,1],      // 11
    [3,3,3,2],      // 12
    [3,3,3,3],      // 13
    [4,4,3,3],      // 14
  ],
  // Druid: up to 5th level spells
  "AF_Druid": [
    null,
    [1],            // 1
    [2],            // 2
    [2,1],          // 3
    [2,2],          // 4
    [2,2,1,1],      // 5
    [2,2,2,1,1],    // 6
    [3,3,2,2,1],    // 7
    [3,3,3,2,2],    // 8
    [4,4,3,3,2],    // 9
    [4,4,4,3,3],    // 10
    [5,5,4,4,3],    // 11
    [5,5,5,4,4],    // 12
    [6,5,5,5,4],    // 13
    [6,6,5,5,5],    // 14
  ],
  // Illusionist: up to 6th level spells
  "AF_Illusionist": [
    null,
    [1],            // 1
    [2],            // 2
    [2,1],          // 3
    [2,2],          // 4
    [2,2,1],        // 5
    [2,2,2],        // 6
    [3,2,2,1],      // 7
    [3,3,2,2],      // 8
    [3,3,3,2,1],    // 9
    [3,3,3,3,2],    // 10
    [4,3,3,3,2,1],  // 11
    [4,4,3,3,3,2],  // 12
    [4,4,4,3,3,3],  // 13
    [4,4,4,4,3,3],  // 14
  ],
  // Paladin: cleric spell list, up to 3rd level, starts at 9th level
  "AF_Paladin": [
    null,
    [],[], [], [], [], [], [], [],  // 1-8: no spells
    [1],            // 9
    [2],            // 10
    [2,1],          // 11
    [2,2],          // 12
    [2,2,1],        // 13
    [3,2,1],        // 14
  ],
  // Drow: cleric spell list, up to 5th level (light/darkness only at L1)
  "AF_Drow": [
    null,
    [1],            // 1 — only light (darkness) available
    [2],            // 2
    [2,1],          // 3
    [2,2],          // 4
    [2,2,1],        // 5
    [2,2,2,1],      // 6
    [3,3,2,2,1],    // 7
    [3,3,3,2,2],    // 8
    [4,4,3,3,2],    // 9
    [4,4,4,3,3],    // 10
  ],
  // Gnome: illusionist spell list, up to 4th level
  "AF_Gnome": [
    null,
    [1],            // 1
    [2],            // 2
    [2,1],          // 3
    [2,2],          // 4
    [2,2,1],        // 5
    [2,2,2],        // 6
    [3,2,2,1],      // 7
    [3,3,2,2],      // 8
  ],
  // Half-Elf: MU spell list, up to 4th level, starts at 2nd level
  "AF_HalfElf": [
    null,
    [],             // 1: no spells
    [1],            // 2
    [2],            // 3
    [2],            // 4
    [2,1],          // 5
    [2,2],          // 6
    [2,2],          // 7
    [2,2,1],        // 8
    [3,2,1],        // 9
    [3,2,2],        // 10
    [3,2,2,1],      // 11
    [3,3,2,1],      // 12
  ],
  // Ranger: druid spell list, up to 3rd level, starts at 8th level
  "AF_Ranger": [
    null,
    [],[], [], [], [], [], [],       // 1-7: no spells
    [1],            // 8
    [2],            // 9
    [2,1],          // 10
    [2,2],          // 11
    [2,2,1],        // 12
    [3,2,1],        // 13
    [3,2,2],        // 14
  ],
};
