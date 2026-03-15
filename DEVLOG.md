# OSE Character Creator — Dev Log

---

## ⚠️ Permanent Design Decision — Ascending Armour Class (AAC)

> This project uses the **optional Ascending Armour Class (AAC)** system from OSE Classic p. 32.
> Higher AAC = better. Unarmoured = 10, Plate mail = 16. Descending AC is NOT used.
> **Do not revert to descending AC.** This decision is final.

---

## 2026-03-13 — Phase 1 Complete ✅

### What Was Built

Full Phase 1 implementation — character generator with PDF output and local web UI.

**Files created:**
| File | Description |
|------|-------------|
| `src/dice.py` | roll_3d6, roll_4d6_drop_lowest, roll_hit_die, roll_starting_gold |
| `src/ability_scores.py` | All 6 ability modifier tables (STR/INT/WIS/DEX/CON/CHA) |
| `src/classes.py` | 7 classes: Cleric, Dwarf, Elf, Fighter, Halfling, Magic-User, Thief |
| `src/equipment.py` | Gear lists, class weapon/armour rules, auto_kit() builder |
| `src/generator.py` | generate_character(options) → full character dict |
| `src/pdf_output.py` | fill_character_sheet(character, path) → filled PDF |
| `server.py` | HTTP server: GET / serves UI, POST /generate returns character+PDF |
| `ui/index.html` | Options form + character summary display |
| `ui/style.css` | Dark fantasy theme |
| `ui/app.js` | Fetch /generate, parse response, display character, link PDF |

### Rules Implemented

- All 13 steps of OSE character creation
- All 7 class definitions with requirements, HD, saves, abilities, languages
- All ability score modifier tables
- Prime requisite XP modifier calculation
- Auto-optimization of prime requisites (when random class selected)
- Equipment auto-kit with strict class restrictions:
  - Cleric: blunt weapons only, any armour
  - Dwarf: no longbow/two-handed sword/polearm
  - Elf: any weapon/armour
  - Fighter: any weapon/armour
  - Halfling: no longbow/two-handed sword/polearm/lance
  - Magic-User: dagger only, no armour
  - Thief: leather only, no shield + always gets thieves' tools
- Random spell selection for MU/Elf at 1st level (12 options)
- All 71 PDF form fields mapped and filled

### Validation Results

All 7 classes tested and passing:
- Correct weapon/armour restrictions
- HP always ≥ 1
- AC calculated correctly (base + DEX modifier)
- PDF writes successfully

### Known Issues to Fix in Phase 2

1. ~~Cleric armour priority~~ — Fixed 2026-03-14. The logic was correct; low rolls just can't afford better armour after buying essentials.
2. **Name field blank** — intentional for Phase 1
3. **Equipment mode is auto-only** — manual shopping UI is Phase 2 (toggle added to UI, not wired up)
4. **Spell selection** — random only for Phase 1; Phase 2 adds user choice

### Repo

https://github.com/ColHoraceGentleman/ose-character-creator

---

## 2026-03-14 — AAC Switch + Preference Toggles

Switched from descending AC to ascending AC (AAC) per OSE's optional rules:

- `calculate_ac()` → `calculate_aac()` in generator.py
- Base unarmoured AAC = 10 (was 9 descending)
- Armour provides AAC directly: Leather=12, Chainmail=14, Plate=16
- Shield adds +1 AAC
- Final AAC = armour AAC + DEX mod + shield bonus
- Fixed bug where AC wasn't accounting for equipped armour

Added preference toggles to UI (disabled, for future functionality):
- Include magic items
- Generate party (4 characters)
- Manual shopping (dropdown option)

Added test suite: `tests/test_equipment.py`

---

## 2026-03-14 — Item-Based Encumbrance (OSE CC2)

Implemented the optional Item-Based Encumbrance system from OSE Carrion Crawler #2.

**Changes:**
- `equipment.py`: Added `encumbrance` key to all ADVENTURING_GEAR, WEAPONS, and ARMOUR entries. New functions: `item_encumbrance()`, `count_encumbrance()`, `calculate_movement()`, `ENCUMBRANCE_TABLE`. Updated `auto_kit()` to track unencumbering items separately. Storage containers (backpack, sacks) count as 0 items when in use.
- `generator.py`: Now calls `calculate_movement()` after building the kit. Character dict gains `equipped_item_count`, `packed_item_count`, and `unencumbering` list. Movement fields are now calculated (not hardcoded to 120').
- `pdf_output.py`: Populates `Unencumbering Items` field. `Packed STR 13+/16+/18+` fields now show correct item thresholds adjusted by STR melee modifier (e.g. STR 16 +2 → packed threshold shifts from 10/12/14 to 12/14/16).
- `SPEC.md`, `README.md`: Added Item-Based Encumbrance rules table and explanation.

**Rules implemented:**
- 1 item = one-handed; 2 items = two-handed
- Light armour = 1 item; Heavy armour (chainmail, plate) = 2 items; Shield = 1 item
- Containers in use = 0 items
- Tiny items (holy symbol, garlic) = 0 items → go to Unencumbering Items
- Movement determined by the slower of equipped vs. packed checks
- STR melee modifier shifts packed thresholds

**All 7 classes tested and passing.**

---

## 2026-03-14 — AAC Cleanup

Removed dead descending `ac` keys from `ARMOUR` dict in `equipment.py` (they were unused but could cause confusion). Added inline comments noting descending values for reference. Confirmed all code, SPEC.md, and README.md are consistently using optional Ascending Armour Class (AAC) throughout.

---

## 2026-03-14 (Evening) — PDF Polish Pass

Extensive PDF output fixes based on review of generated character sheets.

### PDF Output Fixes

**Zero modifiers:** `fmt_mod()` now returns `""` (blank) instead of `"—"` for zero values. All modifier cells are blank when the modifier is 0.

**Exploration skills:** `fmt_skill()` strips the `-in-6` suffix — the sheet already prints it. `"2-in-6"` → `"2"`, blank if no ability.

**Multiline fields:** Abilities/Skills/Weapons and Notes are now newline-separated (one entry per line) instead of semicolon-separated.

**XP thousands separator:** `fmt_xp()` formats large numbers with commas (e.g. `2,000`, `4,000`).

**Class/Title/AL spacing:** Leading space added to Class, Title, and Alignment fields so text isn't crammed against the label.

**Center alignment:** `CENTERED_FIELDS` set added. All ability scores, modifiers, saving throws, combat stats, exploration skills, movement, level, and XP fields are now center-aligned via `/Q = 1` on PDF annotations.

**Languages:** Alignment language removed from the Languages field (it's implicit). Duplicates deduplicated.

**Abilities deduplication:** Abilities already shown in the Exploration section (Listen at doors, Detect secret doors, etc.) are filtered out of the Abilities/Skills/Weapons field. Blank if nothing remains.

**Spell page numbers:** Spell entries in Notes now include the rulebook page: `"Spell: Sleep (p. 65)"`. All 12 L1 MU/Elf spells mapped in `classes.py → SPELL_PAGE_NUMBERS`.

**Read Magic toggle:** New UI checkbox — "Give spellcasters Read Magic by default". If checked, Read Magic is granted automatically and excluded from the random spell roll. Both MU and Elf receive it. Option key: `give_read_magic`.

**Weapon damage notation:** Melee weapons in the Equipped list now include damage: `"Sword (1d8 dmg)"`, `"Sword (1d8+2 dmg)"` with STR melee modifier applied. Missile-only weapons omit the STR mod. Implemented in `generator.py → format_equipped_items()`.

### Packed Items STR Logic (Fixed Twice)

The sheet has 6 STR-gated slots at the top of the Packed Items section:
- `Packed STR 18+` — available only if STR ≥ 18
- `Packed STR 16+` — available only if STR ≥ 16
- `Packed STR 13+` — available only if STR ≥ 13
- `Packed 1` (STR 9+) — available only if STR ≥ 9
- `Packed 2` (STR 6+) — available only if STR ≥ 6
- `Packed 3` (STR 4+) — available only if STR ≥ 4
- `Packed 4`–`16` — available to all characters

If a character's STR doesn't meet the threshold, the slot shows: `"Insufficient STR Score - Slot Unavailable"`. Items are shifted down to the first available slot. When STR qualifies for `Packed STR 13+/16+/18+`, those fields show the item count limit (10/12/14 + STR melee mod).

### Movement Threshold Clarification

Packed item thresholds are counted from the **top of the visible sheet** (including the 6 STR-gated header slots):
- Sheet slots 1–13 → 120' (40') — corresponds to 0–10 actual items
- Sheet slots 14–15 → 90' (30') — corresponds to 11–12 actual items
- Sheet slots 16–17 → 60' (20') — corresponds to 13–14 actual items
- Sheet slots 18–19 → 30' (10') — corresponds to 15–16 actual items

Equipped thresholds unchanged: 0–3=120', 4–5=90', 6–7=60', 8–9=30'.

---

## Upcoming — Phase 2

- [ ] Magic item generation (toggle + options)
- [ ] Multiple characters per run / party sheet
- [ ] Preferences UI (dice method default, spell selection, auto-kit strictness)
- [ ] Manual equipment shopping mode
- [ ] QA agent review of full codebase
- [ ] Name generation (random fantasy names per race/class)

---

## How to Pick Up Next Session

1. Read DEVLOG.md (this file) — start here
2. Read SPEC.md — full rules, field mappings, design decisions
3. Run `python3 server.py 8080` → http://localhost:8080
4. Generate a character from each class and download the PDF to verify output
5. Check "Upcoming — Phase 2" above for next tasks
