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
