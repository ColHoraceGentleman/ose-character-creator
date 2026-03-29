# OSE Character Creator — Dev Log

---

## 2026-03-16 — Phase 2 (Part 1): Level Selection, Max HP, Multiple Characters

### What Was Added

1. **Level selector** — dropdown 1–14; demi-human classes auto-clamped to their max (Elf 10, Dwarf 12, Halfling 8)

2. **Full level progression data** — complete tables in `classes.py` for all 7 classes:
   - XP thresholds, THAC0, AAC attack bonus, saving throws at every level
   - HD cap per class (level at which dice stop and flat HP bonus begins)
   - Flat HP per level after HD cap (Cleric +1, MU +1, Elf/Fighter/Thief +2, Dwarf +3)
   - CON modifier does NOT apply after HD cap

3. **Level titles** — correct title at every level for all 7 classes (e.g. Fighter: Veteran → Lord)

4. **Max HP at level 1** — toggle; gives max die result at 1st level (CON mod still applied, floor 1)

5. **Reroll 1s & 2s** — now applies at ALL levels during HD phase (not just level 1)

6. **Multiple characters** — dropdown 1–10; generates each independently with same options
   - Single character: shows PDF download as before
   - 2+ characters: shows both single PDF (first character preview) and ZIP download of all

7. **Bulk ZIP download** — zip contains all PDFs named `character_N_ClassName.pdf`

### Files Changed
- `src/classes.py` — added HD_CAP, FLAT_HP_PER_LEVEL, LEVEL_PROGRESSION, LEVEL_TITLES tables
- `src/generator.py` — level/max_level/prog lookup, multi-level HP rolling, title by level, THAC0 from table
- `server.py` — num_characters loop, zip generation, zip download route
- `ui/index.html` — Level dropdown, Number of Characters dropdown, Max HP toggle, ZIP download button, cache-busted
- `ui/app.js` — passes level/num_characters/max_hp_at_level1, handles zip_url in response

### Testing
- Fighter Lv1 max HP (d8+CON): correct ✅
- Fighter Lv5 (AB=2, saves, title=Swashbuckler): correct ✅
- MU Lv9 (last HD level): correct ✅
- MU Lv12 (post-cap flat +1 × 3): correct ✅
- Halfling Lv14 → clamped to 8: correct ✅
- Elf Lv10 DAC+Standard: correct ✅
- Thief Lv14, Dwarf Lv12: correct ✅
- 4-character party ZIP generation: correct ✅

---

## 2026-03-16 — Phase 1.5 Update: DAC Mode + Standard Encumbrance + Race/Class Fields

### What Was Added

1. **AC Mode toggle** — AAC (Ascending) or DAC (Descending/THAC0)
   - AAC: AC 10–19, shows Attack Bonus field
   - DAC: AC 9 base (lower = better), fills THAC0–THAC9 attack matrix
   - THAC0 = 19 at 1st level; roll to hit AC n = THAC0 - n - STR mod, clamped 1–20
   - Lower AC (better armour) requires a higher roll to hit ✓

2. **Encumbrance Mode toggle** — Item-based (existing) or Standard (weight-based)
   - Item-based: packed/equipped item slots, STR thresholds (unchanged)
   - Standard: sums cn weights, fills TR/EQ/Total encumbrance fields
   - Movement thresholds: 0–400=120', 401–800=90', 801–1200=60', 1201–1600=30'

3. **Race/Class split** (new sheets have separate Race + Class fields):
   - Demi-humans (Dwarf/Elf/Halfling): Race = class name, Class = blank
   - Humans: Race = "Human", Class = class name
   - AAC/item sheet (no Race field): combined as "Human Fighter", "Dwarf", etc.

4. **Four dedicated PDF sheets** (one per combo):
   - `assets/sheet-aac-item.pdf`     — AAC + Item-based
   - `assets/sheet-aac-standard.pdf` — AAC + Standard encumbrance
   - `assets/sheet-dac-item.pdf`     — DAC + Item-based
   - `assets/sheet-dac-standard.pdf` — DAC + Standard encumbrance

5. **Gold in GP field** — remaining gold fills the GP coin field on standard sheets

### Bugs Fixed
- `chosen_class` was ignored when dice method was non-optimized (class randomised instead)
- DAC attack matrix was reversed (AC 9 showed as hardest to hit instead of easiest)
- STR melee modifier was not applied to the attack matrix
- Sheet selection was mapping AAC→new sheet and DAC→old sheet (backwards)
- Browser cached old `app.js` missing `ac_mode` — cache-busted version strings

### Files Changed
- `src/equipment.py` — added ARMOUR_DAC_BONUS, STANDARD_ENCUMBRANCE_WEIGHTS, calculate_standard_encumbrance()
- `src/generator.py` — ac_mode/encumbrance_mode options, race/class fields, DAC matrix, gold_remaining, chosen_class fix
- `src/pdf_output.py` — full rewrite: 4 sheet paths, separate p1/p2 field builders per sheet family
- `ui/index.html` — AC Mode dropdown, Standard encumbrance enabled, cache-busted
- `ui/app.js` — passes ac_mode to server
- `assets/sheet-aac-item.pdf` — AAC + item-based sheet
- `assets/sheet-aac-standard.pdf` — AAC + standard encumbrance sheet
- `assets/sheet-dac-item.pdf`  — DAC + item-based sheet
- `assets/sheet-dac-standard.pdf` — DAC + standard encumbrance sheet

### Testing
All 4 combos verified (Fighter, Dwarf, Elf, Halfling, Cleric, MU, Thief):
- AAC + item_based ✅
- AAC + standard ✅
- DAC + item_based ✅
- DAC + standard ✅

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

## 2026-03-15 — UI/UX Redesign + Weapon Display Overhaul

### Class & Dice Method

- **Class dropdown** simplified: single select showing "Random class" or a specific class by name. No separate "choose" step.
- **Dice method** is now dynamic — swaps based on class selection:
  - Random class: `3d6 in order` / `4d6 in order, drop lowest`
  - Specific class: `3d6 optimized` / `4d6 optimized, drop lowest`
- **Optimized mode**: rolls 6 values; top 1 (or 2) assigned randomly to prime requisite(s); remainder randomly distributed to other stats. No point trading.
- **Random class selection** now prefers classes giving +5%/+10% XP bonus with rolled scores; falls back to 0% classes if none qualify. −10% classes never selected.
- Removed `3d6 arrange freely` mode and `optimize_prime_requisite()` entirely.

### Alignment

- "Leave alignment blank" checkbox greys out all alignment options (`pointer-events: none`) and produces blank alignment on the sheet.
- Default: Lawful ✅, Neutral ✅, Chaotic ☐.
- If one alignment checked: assigned directly. If multiple: picked randomly among checked.

### Weapon & Armor Display

- **Melee weapons**: `Name: +X to hit; YdZ+X dmg` (STR melee mod applied to both)
- **Ranged weapons**: `Name: +X to hit; YdZ dmg` (DEX missile mod to hit; no STR to damage)
- **Dual-use weapons** (Dagger, Spear, etc.): `Name: melee info / +X to hit (thrown)`
- **Armor**: `Name (AC)` e.g. `Leather (12 AC)`; `Shield (+1 AC)`
- Magic bonus infrastructure in place (always 0 for now; ready for magic item phase)

### Other

- Ruleset selector added: Classic Fantasy (B/X) default; Advanced Fantasy placeholder (disabled)
- Help ⓘ tooltips added to all major options
- Subtitle removed from header
- HP reroll label updated to "Reroll 1s & 2s at 1st level"
- Sub-par reroll defaults to on; label updated to "Reroll if all stats ≤ 8"
- Confirmed per RAW: demi-human racial languages are always known (no toggle needed)

---

## 2026-03-15 — Bug Fixes

### HP Reroll Logic (Fixed)
- Old code only rerolled once — a second low roll was kept as-is
- Old code applied CON mod after the reroll check, so a 3 on a d4 with −2 CON gave 1 HP
- Fix: loop `while roll <= 2` to guarantee die result > 2, then apply CON mod
- Floor of 1 HP always enforced regardless of CON penalty

### Random Class XP Selection (Fixed)
- Bug: `3d6_order` + `Random class` used old `determine_class()` which picked any valid class, ignoring XP bonuses entirely — could produce −10% or −20% characters
- Fix: all random-class paths now use `_pick_random_class_by_xp()` which picks by tier:
  1. +5% or +10% (preferred)
  2. 0% (fallback)
  3. −10% (last resort — only when all valid classes have negative prime requisites)
  4. −20% (absolute last resort — virtually impossible with reroll_subpar on)
- Extracted `_pick_random_class_by_xp()` helper used by both `determine_class()` and `determine_class_for_roll()`

### UI Fixes
- Help markers were rendering as `?#9432;` — fixed by rewriting HTML cleanly
- Alignment "Leave blank" checkbox was not greying out options — fixed with CSS `pointer-events: none` + `user-select: none`
- Encumbrance dropdown labels updated to "Item-based" / "Standard (coming soon)"
- All tooltip text updated to plain English per spec
- Toggle renamed: "Discard sub-par characters"

---

## ⚠️ Two Versions Exist — Use docs/ Only

There are two versions of this project:

- **`docs/`** — Browser-only version (JS engine). This is the **active, long-term version**. Runs entirely in the browser with no server needed. Hosted via GitHub Pages. **All future work goes here.**
- **`ui/` + `src/` + `server.py`** — Python server version. This is **legacy/archived**. Do not continue development here.

When picking up this project, always work in `docs/`.

---

## Known Bugs (docs/ browser version)

- **Level dropdown doesn't filter by class max** — dropdown always shows 1–14 regardless of class selected. Demi-humans have lower caps (Dwarf 12, Elf 10, Halfling 8). Generator correctly clamps at runtime, but the UI should dynamically update the dropdown options when a specific class is chosen. When "Random" is selected, show 1–14. Fix: add JS to watch the class `<select>` and rebuild the level `<option>` list based on `CLASSES[selectedClass].max_level`.

---

## Upcoming — Phase 2

- [ ] Magic item generation (toggle + options)
- [x] Multiple characters per run / bulk ZIP download (done in docs/ browser version)
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
