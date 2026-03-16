"""PDF form filler for OSE Character Creator.

Uses pypdf to fill the official OSE character sheet form fields.

Two sheet files are used:
  - assets/character-sheet.pdf     — old sheet (AAC + item-based only, fields with " 2" suffix)
  - assets/character-sheet-new.pdf — new sheet (supports DAC + standard encumbrance)

Sheet selection:
  AAC + item_based  → old sheet
  everything else   → new sheet
"""

import os
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject, NumberObject


OLD_SHEET_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "character-sheet.pdf")
NEW_SHEET_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "character-sheet-new.pdf")

# Fields that should be center-aligned on the OLD sheet
OLD_CENTERED_FIELDS = {
    "STR 2", "INT 2", "WIS 2", "DEX 2", "CON 2", "CHA 2",
    "STR Melee Mod", "DEX Missile Mod", "DEX AC Mod 2",
    "Initiative DEX Mod 2", "Reactions CHA Mod 2", "Magic Save Mod 2", "CON HP Mod 2",
    "HP 2", "Max HP 2", "AC 2", "Unarmoured AC 2", "Attack Bonus",
    "Death Save 2", "Wands Save 2", "Paralysis Save 2", "Breath Save 2", "Spells Save 2",
    "Find Room Trap 2", "Find Secret Door 2", "Open Stuck Door 2", "Listen at Door 2",
    "Encounter Movement 2", "Exporation Movement 2", "Overland Movement 2",
    "Level 2",
    "XP 2", "XP for Next Level 2", "PR XP Bonus 2",
}

# Fields that should be center-aligned on the NEW sheet
NEW_CENTERED_FIELDS = {
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
    "Level",
    "XP", "XP for Next Level", "PR XP Bonus",
    "Treasure Encumbrance", "Equipment Encumbrance", "Total Encumbrance",
    "PP", "GP", "EP", "SP", "CP",
}


def fmt_mod(val: int) -> str:
    """Format a modifier as +X or -X. Returns empty string for 0."""
    if val > 0:
        return f"+{val}"
    elif val < 0:
        return str(val)
    return ""


def fmt_xp(val) -> str:
    """Format XP with comma thousands separators."""
    try:
        return f"{int(val):,}"
    except (ValueError, TypeError):
        return str(val)


def fmt_skill(val: str) -> str:
    """Strip '-in-6' suffix. '—' or missing → blank."""
    if val == "—" or not val:
        return ""
    return val.replace("-in-6", "").strip()


def fmt_multiline(items) -> str:
    """Join a list as one entry per line, or split semicolons."""
    if isinstance(items, list):
        return "\n".join(i for i in items if i)
    return "\n".join(p.strip() for p in str(items).split(";") if p.strip())


def fill_character_sheet(character: dict, output_path: str) -> str:
    """
    Fill the appropriate OSE character sheet PDF with character data.
    Sheet is chosen based on ac_mode + encumbrance_mode in the character dict.
    Returns the path to the filled PDF.
    """
    ac_mode = character.get("ac_mode", "aac")
    encumbrance_mode = character.get("encumbrance_mode", "item_based")

    use_new_sheet = not (ac_mode == "aac" and encumbrance_mode == "item_based")

    if use_new_sheet:
        return _fill_new_sheet(character, output_path)
    else:
        return _fill_old_sheet(character, output_path)


# ---------------------------------------------------------------------------
# OLD SHEET  (AAC + item-based — existing behaviour, unchanged)
# ---------------------------------------------------------------------------

def _fill_old_sheet(character: dict, output_path: str) -> str:
    reader = PdfReader(OLD_SHEET_PATH)
    writer = PdfWriter()
    writer.append(reader)
    writer.set_need_appearances_writer(True)

    fields = {
        # Identity — leading space prevents text cramming against label
        "Name 2":            "",
        "Character Class 2": " " + character.get("old_sheet_class", character.get("character_class", "")),
        "Title 2":           " " + character.get("title", ""),
        "Level 2":           str(character.get("level", 1)),
        "Alignment 2":       " " + character.get("alignment", ""),

        # Ability Scores
        "STR 2": str(character.get("str", "")),
        "INT 2": str(character.get("int", "")),
        "WIS 2": str(character.get("wis", "")),
        "DEX 2": str(character.get("dex", "")),
        "CON 2": str(character.get("con", "")),
        "CHA 2": str(character.get("cha", "")),

        # Modifiers
        "STR Melee Mod":        fmt_mod(character.get("str_melee_mod", 0)),
        "DEX Missile Mod":      fmt_mod(character.get("dex_missile_mod", 0)),
        "DEX AC Mod 2":         fmt_mod(character.get("dex_ac_mod", 0)),
        "Initiative DEX Mod 2": fmt_mod(character.get("dex_initiative_mod", 0)),
        "Reactions CHA Mod 2":  fmt_mod(character.get("cha_npc_reactions", 0)),
        "Magic Save Mod 2":     fmt_mod(character.get("wis_magic_saves", 0)),
        "CON HP Mod 2":         fmt_mod(character.get("con_hp_mod", 0)),

        # Combat
        "HP 2":            str(character.get("hp", "")),
        "Max HP 2":        str(character.get("max_hp", "")),
        "AC 2":            str(character.get("ac", "")),
        "Unarmoured AC 2": str(character.get("unarmoured_ac", "")),
        "Attack Bonus":    fmt_mod(character.get("attack_bonus", 0)),

        # Saves
        "Death Save 2":     str(character.get("save_death", "")),
        "Wands Save 2":     str(character.get("save_wands", "")),
        "Paralysis Save 2": str(character.get("save_paralysis", "")),
        "Breath Save 2":    str(character.get("save_breath", "")),
        "Spells Save 2":    str(character.get("save_spells", "")),

        # Movement
        "Encounter Movement 2":  character.get("encounter_movement", "40'"),
        "Exporation Movement 2": character.get("exploration_movement", "120'"),
        "Overland Movement 2":   character.get("overland_movement", "24"),

        # Skills
        "Find Room Trap 2":   fmt_skill(character.get("find_room_trap", "—")),
        "Find Secret Door 2": fmt_skill(character.get("find_secret_door", "—")),
        "Open Stuck Door 2":  fmt_skill(character.get("open_stuck_door", "—")),
        "Listen at Door 2":   fmt_skill(character.get("listen_at_door", "—")),

        # Text fields
        "Languages 2":                   character.get("languages", ""),
        "Abilities, Skills, Weapons 2":  fmt_multiline(character.get("abilities", "")),
        "Notes 2":                       fmt_multiline(character.get("notes", "")),

        # XP
        "XP 2":                str(character.get("xp", 0)),
        "XP for Next Level 2": fmt_xp(character.get("xp_next_level", "")),
        "PR XP Bonus 2":       character.get("pr_xp_bonus", "None"),

        # Item-Based Encumbrance — STR threshold header slots
        "Packed STR 13+": (
            str(character.get("packed_str_threshold_13", 10))
            if character.get("str", 0) >= 13
            else "Insufficient STR Score - Slot Unavailable"
        ),
        "Packed STR 16+": (
            str(character.get("packed_str_threshold_16", 12))
            if character.get("str", 0) >= 16
            else "Insufficient STR Score - Slot Unavailable"
        ),
        "Packed STR 18+": (
            str(character.get("packed_str_threshold_18", 14))
            if character.get("str", 0) >= 18
            else "Insufficient STR Score - Slot Unavailable"
        ),

        # Unencumbering items
        "Unencumbering Items": ", ".join(character.get("unencumbering", [])),
    }

    # Equipped slots (up to 9)
    equipped = character.get("equipped", [])
    for i, item in enumerate(equipped[:9], start=1):
        fields[f"Equipped {i}"] = item

    # Packed slots (up to 16) — slots 1-3 have STR requirements
    PACKED_STR_REQUIREMENTS = {1: 9, 2: 6, 3: 4}
    UNAVAILABLE = "Insufficient STR Score - Slot Unavailable"
    str_score = character.get("str", 10)
    packed = character.get("packed", [])
    item_iter = iter(packed)
    for slot in range(1, 17):
        min_str = PACKED_STR_REQUIREMENTS.get(slot, 0)
        if str_score < min_str:
            fields[f"Packed {slot}"] = UNAVAILABLE
        else:
            fields[f"Packed {slot}"] = next(item_iter, "")

    _fill_fields(writer, fields, OLD_CENTERED_FIELDS)
    _set_checkbox(writer, "Literacy 2", character.get("literate", False))

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        writer.write(f)
    return output_path


# ---------------------------------------------------------------------------
# NEW SHEET  (DAC or standard encumbrance)
# ---------------------------------------------------------------------------

def _fill_new_sheet(character: dict, output_path: str) -> str:
    ac_mode = character.get("ac_mode", "aac")
    encumbrance_mode = character.get("encumbrance_mode", "item_based")

    reader = PdfReader(NEW_SHEET_PATH)
    writer = PdfWriter()
    writer.append(reader)
    writer.set_need_appearances_writer(True)

    # --- Page 1 fields ---
    fields = {
        # Identity
        "Name":      "",
        "Title":     " " + character.get("title", ""),
        "Race":      " " + character.get("race_field", ""),
        "Class":     (" " + character.get("class_field", "")) if character.get("class_field") else "",
        "Level":     str(character.get("level", 1)),
        "Alignment": " " + character.get("alignment", ""),

        # Ability Scores
        "STR": str(character.get("str", "")),
        "INT": str(character.get("int", "")),
        "WIS": str(character.get("wis", "")),
        "DEX": str(character.get("dex", "")),
        "CON": str(character.get("con", "")),
        "CHA": str(character.get("cha", "")),

        # Modifiers
        "STR Melee Mod":     fmt_mod(character.get("str_melee_mod", 0)),
        "DEX Missile Mod":   fmt_mod(character.get("dex_missile_mod", 0)),
        "DEX AC Mod":        fmt_mod(character.get("dex_ac_mod", 0)),
        "Initiative DEX Mod": fmt_mod(character.get("dex_initiative_mod", 0)),
        "Reactions CHA Mod": fmt_mod(character.get("cha_npc_reactions", 0)),
        "Magic Save Mod":    fmt_mod(character.get("wis_magic_saves", 0)),
        "CON HP Mod":        fmt_mod(character.get("con_hp_mod", 0)),

        # Combat
        "HP":            str(character.get("hp", "")),
        "Max HP":        str(character.get("max_hp", "")),
        "AC":            str(character.get("ac", "")),
        "Unarmoured AC": str(character.get("unarmoured_ac", "")),

        # Saves
        "Death Save":     str(character.get("save_death", "")),
        "Wands Save":     str(character.get("save_wands", "")),
        "Paralysis Save": str(character.get("save_paralysis", "")),
        "Breath Save":    str(character.get("save_breath", "")),
        "Spells Save":    str(character.get("save_spells", "")),

        # Movement
        "Encounter Movement":  character.get("encounter_movement", "40'"),
        "Exporation Movement": character.get("exploration_movement", "120'"),  # typo in PDF kept as-is
        "Overland Movement":   character.get("overland_movement", "24"),

        # Skills
        "Find Room Trap":   fmt_skill(character.get("find_room_trap", "—")),
        "Find Secret Door": fmt_skill(character.get("find_secret_door", "—")),
        "Open Stuck Door":  fmt_skill(character.get("open_stuck_door", "—")),
        "Listen at Door":   fmt_skill(character.get("listen_at_door", "—")),
        "Forage":           "1",  # default 1-in-6 for all
        "Hunt":             "1",  # default 1-in-6 for all

        # Text fields
        "Languages":               character.get("languages", ""),
        "Abilities, Skills, Weapons": fmt_multiline(character.get("abilities", "")),
    }

    # AC mode: fill either Attack Bonus or THAC0-9
    if ac_mode == "dac":
        fields["Attack Bonus"] = ""
        for n in range(10):
            fields[f"THAC{n}"] = str(character.get(f"thac{n}", ""))
    else:
        fields["Attack Bonus"] = fmt_mod(character.get("attack_bonus", 0))
        for n in range(10):
            fields[f"THAC{n}"] = ""

    # --- Page 2 fields (equipment / encumbrance) ---
    # For both standard and item_based on the new sheet, we use the free-form
    # text boxes. Item-based gear is listed the same way; encumbrance weight
    # fields are left blank for item_based mode.
    equipped = character.get("equipped", [])
    packed = character.get("packed", [])
    unencumbering = character.get("unencumbering", [])

    # Split equipped into weapons/armour vs the rest
    from src.equipment import WEAPONS, ARMOUR
    weapons_armour_items = [i for i in equipped if i.split(" (")[0] in WEAPONS or i.split(" (")[0] in ARMOUR]
    # Everything that isn't a weapon or armour piece goes to Equipment
    other_equipped = [i for i in equipped if i.split(" (")[0] not in WEAPONS and i.split(" (")[0] not in ARMOUR]
    all_gear = other_equipped + packed + unencumbering

    fields["Weapons and Armour"] = fmt_multiline(weapons_armour_items)
    fields["Equipment"]          = fmt_multiline(all_gear)
    fields["Magic Items"]        = ""
    fields["Treasure"]           = ""
    fields["Notes"]              = fmt_multiline(character.get("notes", ""))

    # Coins — blank at char gen (remaining gold goes in Notes)
    for coin in ("PP", "GP", "EP", "SP", "CP"):
        fields[coin] = ""

    # XP
    fields["XP"]              = str(character.get("xp", 0))
    fields["XP for Next Level"] = fmt_xp(character.get("xp_next_level", ""))
    fields["PR XP Bonus"]     = character.get("pr_xp_bonus", "None")

    # Encumbrance weight fields
    if encumbrance_mode == "standard":
        fields["Equipment Encumbrance"] = str(character.get("equipment_cn", ""))
        fields["Treasure Encumbrance"]  = str(character.get("treasure_cn", 0))
        fields["Total Encumbrance"]     = str(character.get("total_cn", ""))
    else:
        # item_based on new sheet — leave weight fields blank
        fields["Equipment Encumbrance"] = ""
        fields["Treasure Encumbrance"]  = ""
        fields["Total Encumbrance"]     = ""

    _fill_fields(writer, fields, NEW_CENTERED_FIELDS)
    _set_checkbox(writer, "Literacy", character.get("literate", False))

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        writer.write(f)
    return output_path


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _fill_fields(writer: PdfWriter, fields: dict, centered_fields: set):
    """Fill all text/select form fields. Centred fields get /Q = 1."""
    for page in writer.pages:
        if "/Annots" not in page:
            continue
        for annot_ref in page["/Annots"]:
            annot = annot_ref.get_object()
            field_name = annot.get("/T")
            if field_name and field_name in fields:
                value = str(fields[field_name])
                update = {
                    NameObject("/V"): TextStringObject(value),
                    NameObject("/DV"): TextStringObject(value),
                }
                if field_name in centered_fields:
                    update[NameObject("/Q")] = NumberObject(1)
                annot.update(update)


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
                        NameObject("/V"):  NameObject("/Yes") if checked else NameObject("/Off"),
                        NameObject("/AS"): NameObject("/Yes") if checked else NameObject("/Off"),
                    })
    except Exception:
        pass  # Non-fatal
