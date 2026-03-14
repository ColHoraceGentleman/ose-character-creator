# OSE Character Creator — Dev Log

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

## 2026-03-14 — AAC Cleanup

Removed dead descending `ac` keys from `ARMOUR` dict in `equipment.py` (they were unused but could cause confusion). Added inline comments noting descending values for reference. Confirmed all code, SPEC.md, and README.md are consistently using optional Ascending Armour Class (AAC) throughout.

---

## Upcoming — Phase 2

Planned work for next session:

- [ ] Fix Cleric armour priority bug
- [ ] Magic item generation (toggle + options)
- [ ] Multiple characters per run / party sheet
- [ ] Preferences UI (dice method default, spell selection, auto-kit strictness)
- [ ] Manual equipment shopping mode
- [ ] QA agent review of Phase 1 code

---

## Future Sessions — How to Pick Up

1. Read this DEVLOG
2. Read SPEC.md for full rules and field mappings
3. Run `python3 server.py 8080` to test current state
4. Check "Known Issues" section above for what needs fixing
5. Check "Upcoming — Phase 2" for next tasks
