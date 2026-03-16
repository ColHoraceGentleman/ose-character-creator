"""PDF form filler for OSE Character Creator.

Four sheet files, one per combo:
  assets/sheet-aac-item.pdf     — AAC + Item-based
  assets/sheet-aac-standard.pdf — AAC + Standard encumbrance
  assets/sheet-dac-item.pdf     — DAC + Item-based
  assets/sheet-dac-standard.pdf — DAC + Standard encumbrance
"""

import os
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject, NumberObject

ASSETS = os.path.join(os.path.dirname(__file__), "..", "assets")

SHEET_PATHS = {
    ("aac", "item_based"):  os.path.join(ASSETS, "sheet-aac-item.pdf"),
    ("aac", "standard"):    os.path.join(ASSETS, "sheet-aac-standard.pdf"),
    ("dac", "item_based"):  os.path.join(ASSETS, "sheet-dac-item.pdf"),
    ("dac", "standard"):    os.path.join(ASSETS, "sheet-dac-standard.pdf"),
}

# Center-aligned fields per sheet family
AAC_CENTERED = {
    "STR 2", "INT 2", "WIS 2", "DEX 2", "CON 2", "CHA 2",
    "STR Melee Mod", "DEX Missile Mod", "DEX AC Mod 2",
    "Initiative DEX Mod 2", "Reactions CHA Mod 2", "Magic Save Mod 2", "CON HP Mod 2",
    "HP 2", "Max HP 2", "AC 2", "Unarmoured AC 2", "Attack Bonus",
    "Death Save 2", "Wands Save 2", "Paralysis Save 2", "Breath Save 2", "Spells Save 2",
    "Find Room Trap 2", "Find Secret Door 2", "Open Stuck Door 2", "Listen at Door 2",
    "Encounter Movement 2", "Exporation Movement 2", "Overland Movement 2",
    "Level 2", "XP 2", "XP for Next Level 2", "PR XP Bonus 2",
}

DAC_CENTERED = {
    "STR", "INT", "WIS", "DEX", "CON", "CHA",
    "STR Melee Mod", "DEX Missile Mod", "DEX AC Mod",
    "Initiative DEX Mod", "Reactions CHA Mod", "Magic Save Mod", "CON HP Mod",
    "HP", "Max HP", "AC", "Unarmoured AC", "Attack Bonus",
    "THAC0", "THAC1", "THAC2", "THAC3", "THAC4",
    "THAC5", "THAC6", "THAC7", "THAC8", "THAC9",
    "Death Save", "Wands Save", "Paralysis Save", "Breath Save", "Spells Save",
    "Find Room Trap", "Find Secret Door", "Open Stuck Door", "Listen at Door",
    "Forage", "Hunt",
    "Encounter Movement", "Exporation Movement", "Overland Movement",
    "Level", "XP", "XP for Next Level", "PR XP Bonus",
    "Treasure Encumbrance", "Equipment Encumbrance", "Total Encumbrance",
    "PP", "GP", "EP", "SP", "CP",
}

# Standard encumbrance page 2 fields shared by aac-standard and dac-standard
STANDARD_ENC_CENTERED = {
    "XP", "XP for Next Level", "PR XP Bonus",
    "Treasure Encumbrance", "Equipment Encumbrance", "Total Encumbrance",
    "PP", "GP", "EP", "SP", "CP",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fmt_mod(val: int) -> str:
    if val > 0: return f"+{val}"
    if val < 0: return str(val)
    return ""

def fmt_xp(val) -> str:
    try: return f"{int(val):,}"
    except (ValueError, TypeError): return str(val)

def fmt_skill(val: str) -> str:
    if val == "—" or not val: return ""
    return val.replace("-in-6", "").strip()

def fmt_multiline(items) -> str:
    if isinstance(items, list):
        return "\n".join(i for i in items if i)
    return "\n".join(p.strip() for p in str(items).split(";") if p.strip())

def _fill_fields(writer: PdfWriter, fields: dict, centered: set):
    for page in writer.pages:
        if "/Annots" not in page:
            continue
        for annot_ref in page["/Annots"]:
            annot = annot_ref.get_object()
            field_name = annot.get("/T")
            if field_name and field_name in fields:
                value = str(fields[field_name])
                update = {
                    NameObject("/V"):  TextStringObject(value),
                    NameObject("/DV"): TextStringObject(value),
                }
                if field_name in centered:
                    update[NameObject("/Q")] = NumberObject(1)
                annot.update(update)

def _set_checkbox(writer: PdfWriter, field_name: str, checked: bool):
    try:
        for page in writer.pages:
            if "/Annots" not in page:
                continue
            for annot in page["/Annots"]:
                obj = annot.get_object()
                if obj.get("/T") == field_name:
                    obj.update({
                        NameObject("/V"):  NameObject("/Yes") if checked else NameObject("/Off"),
                        NameObject("/AS"): NameObject("/Yes") if checked else NameObject("/Off"),
                    })
    except Exception:
        pass

def _write(writer: PdfWriter, output_path: str) -> str:
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        writer.write(f)
    return output_path

def _open_sheet(key: tuple) -> PdfWriter:
    reader = PdfReader(SHEET_PATHS[key])
    writer = PdfWriter()
    writer.append(reader)
    writer.set_need_appearances_writer(True)
    return writer


# ---------------------------------------------------------------------------
# Page 1 field builders
# ---------------------------------------------------------------------------

def _p1_aac(c: dict) -> dict:
    """Page 1 fields for AAC sheets (field names with ' 2' suffix)."""
    return {
        "Name 2":           "",
        "Character Class 2": " " + c.get("old_sheet_class", c.get("character_class", "")),
        "Title 2":          " " + c.get("title", ""),
        "Level 2":          str(c.get("level", 1)),
        "Alignment 2":      " " + c.get("alignment", ""),
        "STR 2": str(c.get("str", "")),
        "INT 2": str(c.get("int", "")),
        "WIS 2": str(c.get("wis", "")),
        "DEX 2": str(c.get("dex", "")),
        "CON 2": str(c.get("con", "")),
        "CHA 2": str(c.get("cha", "")),
        "STR Melee Mod":        fmt_mod(c.get("str_melee_mod", 0)),
        "DEX Missile Mod":      fmt_mod(c.get("dex_missile_mod", 0)),
        "DEX AC Mod 2":         fmt_mod(c.get("dex_ac_mod", 0)),
        "Initiative DEX Mod 2": fmt_mod(c.get("dex_initiative_mod", 0)),
        "Reactions CHA Mod 2":  fmt_mod(c.get("cha_npc_reactions", 0)),
        "Magic Save Mod 2":     fmt_mod(c.get("wis_magic_saves", 0)),
        "CON HP Mod 2":         fmt_mod(c.get("con_hp_mod", 0)),
        "HP 2":            str(c.get("hp", "")),
        "Max HP 2":        str(c.get("max_hp", "")),
        "AC 2":            str(c.get("ac", "")),
        "Unarmoured AC 2": str(c.get("unarmoured_ac", "")),
        "Attack Bonus":    fmt_mod(c.get("attack_bonus", 0)),
        "Death Save 2":     str(c.get("save_death", "")),
        "Wands Save 2":     str(c.get("save_wands", "")),
        "Paralysis Save 2": str(c.get("save_paralysis", "")),
        "Breath Save 2":    str(c.get("save_breath", "")),
        "Spells Save 2":    str(c.get("save_spells", "")),
        "Encounter Movement 2":  c.get("encounter_movement", "40'"),
        "Exporation Movement 2": c.get("exploration_movement", "120'"),
        "Overland Movement 2":   c.get("overland_movement", "24"),
        "Find Room Trap 2":   fmt_skill(c.get("find_room_trap", "—")),
        "Find Secret Door 2": fmt_skill(c.get("find_secret_door", "—")),
        "Open Stuck Door 2":  fmt_skill(c.get("open_stuck_door", "—")),
        "Listen at Door 2":   fmt_skill(c.get("listen_at_door", "—")),
        "Languages 2":                  c.get("languages", ""),
        "Abilities, Skills, Weapons 2": fmt_multiline(c.get("abilities", "")),
    }

def _p1_dac(c: dict) -> dict:
    """Page 1 fields for DAC sheets (plain field names, Race/Class split)."""
    fields = {
        "Name":      "",
        "Title":     " " + c.get("title", ""),
        "Race":      " " + c.get("race_field", ""),
        "Class":     (" " + c.get("class_field", "")) if c.get("class_field") else "",
        "Level":     str(c.get("level", 1)),
        "Alignment": " " + c.get("alignment", ""),
        "STR": str(c.get("str", "")),
        "INT": str(c.get("int", "")),
        "WIS": str(c.get("wis", "")),
        "DEX": str(c.get("dex", "")),
        "CON": str(c.get("con", "")),
        "CHA": str(c.get("cha", "")),
        "STR Melee Mod":      fmt_mod(c.get("str_melee_mod", 0)),
        "DEX Missile Mod":    fmt_mod(c.get("dex_missile_mod", 0)),
        "DEX AC Mod":         fmt_mod(c.get("dex_ac_mod", 0)),
        "Initiative DEX Mod": fmt_mod(c.get("dex_initiative_mod", 0)),
        "Reactions CHA Mod":  fmt_mod(c.get("cha_npc_reactions", 0)),
        "Magic Save Mod":     fmt_mod(c.get("wis_magic_saves", 0)),
        "CON HP Mod":         fmt_mod(c.get("con_hp_mod", 0)),
        "HP":            str(c.get("hp", "")),
        "Max HP":        str(c.get("max_hp", "")),
        "AC":            str(c.get("ac", "")),
        "Unarmoured AC": str(c.get("unarmoured_ac", "")),
        "Attack Bonus":  "",  # blank for DAC
        "Death Save":     str(c.get("save_death", "")),
        "Wands Save":     str(c.get("save_wands", "")),
        "Paralysis Save": str(c.get("save_paralysis", "")),
        "Breath Save":    str(c.get("save_breath", "")),
        "Spells Save":    str(c.get("save_spells", "")),
        "Encounter Movement":  c.get("encounter_movement", "40'"),
        "Exporation Movement": c.get("exploration_movement", "120'"),
        "Overland Movement":   c.get("overland_movement", "24"),
        "Find Room Trap":   fmt_skill(c.get("find_room_trap", "—")),
        "Find Secret Door": fmt_skill(c.get("find_secret_door", "—")),
        "Open Stuck Door":  fmt_skill(c.get("open_stuck_door", "—")),
        "Listen at Door":   fmt_skill(c.get("listen_at_door", "—")),
        "Forage": "1",
        "Hunt":   "1",
        "Languages":               c.get("languages", ""),
        "Abilities, Skills, Weapons": fmt_multiline(c.get("abilities", "")),
    }
    # THAC0-9 attack matrix
    for n in range(10):
        fields[f"THAC{n}"] = str(c.get(f"thac{n}", ""))
    return fields


# ---------------------------------------------------------------------------
# Page 2 field builders
# ---------------------------------------------------------------------------

def _p2_item(c: dict, suffix: str = " 2") -> dict:
    """Page 2 fields for item-based encumbrance sheets."""
    fields = {
        f"Notes{suffix}":            fmt_multiline(c.get("notes", "")),
        f"XP{suffix}":               str(c.get("xp", 0)),
        f"XP for Next Level{suffix}": fmt_xp(c.get("xp_next_level", "")),
        f"PR XP Bonus{suffix}":      c.get("pr_xp_bonus", "None"),
        "Unencumbering Items":        ", ".join(c.get("unencumbering", [])),
        # STR threshold headers
        "Packed STR 13+": (
            str(c.get("packed_str_threshold_13", 10))
            if c.get("str", 0) >= 13 else "Insufficient STR Score - Slot Unavailable"
        ),
        "Packed STR 16+": (
            str(c.get("packed_str_threshold_16", 12))
            if c.get("str", 0) >= 16 else "Insufficient STR Score - Slot Unavailable"
        ),
        "Packed STR 18+": (
            str(c.get("packed_str_threshold_18", 14))
            if c.get("str", 0) >= 18 else "Insufficient STR Score - Slot Unavailable"
        ),
    }
    # Equipped slots (up to 9)
    for i, item in enumerate(c.get("equipped", [])[:9], start=1):
        fields[f"Equipped {i}"] = item
    # Packed slots (up to 16) with STR requirements on slots 1-3
    PACKED_STR = {1: 9, 2: 6, 3: 4}
    UNAVAIL = "Insufficient STR Score - Slot Unavailable"
    str_score = c.get("str", 10)
    item_iter = iter(c.get("packed", []))
    for slot in range(1, 17):
        if str_score < PACKED_STR.get(slot, 0):
            fields[f"Packed {slot}"] = UNAVAIL
        else:
            fields[f"Packed {slot}"] = next(item_iter, "")
    return fields

def _p2_standard(c: dict) -> dict:
    """Page 2 fields for standard encumbrance sheets."""
    from src.equipment import WEAPONS, ARMOUR
    equipped = c.get("equipped", [])
    packed = c.get("packed", [])
    unencumbering = c.get("unencumbering", [])

    weapons_armour = [i for i in equipped if i.split(" (")[0] in WEAPONS or i.split(" (")[0] in ARMOUR]
    other_gear = [i for i in equipped if i.split(" (")[0] not in WEAPONS and i.split(" (")[0] not in ARMOUR]
    all_gear = other_gear + packed + unencumbering

    return {
        "Weapons and Armour": fmt_multiline(weapons_armour),
        "Equipment":          fmt_multiline(all_gear),
        "Magic Items":        "",
        "Treasure":           "",
        "Notes":              fmt_multiline(c.get("notes", "")),
        "PP": "", "EP": "", "SP": "", "CP": "",
        "GP": str(c.get("gold_remaining", 0)) if c.get("gold_remaining", 0) > 0 else "",
        "XP":                str(c.get("xp", 0)),
        "XP for Next Level": fmt_xp(c.get("xp_next_level", "")),
        "PR XP Bonus":       c.get("pr_xp_bonus", "None"),
        "Equipment Encumbrance": str(c.get("equipment_cn", "")),
        "Treasure Encumbrance":  str(c.get("treasure_cn", 0)),
        "Total Encumbrance":     str(c.get("total_cn", "")),
    }


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def fill_character_sheet(character: dict, output_path: str) -> str:
    """Fill the correct OSE character sheet PDF and write to output_path."""
    ac_mode  = character.get("ac_mode",  "aac")
    enc_mode = character.get("encumbrance_mode", "item_based")
    key = (ac_mode, enc_mode)

    writer = _open_sheet(key)

    if ac_mode == "aac":
        fields = _p1_aac(character)
        centered = AAC_CENTERED.copy()
        literacy_field = "Literacy 2"
    else:
        fields = _p1_dac(character)
        centered = DAC_CENTERED.copy()
        literacy_field = "Literacy"

    if enc_mode == "item_based":
        suffix = " 2" if ac_mode == "aac" else " 2"  # both item sheets use " 2" suffix on p2
        fields.update(_p2_item(character, suffix=" 2"))
    else:
        fields.update(_p2_standard(character))
        centered |= STANDARD_ENC_CENTERED

    _fill_fields(writer, fields, centered)
    _set_checkbox(writer, literacy_field, character.get("literate", False))
    return _write(writer, output_path)
