"""PDF form filler for OSE Character Creator.

Uses pypdf to fill the official OSE character sheet form fields.
Field names match exactly the 71 fillable fields in assets/character-sheet.pdf.
"""

import os
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject


SHEET_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "character-sheet.pdf")


def fmt_mod(val: int) -> str:
    """Format a modifier as +X or -X. Returns empty string for 0 (leave cell blank)."""
    if val > 0:
        return f"+{val}"
    elif val < 0:
        return str(val)
    return ""


def fmt_xp(val) -> str:
    """Format an XP value with comma thousands separators."""
    try:
        return f"{int(val):,}"
    except (ValueError, TypeError):
        return str(val)


def fmt_skill(val: str) -> str:
    """Strip '-in-6' suffix from skill values — the sheet already prints it.
    E.g. '2-in-6' → '2', '1-in-6' → '1', '—' → '' (blank for no ability)."""
    if val == "—" or not val:
        return ""
    return val.replace("-in-6", "").strip()


def fmt_multiline(items) -> str:
    """Join a list (or semicolon-separated string) as one entry per line."""
    if isinstance(items, list):
        return "\n".join(i for i in items if i)
    # Split on semicolons if passed as a string
    return "\n".join(p.strip() for p in str(items).split(";") if p.strip())


def fill_character_sheet(character: dict, output_path: str) -> str:
    """
    Fill the OSE character sheet PDF with character data.
    Returns the path to the filled PDF.
    """
    reader = PdfReader(SHEET_PATH)
    writer = PdfWriter()
    writer.append(reader)
    writer.set_need_appearances_writer(True)

    # Map character dict → PDF field names
    fields = {
        # Identity
        "Name 2":           "",
        "Character Class 2": character.get("character_class", ""),
        "Title 2":          character.get("title", ""),
        "Level 2":          str(character.get("level", 1)),
        "Alignment 2":      character.get("alignment", ""),

        # Ability Scores
        "STR 2":            str(character.get("str", "")),
        "INT 2":            str(character.get("int", "")),
        "WIS 2":            str(character.get("wis", "")),
        "DEX 2":            str(character.get("dex", "")),
        "CON 2":            str(character.get("con", "")),
        "CHA 2":            str(character.get("cha", "")),

        # Ability Modifiers (blank if zero)
        "STR Melee Mod":        fmt_mod(character.get("str_melee_mod", 0)),
        "DEX Missile Mod":      fmt_mod(character.get("dex_missile_mod", 0)),
        "DEX AC Mod 2":         fmt_mod(character.get("dex_ac_mod", 0)),
        "Initiative DEX Mod 2": fmt_mod(character.get("dex_initiative_mod", 0)),
        "Reactions CHA Mod 2":  fmt_mod(character.get("cha_npc_reactions", 0)),
        "Magic Save Mod 2":     fmt_mod(character.get("wis_magic_saves", 0)),
        "CON HP Mod 2":         fmt_mod(character.get("con_hp_mod", 0)),

        # Combat
        "HP 2":             str(character.get("hp", "")),
        "Max HP 2":         str(character.get("max_hp", "")),
        "AC 2":             str(character.get("ac", "")),
        "Unarmoured AC 2":  str(character.get("unarmoured_ac", "")),
        "Attack Bonus":     fmt_mod(character.get("attack_bonus", 0)),

        # Saving Throws
        "Death Save 2":     str(character.get("save_death", "")),
        "Wands Save 2":     str(character.get("save_wands", "")),
        "Paralysis Save 2": str(character.get("save_paralysis", "")),
        "Breath Save 2":    str(character.get("save_breath", "")),
        "Spells Save 2":    str(character.get("save_spells", "")),

        # Movement
        "Encounter Movement 2":   character.get("encounter_movement", "40'"),
        "Exporation Movement 2":  character.get("exploration_movement", "120'"),
        "Overland Movement 2":    character.get("overland_movement", "24"),

        # Class skills — just the number; sheet already prints "-in-6". Blank if no ability.
        "Find Room Trap 2":    fmt_skill(character.get("find_room_trap", "—")),
        "Find Secret Door 2":  fmt_skill(character.get("find_secret_door", "—")),
        "Open Stuck Door 2":   fmt_skill(character.get("open_stuck_door", "—")),
        "Listen at Door 2":    fmt_skill(character.get("listen_at_door", "—")),

        # Languages & Notes — one entry per line
        "Languages 2":              character.get("languages", ""),
        "Abilities, Skills, Weapons 2": fmt_multiline(character.get("abilities", "")),
        "Notes 2":                  fmt_multiline(character.get("notes", "")),

        # XP — thousands separators on Next Level value
        "XP 2":             str(character.get("xp", 0)),
        "XP for Next Level 2": fmt_xp(character.get("xp_next_level", "")),
        "PR XP Bonus 2":    character.get("pr_xp_bonus", "None"),

        # Item-Based Encumbrance (OSE Carrion Crawler #2)
        # Packed STR threshold fields show how many packed items the character
        # can carry before slowing, adjusted for their STR melee modifier.
        # Base thresholds: 10/12/14/16 — STR mod shifts each up by that amount.
        "Packed STR 13+": str(10 + character.get("str_melee_mod", 0)),
        "Packed STR 16+": str(12 + character.get("str_melee_mod", 0)),
        "Packed STR 18+": str(14 + character.get("str_melee_mod", 0)),

        # Unencumbering items (tiny items: holy symbol, garlic, rings, etc.)
        "Unencumbering Items": ", ".join(character.get("unencumbering", [])),
    }

    # Equipment — Equipped slots (up to 9)
    equipped = character.get("equipped", [])
    for i, item in enumerate(equipped[:9], start=1):
        fields[f"Equipped {i}"] = item

    # Equipment — Packed slots (up to 16)
    packed = character.get("packed", [])
    for i, item in enumerate(packed[:16], start=1):
        fields[f"Packed {i}"] = item

    # Literacy checkbox
    literate = character.get("literate", False)

    # Write fields by directly updating annotations
    _fill_fields(writer, fields)

    # Handle literacy checkbox separately
    _set_checkbox(writer, "Literacy 2", literate)

    # Write output
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path


def _fill_fields(writer: PdfWriter, fields: dict):
    """Fill all text/select form fields by walking annotations."""
    for page in writer.pages:
        if "/Annots" not in page:
            continue
        for annot_ref in page["/Annots"]:
            annot = annot_ref.get_object()
            field_name = annot.get("/T")
            if field_name and field_name in fields:
                value = str(fields[field_name])
                annot.update({
                    NameObject("/V"): TextStringObject(value),
                    NameObject("/DV"): TextStringObject(value),
                })


def _set_checkbox(writer: PdfWriter, field_name: str, checked: bool):
    """Set a checkbox field value."""
    try:
        for page in writer.pages:
            if "/Annots" not in page:
                continue
            for annot in page["/Annots"]:
                annot_obj = annot.get_object()
                if annot_obj.get("/T") == field_name:
                    annot_obj.update({
                        NameObject("/V"): NameObject("/Yes") if checked else NameObject("/Off"),
                        NameObject("/AS"): NameObject("/Yes") if checked else NameObject("/Off"),
                    })
    except Exception:
        pass  # Non-fatal if checkbox can't be set
