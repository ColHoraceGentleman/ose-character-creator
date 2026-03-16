# OSE Character Creator

A web-based Old School Essentials (Classic Fantasy) character generator that outputs a fully completed PDF character sheet.

---

## Quick Start

```bash
cd ~/clawd/projects/ose-character-creator
python3 server.py 8080
# Open http://localhost:8080 in your browser
```

Click **Generate Character**, choose your options, and hit the download button to get a filled PDF.

---

## Project Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Character generator + PDF output + local UI |
| Phase 1.5 | ✅ Complete | DAC mode, standard encumbrance, race/class fields, 4 sheet variants |
| Phase 2 (part 1) | ✅ Complete | Level selection (1–14), max HP at level 1, multiple characters, bulk ZIP |
| Phase 2 (remaining) | 🔜 Planned | Advanced Fantasy, equipment rules, Carrion Crawler options |
| Phase 3 | 🔜 Planned | Web hosting on www.muckdart.com |

---

## Documentation

| File | Purpose |
|------|---------|
| [SPEC.md](./SPEC.md) | Full requirements, rules, field mappings — source of truth |
| [DEVLOG.md](./DEVLOG.md) | Development history and session notes |
| [session-logs/2026-03-13.md](./session-logs/2026-03-13.md) | Full log of the first session |

---

## Project Structure

```
ose-character-creator/
├── server.py              # Local HTTP server (port 8080)
├── SPEC.md                # Requirements & design doc
├── DEVLOG.md              # Dev log
├── README.md              # This file
├── assets/
│   ├── sheet-aac-item.pdf     # AAC + Item-based encumbrance sheet
│   ├── sheet-aac-standard.pdf # AAC + Standard encumbrance sheet
│   ├── sheet-dac-item.pdf     # DAC + Item-based encumbrance sheet
│   └── sheet-dac-standard.pdf # DAC + Standard encumbrance sheet
├── src/
│   ├── dice.py            # Dice rolling functions
│   ├── ability_scores.py  # All ability modifier tables
│   ├── classes.py         # Class data (all 7 OSE Classic classes)
│   ├── equipment.py       # Gear lists + auto-kit builder
│   ├── generator.py       # Main character generation logic
│   └── pdf_output.py      # PDF form filler
├── ui/
│   ├── index.html         # Generation UI
│   ├── style.css          # Dark theme styles
│   └── app.js             # Frontend JavaScript
├── output/                # Generated PDFs (gitignored)
└── session-logs/          # Session transcripts
```

---

## How It Works

1. User visits `http://localhost:8080`
2. Selects options (dice method, class, alignment, toggles)
3. Clicks Generate — browser POSTs to `/generate`
4. `server.py` calls `src/generator.py` → builds full character dict
5. `src/pdf_output.py` fills the 71 form fields in `assets/character-sheet.pdf`
6. Server returns character JSON + PDF download URL
7. UI displays character summary and offers PDF download

---

## Rules Source

Rules extracted from: **OSE Classic Players Rules Tome v1.0** (Necrotic Gnome)  
Original PDF: `~/Downloads/OSE Classic Players Rules Tome v1-0.pdf`

---

## Dependencies

- Python 3.x (standard library only + pypdf)
- `pypdf` — install with: `pip3 install pypdf --break-system-packages`
- No other dependencies

---

## Options

| Option | Values | Notes |
|--------|--------|-------|
| Armour Class | AAC (Ascending) / DAC (Descending) | DAC fills THAC0–9 matrix; AAC fills Attack Bonus |
| Encumbrance | Item-based / Standard (weight) | Item-based uses OSE CC2 item counts; Standard uses cn weights |
| Class | Random or specific | Optimized dice methods available for chosen class |
| Level | 1–14 | Clamped to class max (Halfling 8, Elf 10, Dwarf 12) |
| Number of Characters | 1–10 | 2+ generates ZIP of all PDFs |
| Alignment | Any combo of L/N/C, or blank | |
| Dice Method | 3d6 or 4d6 drop lowest, in-order or optimized | |
| Max HP at level 1 | Toggle | Takes max die result at 1st level; CON mod still applies |
| HP Reroll | Toggle | Rerolls 1s and 2s on hit dice at any level |
| Discard sub-par | Toggle | Rerolls if all stats ≤ 8 |
| Read Magic | Toggle | Gives MU/Elf Read Magic before random spell selection |

## Known Issues / Notes

- Name field is always blank (intentional — filled in by player)
- Spell selection is random from 1st-level list (MU/Elf)
- Equipment mode is auto-only (manual shopping is Phase 2)
- Coin denominations other than GP not generated (all starting wealth is in gp)
