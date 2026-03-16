"""Main character generation logic for OSE Character Creator."""

import random
from . import dice, ability_scores, classes, equipment


def generate_character(options: dict) -> dict:
    """
    Generate a complete OSE Classic character.
    
    Options:
        dice_method: "3d6_order" | "4d6_order_drop_lowest" | "3d6_optimized" | "4d6_optimized_drop_lowest"
        class_selection: "random" | "choose"
        chosen_class: str (if class_selection is "choose")
        alignment: "random" | "lawful" | "neutral" | "chaotic"
        reroll_low_hp: bool (allow reroll of 1s and 2s on hit dice)
        reroll_subpar: bool (allow full reroll if all stats <= 8)
        equipment_mode: "auto" | "manual"
    
    Returns: dict with all character fields for PDF filling.
    """
    
    # Determine chosen_class early for optimized dice methods
    class_selection = options.get("class_selection", "random")
    chosen_class = options.get("chosen_class")
    
    # Step 1: Roll ability scores
    # For optimized methods, we need to know the class first
    dice_method = options.get("dice_method", "3d6_order")
    uses_optimized = dice_method in ("3d6_optimized", "4d6_optimized_drop_lowest")
    
    if uses_optimized and class_selection == "choose" and chosen_class:
        # Class already selected, roll optimized for it
        if options.get("reroll_subpar"):
            while True:
                scores = roll_ability_scores(dice_method, chosen_class)
                if any(s > 8 for s in scores.values()):
                    break
        else:
            scores = roll_ability_scores(dice_method, chosen_class)
        char_class = chosen_class
    elif uses_optimized and class_selection == "random":
        # Roll scores with optimized method for a random class
        # Need to determine class first to know prime requisite(s)
        char_class = determine_class_for_roll(options)
        if options.get("reroll_subpar"):
            while True:
                scores = roll_ability_scores(dice_method, char_class)
                if any(s > 8 for s in scores.values()):
                    break
        else:
            scores = roll_ability_scores(dice_method, char_class)
    else:
        # Non-optimized method or choose-without-optimized
        if options.get("reroll_subpar"):
            while True:
                scores = roll_ability_scores(dice_method)
                if any(s > 8 for s in scores.values()):
                    break
        else:
            scores = roll_ability_scores(dice_method)
        # Step 2: Determine class
        char_class = determine_class(scores, options)
    
    # Step 4: Calculate modifiers
    mods = {
        "STR": ability_scores.str_modifier(scores["STR"]),
        "INT": ability_scores.int_modifier(scores["INT"]),
        "WIS": ability_scores.wis_modifier(scores["WIS"]),
        "DEX": ability_scores.dex_modifier(scores["DEX"]),
        "CON": ability_scores.con_modifier(scores["CON"]),
        "CHA": ability_scores.cha_modifier(scores["CHA"]),
    }
    
    # Step 5: Determine alignment
    alignment = determine_alignment(options)
    
    # Step 6: Roll HP
    hp = roll_hp(char_class, mods["CON"]["hp"], options.get("reroll_low_hp", False))
    
    # Step 7: AC (AAC) and movement are calculated after equipment (Step 16)

    # Step 8: Attack bonus (THAC0 is 19 [0] at 1st level)
    attack_bonus = 0
    
    # Step 9: Saving throws (1st level)
    saves = classes.CLASSES[char_class]["saving_throws_lvl1"]
    
    # Step 10: Languages
    languages = determine_languages(char_class, scores["INT"], mods["INT"]["languages"])
    
    # Step 11: Literacy
    literacy = mods["INT"]["literacy"]
    
    # Step 12: Special abilities
    special_abilities = classes.CLASSES[char_class].get("special_abilities", [])
    
    # Step 13: Thief skills (if Thief)
    thief_skills = classes.CLASSES[char_class].get("thief_skills_lvl1", {})
    
    # Step 14: Level and XP
    level = 1
    xp = 0
    xp_next = classes.CLASSES[char_class]["xp_next_level"]
    title = classes.CLASSES[char_class]["title_lvl1"]
    
    # Step 15: PR XP bonus
    pr_xp = calculate_pr_xp_bonus(scores, char_class)
    
    # Step 16: Equipment
    starting_gold = dice.roll_starting_gold()
    if options.get("equipment_mode") == "auto":
        kit = equipment.auto_kit(char_class, starting_gold)
    else:
        # Manual mode - just give them the gold
        kit = {
            "equipped": [],
            "packed": [],
            "unencumbering": [],
            "gold_spent": 0,
            "gold_remaining": starting_gold,
        }
    
    # Step 17: Spells (for Magic-User or Elf)
    spells_known = []
    if classes.CLASSES[char_class].get("spellcaster") and char_class != "Cleric":
        spell_list = list(classes.MU_ELF_SPELLS_L1)
        give_read_magic = options.get("give_read_magic", False)
        if give_read_magic:
            spells_known.append("Read Magic")
            spell_list = [s for s in spell_list if s != "Read Magic"]
        rand_spell = random.choice(spell_list)
        spells_known.append(rand_spell)

    # Step 18: Notes
    notes = []
    for spell in spells_known:
        page = classes.SPELL_PAGE_NUMBERS.get(spell, "")
        page_str = f" (p. {page})" if page else ""
        notes.append(f"Spell: {spell}{page_str}")
    if char_class == "Thief":
        notes.append(f"Thief Skills: CS {thief_skills.get('CS', 'N/A')}, TR {thief_skills.get('TR', 'N/A')}, "
                    f"HN {thief_skills.get('HN', 'N/A')}, HS {thief_skills.get('HS', 'N/A')}, "
                    f"MS {thief_skills.get('MS', 'N/A')}, OL {thief_skills.get('OL', 'N/A')}, PP {thief_skills.get('PP', 'N/A')}")
    if kit["gold_remaining"] > 0:
        notes.append(f"Remaining gold: {kit['gold_remaining']} gp")
    
    # Calculate AAC (Ascending Armour Class) with equipped armour
    equipped_items = kit.get("equipped", [])
    from src.equipment import ARMOUR
    armour_name = None
    for item in equipped_items:
        if item in ARMOUR and "Shield" not in item:
            armour_name = item
    has_shield = "Shield" in equipped_items
    aac = calculate_aac(mods["DEX"]["ac"], armour_name, has_shield)
    unarmoured_aac = calculate_aac(mods["DEX"]["ac"], None, False)

    # Calculate movement rates from Item-Based Encumbrance (OSE CC2)
    mv = equipment.calculate_movement(
        equipped_items,
        kit.get("packed", []),
        str_melee_mod=mods["STR"]["melee"],
    )
    
    # Build final character dict with all PDF fields
    character = {
        # Identity
        "name": "",
        "character_class": char_class,
        "title": title,
        "level": level,
        "alignment": alignment,
        
        # Abilities
        "str": scores["STR"],
        "int": scores["INT"],
        "wis": scores["WIS"],
        "dex": scores["DEX"],
        "con": scores["CON"],
        "cha": scores["CHA"],
        
        # Modifiers
        "str_melee_mod": mods["STR"]["melee"],
        "str_open_doors": mods["STR"]["open_doors"],
        "int_languages": mods["INT"]["languages"],
        "int_literacy": mods["INT"]["literacy"],
        "wis_magic_saves": mods["WIS"]["magic_saves"],
        "dex_ac_mod": mods["DEX"]["ac"],
        "dex_missile_mod": mods["DEX"]["missile"],
        "dex_initiative_mod": mods["DEX"]["initiative"],
        "con_hp_mod": mods["CON"]["hp"],
        "cha_npc_reactions": mods["CHA"]["npc_reactions"],
        "cha_max_retainers": mods["CHA"]["max_retainers"],
        "cha_loyalty": mods["CHA"]["loyalty"],
        
        # Combat
        "hp": hp,
        "max_hp": hp,
        "ac": aac,  # AAC (Ascending Armour Class)
        "unarmoured_ac": unarmoured_aac,
        "attack_bonus": attack_bonus,
        
        # Saves
        "save_death": saves["D"],
        "save_wands": saves["W"],
        "save_paralysis": saves["P"],
        "save_breath": saves["B"],
        "save_spells": saves["S"],
        
        # Movement (calculated from Item-Based Encumbrance, OSE CC2)
        "encounter_movement": mv["encounter_movement"],
        "exploration_movement": mv["exploration_movement"],
        "overland_movement": mv["overland_movement"],
        "equipped_item_count": mv["equipped_item_count"],
        "packed_item_count": mv["packed_item_count"],

        # Packed item STR thresholds for PDF (base + STR melee mod)
        "packed_str_threshold_18": 14 + mods["STR"]["melee"],
        "packed_str_threshold_16": 12 + mods["STR"]["melee"],
        "packed_str_threshold_13": 10 + mods["STR"]["melee"],
        
        # Skills
        "find_room_trap": "—",
        "find_secret_door": "—",
        "open_stuck_door": f"{mods['STR']['open_doors']}-in-6",
        "listen_at_door": "—",

        # Languages & Literacy — deduplicate, exclude Alignment language (implicit)
        "languages": ", ".join(sorted(set(l for l in languages if l != "Alignment"))),

        "literate": literacy == "Literate",

        # Special abilities — filter out anything already shown in Exploration
        # (e.g., Listen at doors appears under Exploration, no need to repeat)
        "abilities": "\n".join(
            a for a in special_abilities
            if a not in classes.ABILITIES_SHOWN_ELSEWHERE
        ),
        "notes": "\n".join(notes) if notes else "",
        
        # XP
        "xp": xp,
        "xp_next_level": xp_next,
        "pr_xp_bonus": pr_xp,
        
        # Equipment — weapons in equipped list get damage notation added
        "equipped": format_equipped_items(kit["equipped"], mods["STR"]["melee"], mods["DEX"]["missile"]),
        "packed": kit["packed"],
        "unencumbering": kit.get("unencumbering", []),
        
        # Spells
        "spells_known": spells_known,
    }
    
    # Class-specific overrides
    if char_class in ["Dwarf", "Elf", "Halfling"]:
        character["find_room_trap"] = "2-in-6" if char_class == "Dwarf" else "—"
        character["find_secret_door"] = "2-in-6" if char_class == "Elf" else "—"
        character["listen_at_door"] = "2-in-6"
    
    if char_class == "Halfling":
        character["dex_ac_mod"] = mods["DEX"]["ac"] + 2  # +2 vs large
    
    return character


def format_equipped_items(equipped: list, str_melee_mod: int, dex_missile_mod: int) -> list:
    """
    Format equipped items with full to-hit and damage info.

    Weapons:
      Melee:  "Sword: +1 to hit; 1d8+1 dmg"   (STR mod applied to both)
              "Club: 1d4 dmg"                   (no bonuses)
      Ranged: "Short Bow: +1 to hit"            (DEX mod to hit only, no damage bonus)
              "Javelin: 1d4 dmg"                (no bonuses)
      Dual (melee+missile, e.g. Dagger, Spear):
              "Dagger: +1 to hit; 1d4+1 dmg (melee) / +1 to hit (thrown)"

    Armour:
      "Leather Armor (12 AC)"
      "Shield (+1 AC)"

    Magic bonus is 0 for all items at this stage; infrastructure is in place for future use.
    """
    from src.equipment import WEAPONS, ARMOUR

    result = []
    for item in equipped:
        magic_bonus = 0  # Placeholder — magic item generation comes later

        if item in WEAPONS:
            weapon = WEAPONS[item]
            qualities = weapon.get("qualities", [])
            base_dmg = weapon["damage"]
            is_melee = "Melee" in qualities
            is_missile = "Missile" in qualities

            display_name = item if magic_bonus == 0 else f"{item} +{magic_bonus}"

            if is_melee and is_missile:
                # Dual-use weapon (e.g. Dagger, Spear, Hand axe)
                melee_hit = str_melee_mod + magic_bonus
                melee_dmg_bonus = str_melee_mod + magic_bonus
                ranged_hit = dex_missile_mod + magic_bonus

                melee_parts = []
                if melee_hit != 0:
                    melee_parts.append(f"{_fmt_bonus(melee_hit)} to hit")
                dmg_str = _fmt_damage(base_dmg, melee_dmg_bonus)
                melee_parts.append(f"{dmg_str} dmg")

                ranged_parts = []
                if ranged_hit != 0:
                    ranged_parts.append(f"{_fmt_bonus(ranged_hit)} to hit")

                melee_str = "; ".join(melee_parts)
                if ranged_parts:
                    ranged_str = "; ".join(ranged_parts) + " (thrown)"
                    result.append(f"{display_name}: {melee_str} / {ranged_str}")
                else:
                    result.append(f"{display_name}: {melee_str}")

            elif is_melee:
                hit_bonus = str_melee_mod + magic_bonus
                dmg_bonus = str_melee_mod + magic_bonus
                parts = []
                if hit_bonus != 0:
                    parts.append(f"{_fmt_bonus(hit_bonus)} to hit")
                parts.append(f"{_fmt_damage(base_dmg, dmg_bonus)} dmg")
                result.append(f"{display_name}: {'; '.join(parts)}")

            elif is_missile:
                hit_bonus = dex_missile_mod + magic_bonus
                parts = []
                if hit_bonus != 0:
                    parts.append(f"{_fmt_bonus(hit_bonus)} to hit")
                dmg_str = _fmt_damage(base_dmg, 0)  # No STR bonus to ranged damage
                parts.append(f"{dmg_str} dmg")
                result.append(f"{display_name}: {'; '.join(parts)}")

            else:
                result.append(display_name)

        elif item in ARMOUR:
            armour = ARMOUR[item]
            if "aac_bonus" in armour:
                result.append(f"{item} (+{armour['aac_bonus']} AC)")
            else:
                result.append(f"{item} ({armour['aac']} AC)")
        else:
            result.append(item)

    return result


def _fmt_bonus(val: int) -> str:
    """Format a numeric bonus/penalty as a signed string: +1, -1, +0 → omit caller handles."""
    return f"+{val}" if val >= 0 else str(val)


def _fmt_damage(die: str, bonus: int) -> str:
    """Format damage string: '1d8' + 1 → '1d8+1', bonus 0 → '1d8'."""
    if bonus > 0:
        return f"{die}+{bonus}"
    elif bonus < 0:
        return f"{die}{bonus}"
    return die


def roll_ability_scores(method: str, chosen_class: str = None) -> dict:
    """Roll all 6 ability scores.
    
    Methods:
    - 3d6_order: 3d6 assigned in fixed STR→INT→WIS→DEX→CON→CHA order
    - 4d6_order_drop_lowest: 4d6-drop-lowest assigned in fixed order
    - 3d6_optimized: 3d6 rolled 6 times, best roll(s) to prime requisite(s)
    - 4d6_optimized_drop_lowest: 4d6-drop-lowest 6 times, best to prime requisite(s)
    """
    if method == "3d6_order":
        return {
            "STR": dice.roll_3d6(),
            "INT": dice.roll_3d6(),
            "WIS": dice.roll_3d6(),
            "DEX": dice.roll_3d6(),
            "CON": dice.roll_3d6(),
            "CHA": dice.roll_3d6(),
        }
    elif method == "4d6_order_drop_lowest":
        return {
            "STR": dice.roll_4d6_drop_lowest(),
            "INT": dice.roll_4d6_drop_lowest(),
            "WIS": dice.roll_4d6_drop_lowest(),
            "DEX": dice.roll_4d6_drop_lowest(),
            "CON": dice.roll_4d6_drop_lowest(),
            "CHA": dice.roll_4d6_drop_lowest(),
        }
    elif method == "3d6_optimized":
        return _roll_optimized(6, dice.roll_3d6, chosen_class)
    elif method == "4d6_optimized_drop_lowest":
        return _roll_optimized(6, dice.roll_4d6_drop_lowest, chosen_class)
    else:
        raise ValueError(f"Unknown dice method: {method}")


def _roll_optimized(num_rolls: int, roll_fn, chosen_class: str) -> dict:
    """Roll ability scores optimized for the chosen class's prime requisite(s)."""
    # Roll num_rolls values
    rolls = [roll_fn() for _ in range(num_rolls)]
    rolls.sort(reverse=True)  # Highest first
    
    # Get prime requisite(s) for this class
    prs = classes.CLASSES[chosen_class]["prime_requisites"]
    
    # Stats in fixed order (excluding prime requisites, which we'll fill first)
    all_stats = ["STR", "INT", "WIS", "DEX", "CON", "CHA"]
    non_pr_stats = [s for s in all_stats if s not in prs]
    pr_stats = list(prs)  # Keep order from class definition
    
    scores = {}
    
    # Assign top rolls to prime requisites (randomly if 2)
    if len(pr_stats) == 1:
        scores[pr_stats[0]] = rolls[0]
    else:
        # Two prime requisites - assign top 2 randomly between them
        top_two = rolls[:2]
        random.shuffle(top_two)
        scores[pr_stats[0]] = top_two[0]
        scores[pr_stats[1]] = top_two[1]
    
    # Assign remaining rolls to non-prime stats randomly
    remaining = rolls[len(pr_stats):]
    random.shuffle(non_pr_stats)
    for i, stat in enumerate(non_pr_stats):
        scores[stat] = remaining[i]
    
    return scores


def _pick_random_class_by_xp(scores: dict) -> str:
    """Helper: pick a random class from valid classes by best available XP tier.
    
    Priority order:
    1. +5% or +10% classes (preferred)
    2. 0% classes (None)
    3. -10% classes (last resort — only when no better option exists)
    -20% classes are never picked if any other option is available.
    """
    valid_classes = [c for c in classes.CLASSES if is_valid_class(c, scores)]
    if not valid_classes:
        return "Fighter"
    
    bonus_plus = []    # +5% or +10%
    bonus_none = []    # 0% (None)
    bonus_minus10 = [] # -10%
    # -20% never picked unless literally no other option
    
    for c in valid_classes:
        bonus = calculate_pr_xp_bonus(scores, c)
        if bonus in ("+5%", "+10%"):
            bonus_plus.append(c)
        elif bonus == "None":
            bonus_none.append(c)
        elif bonus == "-10%":
            bonus_minus10.append(c)
        # -20% classes fall through and are never added
    
    if bonus_plus:
        return random.choice(bonus_plus)
    elif bonus_none:
        return random.choice(bonus_none)
    elif bonus_minus10:
        return random.choice(bonus_minus10)
    else:
        return random.choice(valid_classes)  # absolute last resort (-20% only)


def determine_class_for_roll(options: dict) -> str:
    """For random class mode: determine which class to use for optimized rolls.
    
    Algorithm:
    1. Get all valid classes (meet minimum requirements)
    2. For each, calculate the XP bonus they'd give with the rolled scores
    3. Filter to classes with +5% or +10% bonus
    4. If any exist, pick randomly among those
    5. Otherwise pick randomly among classes with 0% bonus
    6. Classes with -10% are never picked
    """
    # We'll roll a set of scores first to evaluate classes
    dice_method = options.get("dice_method", "3d6_order")
    
    # Roll scores in basic order to evaluate XP potential
    test_scores = roll_ability_scores(dice_method)
    
    return _pick_random_class_by_xp(test_scores)


def determine_class(scores: dict, options: dict) -> str:
    """Determine character class based on scores and options.
    
    For random class selection: prefer classes giving +5% or +10% XP bonus,
    then fall back to 0% classes. Never pick -10% classes.
    """
    mode = options.get("class_selection", "random")
    
    if mode == "choose" and options.get("chosen_class"):
        chosen = options["chosen_class"]
        if is_valid_class(chosen, scores):
            return chosen
        # If chosen class isn't valid with these scores, fall through to random
    
    # Random class: use XP-aware selection (same logic as determine_class_for_roll)
    return _pick_random_class_by_xp(scores)


def is_valid_class(char_class: str, scores: dict) -> bool:
    """Check if character meets minimum requirements for class."""
    reqs = classes.CLASSES[char_class].get("requirements", {})
    for stat, minimum in reqs.items():
        if scores.get(stat, 0) < minimum:
            return False
    return True


def determine_alignment(options: dict) -> str:
    """Determine alignment from options.
    
    - alignment_blank: True → return empty string
    - allowed_alignments: list of allowed values → pick randomly (or single value)
    - Falls back to Neutral if nothing is allowed
    """
    if options.get("alignment_blank"):
        return ""
    
    allowed = options.get("allowed_alignments", [])
    if not allowed:
        return "Neutral"  # Edge case: nothing checked
    if len(allowed) == 1:
        return allowed[0]
    return random.choice(allowed)


def roll_hp(char_class: str, con_mod: int, reroll_low: bool) -> int:
    """Roll hit points for the class.
    
    If reroll_low is True, keep rerolling the hit die until the raw die result
    is greater than 2 (i.e. no 1s or 2s on the die itself), then apply CON mod.
    CON modifier can still push the total below 3; minimum HP is always 1.
    """
    hd = classes.CLASSES[char_class]["hit_die"]
    
    roll = dice.roll_hit_die(hd)
    if reroll_low:
        while roll <= 2:
            roll = dice.roll_hit_die(hd)
    
    return max(1, roll + con_mod)


def calculate_aac(dex_mod: int, armour_name: str = None, has_shield: bool = False) -> int:
    """Calculate Ascending Armour Class (AAC).
    Unarmoured base is 10. Armour replaces the base. DEX mod and shield add on top.
    Higher AAC = better protection.
    """
    from src.equipment import ARMOUR
    if armour_name and armour_name in ARMOUR:
        base = ARMOUR[armour_name]["aac"]
    else:
        base = 10  # Unarmoured
    shield_bonus = 1 if has_shield else 0
    return base + dex_mod + shield_bonus


def calculate_pr_xp_bonus(scores: dict, char_class: str) -> str:
    """Calculate prime requisite XP bonus."""
    prs = classes.CLASSES[char_class]["prime_requisites"]
    
    if len(prs) == 1:
        return ability_scores.prime_requisite_xp_modifier(scores[prs[0]])
    else:
        # Dual prime - use lower of the two for the modifier
        scores_list = [scores[pr] for pr in prs]
        return ability_scores.prime_requisite_xp_modifier(min(scores_list))


def determine_languages(char_class: str, int_score: int, extra_languages: int) -> list:
    """Determine known languages."""
    langs = classes.CLASSES[char_class]["languages"].copy()
    langs.append("Common")  # Always have Common
    
    # Add alignment language
    langs.append("Alignment")  # Simplified - alignment language
    
    # Add extra languages based on INT
    available = [l for l in classes.LANGUAGE_PICK_LIST if l not in langs]
    for _ in range(extra_languages):
        if available:
            langs.append(available.pop(random.randrange(len(available))))
    
    return langs
