const RACES = {
  "Drow": {
    requirements: {INT: 9},
    ability_modifiers: {CON: -1, DEX: 1},
    languages: ["Alignment", "Common", "Deepcommon", "Elvish", "Gnomish"],
    available_classes: {"Fighter": 7, "Thief": 11, "AF_Assassin": 10, "AF_Acrobat": 10, "AF_Knight": 9, "Magic-User": 9, "AF_Ranger": 9, "Cleric": 11},
    racial_abilities: ["Detect secret doors 2-in-6 (when searching)", "Immunity to ghoul paralysis", "Infravision 90'", "Light sensitivity: -2 attack, -1 AC in bright light", "Listening at doors 2-in-6", "Innate magic: darkness 1/day (at 2nd level), detect magic 1/day (at 4th level)", "Spider affinity: speak spider language, +1 reaction with spiders"]
  },
  "Duergar": {
    requirements: {CON: 9, INT: 9},
    ability_modifiers: {CHA: -1, CON: 1},
    languages: ["Alignment", "Common", "Deepcommon", "Dwarvish", "Gnomish", "Goblin", "Kobold"],
    available_classes: {"Fighter": 9, "Thief": 9, "AF_Assassin": 9, "Cleric": 8},
    racial_abilities: ["Detect construction tricks 2-in-6", "Detect room traps 2-in-6", "Infravision 90'", "Light sensitivity: -2 attack, -1 AC in bright light", "Listening at doors 2-in-6", "Resilience: CON-based bonus to saves vs paralysis/poison/spells/wands", "Stealth: 3-in-6 move silently underground", "Small/normal weapons only (no longbow or two-handed sword)"]
  },
  "Dwarf": {
    requirements: {CON: 9},
    ability_modifiers: {CHA: -1, CON: 1},
    languages: ["Alignment", "Common", "Dwarvish", "Gnomish", "Goblin", "Kobold"],
    available_classes: {"Fighter": 10, "Thief": 9, "AF_Assassin": 9, "Cleric": 8},
    racial_abilities: ["Detect construction tricks 2-in-6", "Detect room traps 2-in-6", "Infravision 60'", "Listening at doors 2-in-6", "Resilience: CON-based bonus to saves vs poison/spells/wands", "Small/normal weapons only (no longbow or two-handed sword)"]
  },
  "Elf": {
    requirements: {INT: 9},
    ability_modifiers: {CON: -1, DEX: 1},
    languages: ["Alignment", "Common", "Elvish", "Gnoll", "Hobgoblin", "Orcish"],
    available_classes: {"Fighter": 7, "Thief": 10, "AF_Assassin": 10, "AF_Acrobat": 10, "AF_Knight": 11, "Magic-User": 11, "AF_Ranger": 11, "Cleric": 7, "AF_Druid": 8},
    racial_abilities: ["Detect secret doors 2-in-6 (when searching)", "Immunity to ghoul paralysis", "Infravision 60'", "Listening at doors 2-in-6"]
  },
  "Gnome": {
    requirements: {CON: 9, INT: 9},
    ability_modifiers: {},
    languages: ["Alignment", "Common", "Dwarvish", "Gnomish", "Kobold"],
    available_classes: {"Fighter": 6, "Thief": 8, "AF_Assassin": 6, "Cleric": 7, "AF_Illusionist": 7},
    racial_abilities: ["Defensive bonus: +2 AC vs large opponents", "Detect construction tricks 2-in-6", "Infravision 90'", "Listening at doors 2-in-6", "Magic resistance: CON-based bonus to saves vs spells/wands", "Speak with burrowing mammals", "Small weapons only (no longbow or two-handed sword)"]
  },
  "Half-Elf": {
    requirements: {CHA: 9, CON: 9},
    ability_modifiers: {},
    languages: ["Alignment", "Common", "Elvish"],
    available_classes: {"Fighter": 8, "Thief": 12, "AF_Assassin": 11, "AF_Acrobat": 12, "AF_Bard": 12, "AF_Knight": 12, "Magic-User": 8, "AF_Ranger": 8, "AF_Paladin": 12, "AF_Druid": 12, "Cleric": 5},
    racial_abilities: ["Detect secret doors 2-in-6 (when searching)", "Infravision 60'"]
  },
  "Half-Orc": {
    requirements: {},
    ability_modifiers: {CHA: -2, CON: 1, STR: 1},
    languages: ["Alignment", "Common", "Orcish"],
    available_classes: {"Fighter": 10, "Thief": 8, "AF_Assassin": 8, "AF_Acrobat": 8, "Cleric": 4},
    racial_abilities: ["Infravision 60'"]
  },
  "Halfling": {
    requirements: {CON: 9, DEX: 9},
    ability_modifiers: {DEX: 1, STR: -1},
    languages: ["Alignment", "Common", "Halfling"],
    available_classes: {"Fighter": 6, "Thief": 8, "AF_Druid": 6},
    racial_abilities: ["Defensive bonus: +2 AC vs large opponents", "Initiative bonus: +1 to initiative", "Listening at doors 2-in-6", "Missile attack bonus: +1 to attack rolls with missile weapons", "Resilience: CON-based bonus to saves vs poison/spells/wands", "Small weapons only (no longbow or two-handed sword)"]
  },
  "Svirfneblin": {
    requirements: {CON: 9},
    ability_modifiers: {},
    languages: ["Alignment", "Common", "Deepcommon", "Gnomish", "Dwarvish", "Kobold", "Elemental Earth"],
    available_classes: {"Fighter": 6, "Thief": 8, "AF_Assassin": 8, "Cleric": 7, "AF_Illusionist": 7},
    racial_abilities: [
      "Infravision 90'",
      "Blend into stone: 4-in-6 (dim) or 2-in-6 (bright) chance to go unnoticed when motionless in stone",
      "Detect construction tricks 2-in-6",
      "Stone murmurs: 2-in-6 chance to divine secret doors, gems, creatures, or spaces through stone",
      "Illusion resistance: +2 to saves vs illusions",
      "Defensive bonus: +2 AC vs large opponents",
      "Light sensitivity: -2 to attack rolls, -1 AC in bright light",
      "Speak with earth elementals",
      "Can use magic items for summoning or controlling earth elementals",
      "Small weapons only (no longbow or two-handed sword)"
    ]
  },
  "Human": {
    requirements: {},
    ability_modifiers: {},
    languages: ["Alignment", "Common"],
    available_classes: {"Fighter": 999, "Cleric": 999, "Magic-User": 999, "Thief": 999, "AF_Acrobat": 999, "AF_Assassin": 999, "AF_Barbarian": 999, "AF_Bard": 999, "AF_Druid": 999, "AF_Illusionist": 999, "AF_Knight": 999, "AF_Paladin": 999, "AF_Ranger": 999},
    racial_abilities: []
  }
};