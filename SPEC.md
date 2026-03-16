# OSE Character Creator — SPEC.md
## Phase 1: Character Sheet Generator

**Version:** 0.3 (Phase 1.5 — DAC + Standard Encumbrance)  
**Last updated:** 2026-03-16  
**Status:** Phase 1.5 complete ✅

---

## ⚠️ Critical Design Decisions

### Armour Class — User-Selectable (AAC or DAC)

Both AC systems are now supported via the **Armour Class** dropdown in the UI.

**AAC (Ascending)** — optional system from OSE Classic p. 32:
- Higher = better. Unarmoured = 10, Plate mail = 16, Shield = +1
- DEX modifier adds to AC
- Fills the **Attack Bonus** field on the character sheet

**DAC (Descending)** — traditional OSE system:
- Lower = better. Unarmoured = 9, Plate mail = 3, Shield = -1
- DEX modifier subtracts from AC
- Fills the **THAC0–THAC9 attack matrix** on the character sheet
- THAC0 = 19 at 1st level; roll to hit AC n = THAC0 - n - STR mod

### Encumbrance — User-Selectable (Item-Based or Standard)

Both encumbrance systems are supported via the **Encumbrance** dropdown.

**Item-Based** (OSE Carrion Crawler #2):
- Movement based on number of items carried (1-handed = 1 item, 2-handed = 2 items)
- STR melee modifier shifts packed item thresholds upward
- Tiny items (garlic, holy symbols) are non-encumbering
- Containers only count when not in use

| Equipped | Packed | Movement |
|----------|--------|----------|
| 0–3 | 0–10 | 120' / 40' |
| 4–5 | 11–12 | 90' / 30' |
| 6–7 | 13–14 | 60' / 20' |
| 8–9 | 15–16 | 30' / 10' |
| 10+ | 17+ | Cannot move |

**Standard** (OSE Classic):
- Movement based on total weight in coins (cn)
- Fills TR/EQ/Total encumbrance fields on the sheet

| Total cn | Movement |
|----------|----------|
| 0–400    | 120' / 40' |
| 401–800  | 90' / 30' |
| 801–1200 | 60' / 20' |
| 1201–1600| 30' / 10' |

### PDF Sheet Selection

Four dedicated sheets, one per combo:

| AC Mode | Encumbrance | Sheet |
|---------|-------------|-------|
| AAC | Item-based | `assets/sheet-aac-item.pdf` |
| AAC | Standard   | `assets/sheet-aac-standard.pdf` |
| DAC | Item-based | `assets/sheet-dac-item.pdf` |
| DAC | Standard   | `assets/sheet-dac-standard.pdf` |

### Race/Class Fields

- **AAC sheet** (no Race field): Combined into Class — "Human Fighter", "Human Cleric", "Dwarf", etc.
- **DAC sheets** (separate Race + Class fields):
  - Demi-humans: Race = class name, Class = blank
  - Humans: Race = "Human", Class = class name

---

## Overview

A web-based tool that generates completed Old School Essentials (Classic) player characters and outputs a filled-in PDF character sheet. Rules are sourced directly from the *OSE Classic Players Rules Tome v1.0*.

Eventually this will live at **www.muckdart.com**.

---

## Phase 1 Scope

Phase 1 focuses purely on generating a valid, complete character and exporting it as a PDF. No web hosting, no backend — a standalone local app that runs in the browser or via Node.js.

**In scope:**
- Dice rolling (virtual)
- Full character generation per OSE Classic rules
- PDF output matching the official character sheet layout
- Basic UI for generation options

**Out of scope (future phases):**
- Web deployment / muckdart.com integration (Phase 3)

**Phase 2 backlog:**
- Advanced Fantasy rules
- Other rules for starting equipment
- Allow creation of characters above level 1
- Multiple characters / party sheet
- Carrion Crawler options

---

## Character Creation Rules (from OSE Classic v1.0)

### Step 1 — Roll Ability Scores

Roll for all 6 abilities: STR, INT, WIS, DEX, CON, CHA.

**Supported dice methods (user selects):**
- **3d6 in order** (default): Roll 3d6 for each stat in the fixed order STR → INT → WIS → DEX → CON → CHA
- **3d6 arrange**: Roll 3d6 six times, player assigns results to stats freely
- **4d6 drop lowest**: Roll 4d6, drop the lowest die, assign freely

**Sub-par characters:** If all scores are 8 or less, optionally allow reroll (user toggle).

### Step 2 — Choose Class

Seven classes available. Each has minimum stat requirements.

| Class | Requirements | Prime Requisite | HD | Max Level | Armour | Weapons |
|-------|-------------|-----------------|-----|-----------|--------|---------|
| Cleric | None | WIS | 1d6 | 14 | Any + shields | Blunt only |
| Dwarf | CON 9 | STR | 1d8 | 12 | Any + shields | Small/normal (no longbow, 2H sword) |
| Elf | INT 9 | INT + STR | 1d6 | 10 | Any + shields | Any |
| Fighter | None | STR | 1d8 | 14 | Any + shields | Any |
| Halfling | CON 9, DEX 9 | DEX + STR | 1d6 | 8 | Any (size-appropriate) + shields | Any (size-appropriate, no longbow, 2H sword) |
| Magic-User | None | INT | 1d4 | 14 | None | Dagger only |
| Thief | None | DEX | 1d4 | 14 | Leather only, no shields | Any |

**Class selection modes (user selects):**
- **Random**: System picks a random valid class based on rolled stats
- **Choose first**: User picks class before rolling (stats may be re-arranged if using 3d6 arrange)
- **Choose after rolling**: Roll stats, then pick any valid class

### Step 3 — Adjust Ability Scores (Prime Requisite Swap)

Optional. For every 2 points reduced from a non-prime requisite ability, 1 point may be added to a prime requisite.

**Rules:**
- Only STR, INT, WIS may be lowered
- No score may go below 9
- Thieves may NOT lower STR
- Elves: Prime requisites are both INT and STR

### Step 4 — Ability Score Modifiers

All modifiers applied automatically based on final scores.

**Strength**
| STR | Melee | Open Doors |
|-----|-------|------------|
| 3 | –3 | 1-in-6 |
| 4–5 | –2 | 1-in-6 |
| 6–8 | –1 | 1-in-6 |
| 9–12 | None | 2-in-6 |
| 13–15 | +1 | 3-in-6 |
| 16–17 | +2 | 4-in-6 |
| 18 | +3 | 5-in-6 |

**Intelligence**
| INT | Spoken Languages | Literacy |
|-----|-----------------|---------|
| 3 | Native (broken) | Illiterate |
| 4–5 | Native | Illiterate |
| 6–8 | Native | Basic |
| 9–12 | Native | Literate |
| 13–15 | Native + 1 | Literate |
| 16–17 | Native + 2 | Literate |
| 18 | Native + 3 | Literate |

**Wisdom**
| WIS | Magic Saves |
|-----|------------|
| 3 | –3 |
| 4–5 | –2 |
| 6–8 | –1 |
| 9–12 | None |
| 13–15 | +1 |
| 16–17 | +2 |
| 18 | +3 |

**Dexterity**
| DEX | AC Modifier | Missile | Initiative |
|-----|------------|---------|-----------|
| 3 | –3 | –3 | –2 |
| 4–5 | –2 | –2 | –1 |
| 6–8 | –1 | –1 | –1 |
| 9–12 | None | None | None |
| 13–15 | +1 | +1 | +1 |
| 16–17 | +2 | +2 | +1 |
| 18 | +3 | +3 | +2 |

**Constitution**
| CON | Hit Points |
|-----|-----------|
| 3 | –3 |
| 4–5 | –2 |
| 6–8 | –1 |
| 9–12 | None |
| 13–15 | +1 |
| 16–17 | +2 |
| 18 | +3 |

**Charisma**
| CHA | NPC Reactions | Max Retainers | Loyalty |
|-----|--------------|---------------|---------|
| 3 | –2 | 1 | 4 |
| 4–5 | –1 | 2 | 5 |
| 6–8 | –1 | 3 | 6 |
| 9–12 | None | 4 | 7 |
| 13–15 | +1 | 5 | 8 |
| 16–17 | +1 | 6 | 9 |
| 18 | +2 | 7 | 10 |

**Prime Requisite XP Modifier**
| Score | XP Modifier |
|-------|------------|
| 3–5 | –20% |
| 6–8 | –10% |
| 9–12 | None |
| 13–15 | +5% |
| 16–18 | +10% |

*Note: Elf has dual prime requisites — see Elf class for specifics.*
*Note: Halfling has dual prime requisites — +5% if one is 13+; +10% if both DEX and STR are 16+.*

### Step 5 — Attack Values (THAC0)

All 1st level characters start with THAC0 19 [0].

1st Level Attack Values:
| Attack Roll | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
|-------------|----|----|----|----|----|----|----|----|----|----|
| AC Hit | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

### Step 6 — Saving Throws & Class Abilities

Saving throw values at 1st level by class:

| Class | Death (D) | Wands (W) | Paralysis (P) | Breath (B) | Spells (S) |
|-------|-----------|-----------|--------------|-----------|-----------|
| Cleric | 11 | 12 | 14 | 16 | 15 |
| Dwarf | 8 | 9 | 10 | 13 | 12 |
| Elf | 12 | 13 | 13 | 15 | 15 |
| Fighter | 12 | 13 | 14 | 15 | 16 |
| Halfling | 8 | 9 | 10 | 13 | 12 |
| Magic-User | 13 | 14 | 13 | 16 | 15 |
| Thief | 13 | 14 | 13 | 16 | 15 |

**Special abilities by class at 1st level:**
- **Cleric**: Turn undead, divine spells from 2nd level
- **Dwarf**: Detect construction tricks 2-in-6, detect room traps 2-in-6, infravision 60', listen at doors 2-in-6
- **Elf**: Detect secret doors 2-in-6, immunity to ghoul paralysis, infravision 60', listen at doors 2-in-6; 1 spell in spellbook
- **Fighter**: No special abilities at 1st level
- **Halfling**: Hide in woods 90%, hide in dungeon 2-in-6, missile attack +1, defensive bonus +2 AC vs large opponents, listen at doors 2-in-6
- **Magic-User**: 1 spell in spellbook
- **Thief**: All thief skills at 1st level percentages (see table); cannot wear armour heavier than leather

**Thief Skills at 1st level:**
| Skill | Chance |
|-------|--------|
| Climb Sheer Surfaces | 87% |
| Find/Remove Traps | 10% |
| Hear Noise | 1–2 on d6 |
| Hide in Shadows | 10% |
| Move Silently | 20% |
| Open Locks | 15% |
| Pick Pockets | 20% |

### Step 7 — Roll Hit Points

Roll the class's HD die + CON modifier. Minimum 1 HP regardless of modifier.

**Optional:** Re-roll 1s and 2s (user toggle).

### Step 8 — Alignment

User selects: **Lawful**, **Neutral**, or **Chaotic** (or random).

### Step 9 — Languages

Every character knows: Common + their alignment language.

Characters with high INT gain additional languages:
- INT 13–15: +1 language
- INT 16–17: +2 languages
- INT 18: +3 languages

Additional languages (chosen randomly or by user from list):
Bugbear, Doppelgänger, Dragon, Dwarvish, Elvish, Gargoyle, Gnoll, Gnomish, Goblin, Halfling, Harpy, Hobgoblin, Kobold, Lizard man, Medusa, Minotaur, Ogre, Orcish, Pixie, Human dialect

Class native languages:
- Dwarf: Alignment, Common, Dwarvish, Gnomish, Goblin, Kobold
- Elf: Alignment, Common, Elvish, Gnoll, Hobgoblin, Orcish
- Halfling: Alignment, Common, Halfling
- Cleric/Fighter/Magic-User/Thief: Alignment, Common

### Step 10 — Starting Gold & Equipment

**Starting gold:** Roll 3d6 × 10 gp.

**Equipment selection modes:**
- **Manual**: Present a shopping list UI, user spends gold
- **Auto (basic pack)**: System automatically assigns a sensible starting kit appropriate for the class (within gold budget)

**Adventuring Gear Prices:**
| Item | Cost (gp) |
|------|----------|
| Backpack | 5 |
| Crowbar | 10 |
| Garlic | 5 |
| Grappling hook | 25 |
| Hammer (small) | 2 |
| Holy symbol | 25 |
| Holy water (vial) | 25 |
| Iron spikes (12) | 1 |
| Lantern | 10 |
| Mirror (hand-sized, steel) | 5 |
| Oil (1 flask) | 2 |
| Pole (10' long, wooden) | 1 |
| Rations (iron, 7 days) | 15 |
| Rations (standard, 7 days) | 5 |
| Rope (50') | 1 |
| Sack (small) | 1 |
| Sack (large) | 2 |
| Stakes (3) and mallet | 3 |
| Thieves' tools | 25 |
| Tinder box | 3 |
| Torches (6) | 1 |
| Waterskin | 1 |
| Wine (2 pints) | 1 |
| Wolfsbane (1 bunch) | 10 |

**Weapons:**
| Weapon | Cost (gp) | Damage |
|--------|----------|--------|
| Battle axe | 7 | 1d8 |
| Club | 3 | 1d4 |
| Crossbow | 30 | 1d6 |
| Dagger | 3 | 1d4 |
| Hand axe | 4 | 1d6 |
| Javelin | 1 | 1d4 |
| Lance | 5 | 1d6 |
| Long bow | 40 | 1d6 |
| Mace | 5 | 1d6 |
| Polearm | 7 | 1d10 |
| Short bow | 25 | 1d6 |
| Short sword | 7 | 1d6 |
| Silver dagger | 30 | 1d4 |
| Sling | 2 | 1d4 |
| Spear | 4 | 1d6 |
| Staff | 2 | 1d4 |
| Sword | 10 | 1d8 |
| Two-handed sword | 15 | 1d10 |
| Warhammer | 5 | 1d6 |

**Armour:**

> ⚠️ **This project uses the optional Ascending Armour Class (AAC) system** from OSE Classic (p. 32). Higher AAC = better protection. Descending AC values are kept in the data for reference only and are not used in generation or output.

| Armour | AAC (used) | AC (descending, unused) | Cost (gp) |
|--------|-----------|------------------------|----------|
| Unarmoured | 10 | 9 | — |
| Leather | 12 | 7 | 20 |
| Chainmail | 14 | 5 | 40 |
| Plate mail | 16 | 3 | 60 |
| Shield | +1 bonus | — | 10 |

### Step 11 — Armour Class (AAC)

> ⚠️ **Optional rule in use:** Ascending Armour Class (AAC). See OSE Classic p. 32.

Final AAC = armour base AAC + DEX modifier + shield bonus (+1).

- Unarmoured base AAC = 10
- Higher AAC is better (AC 16 is plate mail; AC 10 is naked)
- DEX modifier applies directly: positive DEX mod raises AAC, negative lowers it
- Halflings add a further +2 AAC vs. large opponents

### Step 12 — Starting Level & XP

All characters begin at **1st level** with **0 XP**.

### Step 13 — Name

User inputs name, or system generates a random name appropriate to race/class.

---

## UI Options (Phase 1)

The generation UI presents the following choices before generating:

| Option | Choices |
|--------|---------|
| Dice method | 3d6 in order / 3d6 arrange / 4d6 drop lowest |
| Class selection | Random valid / Choose first / Choose after rolling |
| Alignment | Random / Lawful / Neutral / Chaotic |
| HP reroll | Allow reroll of 1s and 2s (toggle) |
| Sub-par character reroll | Allow full reroll if all stats ≤ 8 (toggle) |
| Equipment | Auto basic kit / Manual shopping |
| Give Read Magic | If checked: spellcasters (MU/Elf) always receive Read Magic; random spell excludes it (toggle) |
| Character name | Auto-generate / Enter manually |

---

## PDF Output

The output is a filled-in PDF character sheet matching the official OSE layout.

### Fields to populate:
- Character name
- Class & level (always 1st)
- Race (Human unless demihuman class)
- Alignment
- All 6 ability scores + modifiers
- Hit points (max and current, both set to rolled value)
- Armour Class
- THAC0
- Saving throws (all 5)
- Movement rate (default 120'/40')
- Languages known
- Special abilities (class-specific)
- Equipment list
- Starting gold (total and remaining after purchases)
- Spells (for Elf and Magic-User: 1 spell at 1st level — blank/TBD or random from spell list)

### Character sheet source:
`assets/character-sheet.pdf` — 2-page PDF with 71 fillable form fields.

### PDF Field Mapping:

| Field Name | Populated With |
|------------|---------------|
| `Name 2` | Leave blank |
| `Character Class 2` | Class name |
| `Title 2` | Level title (e.g. "Veteran" for 1st level Fighter) |
| `Level 2` | 1 |
| `Alignment 2` | Lawful / Neutral / Chaotic |
| `STR 2` | STR score |
| `INT 2` | INT score |
| `WIS 2` | WIS score |
| `DEX 2` | DEX score |
| `CON 2` | CON score |
| `CHA 2` | CHA score |
| `STR Melee Mod` | STR melee modifier |
| `DEX Missile Mod` | DEX missile modifier |
| `DEX AC Mod 2` | DEX AC modifier |
| `Initiative DEX Mod 2` | DEX initiative modifier |
| `Reactions CHA Mod 2` | CHA NPC reactions modifier |
| `Magic Save Mod 2` | WIS magic save modifier |
| `CON HP Mod 2` | CON HP modifier |
| `HP 2` | Rolled HP (current) |
| `Max HP 2` | Rolled HP (max) |
| `AC 2` | Final AAC (ascending; e.g. 16 for Plate mail) |
| `Unarmoured AC 2` | Unarmoured AAC (10 + DEX mod) |
| `Attack Bonus` | THAC0 attack bonus (e.g. [0] at 1st level) |
| `Death Save 2` | Saving throw vs Death/Poison |
| `Wands Save 2` | Saving throw vs Wands |
| `Paralysis Save 2` | Saving throw vs Paralysis/Petrify |
| `Breath Save 2` | Saving throw vs Breath Attacks |
| `Spells Save 2` | Saving throw vs Spells |
| `Encounter Movement 2` | Calculated from item encumbrance (e.g. 30') — centered |
| `Exporation Movement 2` | Calculated from item encumbrance (e.g. 90') — centered |
| `Overland Movement 2` | Calculated from item encumbrance (e.g. 18) — centered |
| `Find Room Trap 2` | Number only, no "-in-6" (sheet prints it). Blank if no ability. Centered. |
| `Find Secret Door 2` | Number only. Blank if no ability. Centered. |
| `Open Stuck Door 2` | Number only (e.g. "2"). Centered. |
| `Listen at Door 2` | Number only. Blank if no ability. Centered. |
| `Languages 2` | Known languages, comma-separated. Alignment language excluded. Deduplicated. |
| `Literacy 2` | Checkbox — checked if literate |
| `Abilities, Skills, Weapons 2` | Class special abilities, one per line. Abilities already shown in Exploration are excluded. Blank if nothing to add. Weapons listed in Equipped — not repeated here. |
| `Notes 2` | Spells (with page number, e.g. "Spell: Sleep (p. 65)"), remaining gold, thief skills. One per line. |
| `PR XP Bonus 2` | Prime requisite XP modifier. Centered. |
| `XP 2` | 0. Centered. |
| `XP for Next Level 2` | XP needed for 2nd level, with thousands comma (e.g. "2,000"). Centered. |
| `Equipped 1`–`9` | Equipped items. Weapons include damage notation and STR mod (e.g. "Sword (1d8+1 dmg)"). |
| `Packed 1` | STR 9+ slot — "Insufficient STR Score - Slot Unavailable" if STR < 9. Items shift to first available slot. |
| `Packed 2` | STR 6+ slot — unavailable if STR < 6. |
| `Packed 3` | STR 4+ slot — unavailable if STR < 4. |
| `Packed 4`–`16` | Regular packed item slots — available to all characters. |
| `Unencumbering Items` | Tiny/non-encumbering items (holy symbol, garlic, rings, etc.) |
| `Packed STR 13+` | If STR ≥ 13: shows item count limit (10 + STR melee mod). If STR < 13: "Insufficient STR Score - Slot Unavailable". |
| `Packed STR 16+` | If STR ≥ 16: shows item count limit (12 + STR melee mod). If STR < 16: "Insufficient STR Score - Slot Unavailable". |
| `Packed STR 18+` | If STR ≥ 18: shows item count limit (14 + STR melee mod). If STR < 18: "Insufficient STR Score - Slot Unavailable". |

---

## Tech Stack

- **Language:** Python or JavaScript/Node.js (TBD — recommend Python for PDF manipulation via `reportlab` or `pypdf`)
- **UI:** Simple HTML/CSS/JS single-page app (no framework required for Phase 1)
- **PDF generation:** Fill an existing PDF template using `pypdf` or `pdfrw`, OR generate from scratch using `reportlab`
- **Hosting (Phase 1):** Local only — open in browser, generate, download PDF

---

## Project Structure

```
ose-character-creator/
├── SPEC.md           ← This file
├── DEVLOG.md         ← Running dev log
├── README.md         ← How to run
├── src/
│   ├── generator.py  ← Character generation logic
│   ├── dice.py       ← Dice rolling functions
│   ├── classes.py    ← Class data and rules
│   ├── equipment.py  ← Equipment lists and auto-kit logic
│   └── pdf_output.py ← PDF generation/filling
├── ui/
│   ├── index.html    ← Generation UI
│   ├── style.css
│   └── app.js
└── assets/
    └── character-sheet.pdf  ← Official blank sheet (to be added)
```

---

## Resolved Decisions

1. **Character sheet PDF** — Using `assets/character-sheet.pdf` (OSE Character Sheet - Item Encumbrance). Field mapping complete.
2. **Spell selection** — For MU/Elf at 1st level: **random** from the spell list (default 12 spells). Page numbers from OSE Classic Rules Tome included in output. Read Magic option available via UI toggle.
3. **Auto kit logic** — Strictly follow class restrictions. Always include class essentials (e.g. holy symbol for Cleric, thieves' tools for Thief). Spend remaining gold on sensible gear within class limits.
4. **Name field** — Leave blank on the character sheet. Name generation is a future phase feature.
5. **Armour Class system** — **Using optional Ascending AAC** (OSE Classic p. 32). Descending AC is NOT used. This is a permanent project decision.
6. **Encumbrance system** — **Using optional Item-Based Encumbrance** (OSE Carrion Crawler #2). Movement calculated from item counts. STR melee modifier shifts packed thresholds. Packed slots 1–3 gated by STR (9+, 6+, 4+). STR-gated header slots (13+, 16+, 18+) show item limits or "Insufficient STR Score". This is a permanent project decision.
7. **Weapons** — Melee weapons listed in Equipped include damage die and STR melee modifier (e.g. "Sword (1d8+1 dmg)").

## Future Phase Notes

- Spell selection preference (random / blank / user-picks) — add to preferences UI
- Equipment auto-kit preference (strict / loose) — add to preferences UI
- Name generation (generic fantasy, race/class-themed) — future phase
- Web hosting on www.muckdart.com — future phase
