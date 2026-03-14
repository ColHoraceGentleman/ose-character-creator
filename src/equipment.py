"""Equipment lists and auto-kit builder for OSE Character Creator.
Uses Item-Based Encumbrance (OSE Carrion Crawler #2).
- Higher item count = slower movement
- STR modifier shifts packed item thresholds
- Unencumbering items (tiny items) don't count toward movement
"""

# Encumbrance item counts (OSE CC2 Item-Based Encumbrance)
# 0 = not encumbering (tiny items like garlic, holy symbols, rings)
# 1 = one-handed item
# 2 = two-handed item
# Special: "storage" = only counts when not in use (backpacks, sacks)

ADVENTURING_GEAR = {
    "Backpack":        {"cost": 5,  "encumbrance": "storage"},  # Only counts when not in use
    "Crowbar":         {"cost": 10, "encumbrance": 1},
    "Garlic":          {"cost": 5,  "encumbrance": 0},  # Tiny
    "Grappling hook":  {"cost": 25, "encumbrance": 1},
    "Hammer (small)":  {"cost": 2,  "encumbrance": 1},
    "Holy symbol":     {"cost": 25, "encumbrance": 0},  # Tiny
    "Holy water (vial)": {"cost": 25, "encumbrance": 1},
    "Iron spikes (12)": {"cost": 1, "encumbrance": 1},
    "Lantern":         {"cost": 10, "encumbrance": 1},
    "Mirror (hand-sized, steel)": {"cost": 5, "encumbrance": 1},
    "Oil (1 flask)":   {"cost": 2,  "encumbrance": 1},
    "Pole (10' long, wooden)": {"cost": 1, "encumbrance": 2},  # Two-handed
    "Rations (iron, 7 days)": {"cost": 15, "encumbrance": 1},  # Bundle of 3 = 1 item
    "Rations (standard, 7 days)": {"cost": 5, "encumbrance": 1},  # Bundle of 3 = 1 item
    "Rope (50')":      {"cost": 1,  "encumbrance": 1},
    "Sack (small)":    {"cost": 1,  "encumbrance": "storage"},
    "Sack (large)":    {"cost": 2,  "encumbrance": "storage"},
    "Stakes (3) and mallet": {"cost": 3, "encumbrance": 2},  # Bundle
    "Thieves' tools":  {"cost": 25, "encumbrance": 1},
    "Tinder box":      {"cost": 3,  "encumbrance": 1},
    "Torches (6)":     {"cost": 1,  "encumbrance": 2},  # Bundle of 6 = 2 items
    "Waterskin":       {"cost": 1,  "encumbrance": 1},
    "Wine (2 pints)":  {"cost": 1,  "encumbrance": 1},
    "Wolfsbane (1 bunch)": {"cost": 10, "encumbrance": 1},
}

WEAPONS = {
    "Battle axe":       {"cost": 7,  "damage": "1d8", "qualities": ["Melee", "Slow", "Two-handed"], "encumbrance": 2},
    "Club":             {"cost": 3,  "damage": "1d4", "qualities": ["Blunt", "Melee"], "encumbrance": 1},
    "Crossbow":         {"cost": 30, "damage": "1d6", "qualities": ["Missile", "Reload", "Slow", "Two-handed"], "encumbrance": 2},
    "Dagger":           {"cost": 3,  "damage": "1d4", "qualities": ["Melee", "Missile"], "encumbrance": 1},
    "Hand axe":         {"cost": 4,  "damage": "1d6", "qualities": ["Melee", "Missile"], "encumbrance": 1},
    "Javelin":          {"cost": 1,  "damage": "1d4", "qualities": ["Missile"], "encumbrance": 1},
    "Lance":            {"cost": 5,  "damage": "1d6", "qualities": ["Charge", "Melee"], "encumbrance": 2},
    "Long bow":         {"cost": 40, "damage": "1d6", "qualities": ["Missile", "Two-handed"], "encumbrance": 2},
    "Mace":             {"cost": 5,  "damage": "1d6", "qualities": ["Blunt", "Melee"], "encumbrance": 1},
    "Polearm":          {"cost": 7,  "damage": "1d10","qualities": ["Brace", "Melee", "Slow", "Two-handed"], "encumbrance": 2},
    "Short bow":        {"cost": 25, "damage": "1d6", "qualities": ["Missile", "Two-handed"], "encumbrance": 2},
    "Short sword":      {"cost": 7,  "damage": "1d6", "qualities": ["Melee"], "encumbrance": 1},
    "Silver dagger":    {"cost": 30, "damage": "1d4", "qualities": ["Melee", "Missile"], "encumbrance": 1},
    "Sling":            {"cost": 2,  "damage": "1d4", "qualities": ["Blunt", "Missile"], "encumbrance": 1},
    "Spear":            {"cost": 4,  "damage": "1d6", "qualities": ["Brace", "Melee", "Missile"], "encumbrance": 1},
    "Staff":            {"cost": 2,  "damage": "1d4", "qualities": ["Blunt", "Melee", "Slow", "Two-handed"], "encumbrance": 2},
    "Sword":            {"cost": 10, "damage": "1d8", "qualities": ["Melee"], "encumbrance": 1},
    "Two-handed sword": {"cost": 15, "damage": "1d10","qualities": ["Melee", "Slow", "Two-handed"], "encumbrance": 2},
    "Warhammer":        {"cost": 5,  "damage": "1d6", "qualities": ["Blunt", "Melee"], "encumbrance": 1},
}

ARMOUR = {
    "Leather":    {"aac": 12, "cost": 20, "encumbrance": 1},  # Light armour = 1 item
    "Chainmail":  {"aac": 14, "cost": 40, "encumbrance": 2},  # Heavy armour = 2 items
    "Plate mail": {"aac": 16, "cost": 60, "encumbrance": 2},  # Heavy armour = 2 items
    "Shield":     {"aac_bonus": 1, "cost": 10, "encumbrance": 1},
}
# ⚠️ This project uses the OPTIONAL ASCENDING ARMOUR CLASS (AAC) system.
# (OSE Classic p. 32) Higher AAC = better protection. Unarmoured base = 10.
# Descending AC values are NOT used anywhere.

# Weapons allowed per class (by tag)
CLASS_WEAPON_RULES = {
    "Cleric":      {"allowed_qualities": ["Blunt"], "excluded": ["Long bow", "Two-handed sword", "Battle axe", "Polearm"]},
    "Dwarf":       {"allowed_qualities": ["any"], "excluded": ["Long bow", "Two-handed sword", "Polearm"]},
    "Elf":         {"allowed_qualities": ["any"], "excluded": []},
    "Fighter":     {"allowed_qualities": ["any"], "excluded": []},
    "Halfling":    {"allowed_qualities": ["any"], "excluded": ["Long bow", "Two-handed sword", "Polearm", "Lance"]},
    "Magic-User":  {"allowed_qualities": ["any"], "only": ["Dagger"]},
    "Thief":       {"allowed_qualities": ["any"], "excluded": []},
}

# Armour allowed per class
CLASS_ARMOUR_RULES = {
    "Cleric":      {"can_wear": ["Leather", "Chainmail", "Plate mail"], "can_use_shield": True},
    "Dwarf":       {"can_wear": ["Leather", "Chainmail", "Plate mail"], "can_use_shield": True},
    "Elf":         {"can_wear": ["Leather", "Chainmail", "Plate mail"], "can_use_shield": True},
    "Fighter":     {"can_wear": ["Leather", "Chainmail", "Plate mail"], "can_use_shield": True},
    "Halfling":    {"can_wear": ["Leather", "Chainmail", "Plate mail"], "can_use_shield": True},
    "Magic-User":  {"can_wear": [], "can_use_shield": False},
    "Thief":       {"can_wear": ["Leather"], "can_use_shield": False},
}

# Class essentials that must be purchased first
CLASS_ESSENTIALS = {
    "Cleric":     ["Holy symbol"],
    "Dwarf":      [],
    "Elf":        [],
    "Fighter":    [],
    "Halfling":   [],
    "Magic-User": [],
    "Thief":      ["Thieves' tools"],
}

# Standard adventuring items to round out a kit (in priority order)
STANDARD_KIT_ITEMS = [
    "Backpack",
    "Torches (6)",
    "Tinder box",
    "Rations (standard, 7 days)",
    "Waterskin",
    "Rope (50')",
    "Oil (1 flask)",
    "Iron spikes (12)",
    "Sack (large)",
]


def get_allowed_weapons(char_class: str) -> list:
    """Return list of allowed weapon names for a class."""
    rules = CLASS_WEAPON_RULES[char_class]
    if "only" in rules:
        return rules["only"]
    excluded = rules.get("excluded", [])
    if "Blunt" in rules.get("allowed_qualities", []):
        return [w for w, d in WEAPONS.items() if "Blunt" in d["qualities"] and w not in excluded]
    return [w for w in WEAPONS if w not in excluded]


def best_affordable_shield(char_class: str, gold: int):
    """Return shield cost if class can use shield and gold allows, else 0."""
    if CLASS_ARMOUR_RULES[char_class]["can_use_shield"] and gold >= 10:
        return 10
    return 0


def best_affordable_armour(char_class: str, gold: int) -> tuple:
    """Return (armour_name, cost) for best armour affordable, or (None, 0)."""
    allowed = CLASS_ARMOUR_RULES[char_class]["can_wear"]
    # Sort by AAC descending (higher = better)
    options = sorted(
        [(name, ARMOUR[name]) for name in allowed if ARMOUR[name]["cost"] <= gold],
        key=lambda x: x[1]["aac"],
        reverse=True  # Higher AAC = better protection
    )
    if options:
        name, data = options[0]
        return name, data["cost"]
    return None, 0


def best_affordable_weapon(char_class: str, gold: int) -> tuple:
    """Return (weapon_name, cost) for best weapon affordable, by damage die then cost."""
    allowed = get_allowed_weapons(char_class)
    damage_rank = {"1d4": 1, "1d6": 2, "1d8": 3, "1d10": 4}
    options = sorted(
        [(w, WEAPONS[w]) for w in allowed if WEAPONS[w]["cost"] <= gold],
        key=lambda x: (-damage_rank.get(x[1]["damage"], 0), x[1]["cost"])
    )
    if options:
        name, data = options[0]
        return name, data["cost"]
    return None, 0


def item_encumbrance(item_name: str, in_use: bool = True) -> int:
    """
    Return the encumbrance item count for a single item.
    - in_use=True: containers (backpack, sacks) are being worn/carried with gear, so they don't add to count.
    - in_use=False: containers not in use count as 1 item each.
    - Returns 0 for tiny/non-encumbering items (garlic, holy symbol, etc.)
    """
    if item_name in WEAPONS:
        return WEAPONS[item_name].get("encumbrance", 1)
    if item_name in ARMOUR:
        return ARMOUR[item_name].get("encumbrance", 1)
    if item_name in ADVENTURING_GEAR:
        enc = ADVENTURING_GEAR[item_name].get("encumbrance", 1)
        if enc == "storage":
            return 0 if in_use else 1
        return enc
    return 1  # Default: unknown items count as 1


def count_encumbrance(items: list, containers_in_use: bool = True) -> int:
    """Sum encumbrance item counts for a list of item names."""
    return sum(item_encumbrance(i, in_use=containers_in_use) for i in items)


# Item-Based Encumbrance movement rate table (OSE Carrion Crawler #2).
# Equipped and packed counts are checked independently; the slower rate is used.
# STR melee modifier shifts the packed thresholds.
#
# Equipped:   0-3 → 120', 4-5 → 90', 6-7 → 60', 8-9 → 30', 10+ → 0
# Packed:    0-10 → 120', 11-12 → 90', 13-14 → 60', 15-16 → 30', 17+ → 0
# (Packed thresholds each shift up by the character's STR melee modifier.)

ENCUMBRANCE_TABLE = [
    # (max_equipped, max_packed_base, movement_exploration, movement_encounter, movement_overland)
    (3,  10, "120'", "40'",  "24"),
    (5,  12, "90'",  "30'",  "18"),
    (7,  14, "60'",  "20'",  "12"),
    (9,  16, "30'",  "10'",  "6"),
]
# Beyond 9 equipped or 16 packed → cannot move


def calculate_movement(equipped_items: list, packed_items: list, str_melee_mod: int = 0) -> dict:
    """
    Calculate movement rates from item-based encumbrance.
    Returns dict with exploration, encounter, overland, base_mv, and item counts.

    STR melee modifier shifts packed thresholds up (positive STR = carry more before slowing).
    Both equipped and packed are checked; the slower rate is used.
    """
    eq_count = count_encumbrance(equipped_items, containers_in_use=True)
    pk_count = count_encumbrance(packed_items, containers_in_use=True)

    def rate_for_equipped(count):
        for max_eq, _, mv_ex, mv_en, mv_ov in ENCUMBRANCE_TABLE:
            if count <= max_eq:
                return (mv_ex, mv_en, mv_ov)
        return ("0'", "0'", "0")

    def rate_for_packed(count, str_mod):
        for _, max_pk_base, mv_ex, mv_en, mv_ov in ENCUMBRANCE_TABLE:
            if count <= max_pk_base + str_mod:
                return (mv_ex, mv_en, mv_ov)
        return ("0'", "0'", "0")

    eq_rate = rate_for_equipped(eq_count)
    pk_rate = rate_for_packed(pk_count, str_melee_mod)

    # Movement values in feet (strip the ')
    def mv_val(s):
        return int(s.replace("'", "")) if s != "0" else 0

    # Use the slower of the two rates
    if mv_val(eq_rate[0]) <= mv_val(pk_rate[0]):
        chosen = eq_rate
    else:
        chosen = pk_rate

    return {
        "exploration_movement": chosen[0],
        "encounter_movement": chosen[1],
        "overland_movement": chosen[2],
        "equipped_item_count": eq_count,
        "packed_item_count": pk_count,
    }


def auto_kit(char_class: str, gold: int) -> dict:
    """
    Build an auto equipment kit for the given class and starting gold.

    Returns dict with keys:
      equipped (list), packed (list), unencumbering (list),
      gold_spent (int), gold_remaining (int).

    Tiny/non-encumbering items (holy symbol, garlic, etc.) are placed in
    'unencumbering' so they can be listed in the PDF's Unencumbering Items field.
    """
    equipped = []
    packed = []
    unencumbering = []
    spent = 0

    def buy(item_name, cost, location):
        nonlocal spent
        spent += cost
        enc = item_encumbrance(item_name, in_use=True)
        if enc == 0:
            unencumbering.append(item_name)
        elif location == "equipped":
            equipped.append(item_name)
        else:
            packed.append(item_name)
        return gold - spent

    remaining = gold

    # Step 1: Class essentials
    for item in CLASS_ESSENTIALS[char_class]:
        cost = ADVENTURING_GEAR[item]["cost"]
        if remaining >= cost:
            remaining = buy(item, cost, "packed")

    # Step 2: Best armour (equipped)
    armour_name, armour_cost = best_affordable_armour(char_class, remaining)
    if armour_name:
        remaining = buy(armour_name, armour_cost, "equipped")
        # Shield if allowed and affordable
        if CLASS_ARMOUR_RULES[char_class]["can_use_shield"] and remaining >= 10:
            remaining = buy("Shield", 10, "equipped")

    # Step 3: Best weapon (equipped)
    weapon_name, weapon_cost = best_affordable_weapon(char_class, remaining)
    if weapon_name:
        remaining = buy(weapon_name, weapon_cost, "equipped")

    # Step 4: Standard kit items (packed), in priority order
    for item in STANDARD_KIT_ITEMS:
        cost = ADVENTURING_GEAR[item]["cost"]
        if remaining >= cost and item not in packed and item not in equipped and item not in unencumbering:
            remaining = buy(item, cost, "packed")

    return {
        "equipped": equipped,
        "packed": packed,
        "unencumbering": unencumbering,
        "gold_spent": spent,
        "gold_remaining": remaining,
    }
