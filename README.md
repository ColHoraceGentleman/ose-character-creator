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
| Phase 2 | 🔜 Planned | Magic items, multiple characters, preferences UI |
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
│   └── character-sheet.pdf   # Official OSE blank sheet (71 form fields)
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

## ⚠️ Critical Design Decision — Armour Class System

> **This project uses ASCENDING ARMOUR CLASS (AAC)** — the optional system from OSE Classic p. 32.
>
> | Armour | AAC |
> |--------|-----|
> | Unarmoured | 10 |
> | Leather | 12 |
> | Chainmail | 14 |
> | Plate mail | 16 |
> | Shield | +1 bonus |
>
> Higher AAC = better protection. **Descending AC is not used anywhere.** This is a permanent project decision.

## Known Issues / Notes

- Name field is always blank (intentional for Phase 1)
- Spell selection is random from 1st-level list (MU/Elf)
- Equipment mode is auto-only in Phase 1 (manual shopping is Phase 2; toggle visible in UI)
