"""Equipment lists and auto-kit builder for OSE Character Creator."""

ADVENTURING_GEAR = {
    "Backpack": 5,
    "Crowbar": 10,
    "Garlic": 5,
    "Grappling hook": 25,
    "Hammer (small)": 2,
    "Holy symbol": 25,
    "Holy water (vial)": 25,
    "Iron spikes (12)": 1,
    "Lantern": 10,
    "Mirror (hand-sized, steel)": 5,
    "Oil (1 flask)": 2,
    "Pole (10' long, wooden)": 1,
    "Rations (iron, 7 days)": 15,
    "Rations (standard, 7 days)": 5,
    "Rope (50')": 1,
    "Sack (small)": 1,
    "Sack (large)": 2,
    "Stakes (3) and mallet": 3,
    "Thieves' tools": 25,
    "Tinder box": 3,
    "Torches (6)": 1,
    "Waterskin": 1,
    "Wine (2 pints)": 1,
    "Wolfsbane (1 bunch)": 10,
}

WEAPONS = {
    "Battle axe":       {"cost": 7,  "damage": "1d8", "qualities": ["Melee", "Slow", "Two-handed"]},
    "Club":             {"cost": 3,  "damage": "1d4", "qualities": ["Blunt", "Melee"]},
    "Crossbow":         {"cost": 30, "damage": "1d6", "qualities": ["Missile", "Reload", "Slow", "Two-handed"]},
    "Dagger":           {"cost": 3,  "damage": "1d4", "qualities": ["Melee", "Missile"]},
    "Hand axe":         {"cost": 4,  "damage": "1d6", "qualities": ["Melee", "Missile"]},
    "Javelin":          {"cost": 1,  "damage": "1d4", "qualities": ["Missile"]},
    "Lance":            {"cost": 5,  "damage": "1d6", "qualities": ["Charge", "Melee"]},
    "Long bow":         {"cost": 40, "damage": "1d6", "qualities": ["Missile", "Two-handed"]},
    "Mace":             {"cost": 5,  "damage": "1d6", "qualities": ["Blunt", "Melee"]},
    "Polearm":          {"cost": 7,  "damage": "1d10","qualities": ["Brace", "Melee", "Slow", "Two-handed"]},
    "Short bow":        {"cost": 25, "damage": "1d6", "qualities": ["Missile", "Two-handed"]},
    "Short sword":      {"cost": 7,  "damage": "1d6", "qualities": ["Melee"]},
    "Silver dagger":    {"cost": 30, "damage": "1d4", "qualities": ["Melee", "Missile"]},
    "Sling":            {"cost": 2,  "damage": "1d4", "qualities": ["Blunt", "Missile"]},
    "Spear":            {"cost": 4,  "damage": "1d6", "qualities": ["Brace", "Melee", "Missile"]},
    "Staff":            {"cost": 2,  "damage": "1d4", "qualities": ["Blunt", "Melee", "Slow", "Two-handed"]},
    "Sword":            {"cost": 10, "damage": "1d8", "qualities": ["Melee"]},
    "Two-handed sword": {"cost": 15, "damage": "1d10","qualities": ["Melee", "Slow", "Two-handed"]},
    "Warhammer":        {"cost": 5,  "damage": "1d6", "qualities": ["Blunt", "Melee"]},
}

ARMOUR = {
    "Leather":    {"aac": 12, "cost": 20},  # AAC 12 (descending AC 7, unused)
    "Chainmail":  {"aac": 14, "cost": 40},  # AAC 14 (descending AC 5, unused)
    "Plate mail": {"aac": 16, "cost": 60},  # AAC 16 (descending AC 3, unused)
    "Shield":     {"aac_bonus": 1, "cost": 10},
}
# ⚠️ This project uses the OPTIONAL ASCENDING ARMOUR CLASS (AAC) system.
# (OSE Classic p. 32) Higher AAC = better protection. Unarmoured base = 10.
# Descending AC values are noted in comments for reference only and are NOT used.

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


def auto_kit(char_class: str, gold: int) -> dict:
    """
    Build an auto equipment kit for the given class and starting gold.
    Returns dict with keys: equipped (list), packed (list), gold_spent (int), gold_remaining (int).
    """
    equipped = []
    packed = []
    spent = 0

    def buy(item_name, cost, location):
        nonlocal spent
        spent += cost
        if location == "equipped":
            equipped.append(item_name)
        else:
            packed.append(item_name)
        return gold - spent

    remaining = gold

    # Step 1: Class essentials
    for item in CLASS_ESSENTIALS[char_class]:
        cost = ADVENTURING_GEAR.get(item, 0)
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
        cost = ADVENTURING_GEAR.get(item, 0)
        if remaining >= cost and item not in packed and item not in equipped:
            remaining = buy(item, cost, "packed")

    return {
        "equipped": equipped,
        "packed": packed,
        "gold_spent": spent,
        "gold_remaining": remaining,
    }
