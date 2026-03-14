"""Ability score modifier lookups for OSE Character Creator."""

# Strength modifiers
STR_MODIFIERS = {
    3: {"melee": -3, "open_doors": 1},
    4: {"melee": -2, "open_doors": 1},
    5: {"melee": -2, "open_doors": 1},
    6: {"melee": -1, "open_doors": 1},
    7: {"melee": -1, "open_doors": 1},
    8: {"melee": -1, "open_doors": 1},
    9: {"melee": 0, "open_doors": 2},
    10: {"melee": 0, "open_doors": 2},
    11: {"melee": 0, "open_doors": 2},
    12: {"melee": 0, "open_doors": 2},
    13: {"melee": 1, "open_doors": 3},
    14: {"melee": 1, "open_doors": 3},
    15: {"melee": 1, "open_doors": 3},
    16: {"melee": 2, "open_doors": 4},
    17: {"melee": 2, "open_doors": 4},
    18: {"melee": 3, "open_doors": 5},
}


def str_modifier(score: int) -> dict:
    """Get STR modifiers for a score."""
    return STR_MODIFIERS.get(score, {"melee": 0, "open_doors": 2})


# Intelligence modifiers
INT_MODIFIERS = {
    3: {"languages": 0, "literacy": "Illiterate"},
    4: {"languages": 0, "literacy": "Illiterate"},
    5: {"languages": 0, "literacy": "Illiterate"},
    6: {"languages": 0, "literacy": "Basic"},
    7: {"languages": 0, "literacy": "Basic"},
    8: {"languages": 0, "literacy": "Basic"},
    9: {"languages": 0, "literacy": "Literate"},
    10: {"languages": 0, "literacy": "Literate"},
    11: {"languages": 0, "literacy": "Literate"},
    12: {"languages": 0, "literacy": "Literate"},
    13: {"languages": 1, "literacy": "Literate"},
    14: {"languages": 1, "literacy": "Literate"},
    15: {"languages": 1, "literacy": "Literate"},
    16: {"languages": 2, "literacy": "Literate"},
    17: {"languages": 2, "literacy": "Literate"},
    18: {"languages": 3, "literacy": "Literate"},
}


def int_modifier(score: int) -> dict:
    """Get INT modifiers for a score."""
    return INT_MODIFIERS.get(score, {"languages": 0, "literacy": "Literate"})


# Wisdom modifiers
WIS_MODIFIERS = {
    3: {"magic_saves": -3},
    4: {"magic_saves": -2},
    5: {"magic_saves": -2},
    6: {"magic_saves": -1},
    7: {"magic_saves": -1},
    8: {"magic_saves": -1},
    9: {"magic_saves": 0},
    10: {"magic_saves": 0},
    11: {"magic_saves": 0},
    12: {"magic_saves": 0},
    13: {"magic_saves": 1},
    14: {"magic_saves": 1},
    15: {"magic_saves": 1},
    16: {"magic_saves": 2},
    17: {"magic_saves": 2},
    18: {"magic_saves": 3},
}


def wis_modifier(score: int) -> dict:
    """Get WIS modifiers for a score."""
    return WIS_MODIFIERS.get(score, {"magic_saves": 0})


# Dexterity modifiers
DEX_MODIFIERS = {
    3: {"ac": -3, "missile": -3, "initiative": -2},
    4: {"ac": -2, "missile": -2, "initiative": -1},
    5: {"ac": -2, "missile": -2, "initiative": -1},
    6: {"ac": -1, "missile": -1, "initiative": -1},
    7: {"ac": -1, "missile": -1, "initiative": -1},
    8: {"ac": -1, "missile": -1, "initiative": -1},
    9: {"ac": 0, "missile": 0, "initiative": 0},
    10: {"ac": 0, "missile": 0, "initiative": 0},
    11: {"ac": 0, "missile": 0, "initiative": 0},
    12: {"ac": 0, "missile": 0, "initiative": 0},
    13: {"ac": 1, "missile": 1, "initiative": 1},
    14: {"ac": 1, "missile": 1, "initiative": 1},
    15: {"ac": 1, "missile": 1, "initiative": 1},
    16: {"ac": 2, "missile": 2, "initiative": 1},
    17: {"ac": 2, "missile": 2, "initiative": 1},
    18: {"ac": 3, "missile": 3, "initiative": 2},
}


def dex_modifier(score: int) -> dict:
    """Get DEX modifiers for a score."""
    return DEX_MODIFIERS.get(score, {"ac": 0, "missile": 0, "initiative": 0})


# Constitution modifiers
CON_MODIFIERS = {
    3: {"hp": -3},
    4: {"hp": -2},
    5: {"hp": -2},
    6: {"hp": -1},
    7: {"hp": -1},
    8: {"hp": -1},
    9: {"hp": 0},
    10: {"hp": 0},
    11: {"hp": 0},
    12: {"hp": 0},
    13: {"hp": 1},
    14: {"hp": 1},
    15: {"hp": 1},
    16: {"hp": 2},
    17: {"hp": 2},
    18: {"hp": 3},
}


def con_modifier(score: int) -> dict:
    """Get CON modifiers for a score."""
    return CON_MODIFIERS.get(score, {"hp": 0})


# Charisma modifiers
CHA_MODIFIERS = {
    3: {"npc_reactions": -2, "max_retainers": 1, "loyalty": 4},
    4: {"npc_reactions": -1, "max_retainers": 2, "loyalty": 5},
    5: {"npc_reactions": -1, "max_retainers": 2, "loyalty": 5},
    6: {"npc_reactions": -1, "max_retainers": 3, "loyalty": 6},
    7: {"npc_reactions": -1, "max_retainers": 3, "loyalty": 6},
    8: {"npc_reactions": -1, "max_retainers": 3, "loyalty": 6},
    9: {"npc_reactions": 0, "max_retainers": 4, "loyalty": 7},
    10: {"npc_reactions": 0, "max_retainers": 4, "loyalty": 7},
    11: {"npc_reactions": 0, "max_retainers": 4, "loyalty": 7},
    12: {"npc_reactions": 0, "max_retainers": 4, "loyalty": 7},
    13: {"npc_reactions": 1, "max_retainers": 5, "loyalty": 8},
    14: {"npc_reactions": 1, "max_retainers": 5, "loyalty": 8},
    15: {"npc_reactions": 1, "max_retainers": 5, "loyalty": 8},
    16: {"npc_reactions": 1, "max_retainers": 6, "loyalty": 9},
    17: {"npc_reactions": 1, "max_retainers": 6, "loyalty": 9},
    18: {"npc_reactions": 2, "max_retainers": 7, "loyalty": 10},
}


def cha_modifier(score: int) -> dict:
    """Get CHA modifiers for a score."""
    return CHA_MODIFIERS.get(score, {"npc_reactions": 0, "max_retainers": 4, "loyalty": 7})


# Prime requisite XP modifiers
PRIME_REQUISITE_XP = {
    3: "-20%",
    4: "-20%",
    5: "-20%",
    6: "-10%",
    7: "-10%",
    8: "-10%",
    9: "None",
    10: "None",
    11: "None",
    12: "None",
    13: "+5%",
    14: "+5%",
    15: "+5%",
    16: "+10%",
    17: "+10%",
    18: "+10%",
}


def prime_requisite_xp_modifier(score: int) -> str:
    """Get prime requisite XP modifier as string."""
    return PRIME_REQUISITE_XP.get(score, "None")
