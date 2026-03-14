"""Main character generation logic for OSE Character Creator."""

import random
from . import dice, ability_scores, classes, equipment


def generate_character(options: dict) -> dict:
    """
    Generate a complete OSE Classic character.
    
    Options:
        dice_method: "3d6_order" | "3d6_arrange" | "4d6_drop_lowest"
        class_selection: "random" | "choose_first" | "choose_after"
        chosen_class: str (if class_selection is "choose_first" or "choose_after")
        alignment: "random" | "lawful" | "neutral" | "chaotic"
        reroll_low_hp: bool (allow reroll of 1s and 2s on hit dice)
        reroll_subpar: bool (allow full reroll if all stats <= 8)
        equipment_mode: "auto" | "manual"
    
    Returns: dict with all character fields for PDF filling.
    """
    
    # Step 1: Roll ability scores
    if options.get("reroll_subpar"):
        while True:
            scores = roll_ability_scores(options["dice_method"])
            if any(s > 8 for s in scores.values()):
                break
    else:
        scores = roll_ability_scores(options["dice_method"])
    
    # Step 2: Determine class
    char_class = determine_class(scores, options)
    
    # Step 3: Apply prime requisite optimization (auto-optimize for random class)
    if options.get("class_selection") == "random":
        scores = optimize_prime_requisite(scores, char_class)
    
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
    alignment = determine_alignment(options.get("alignment", "random"))
    
    # Step 6: Roll HP
    hp = roll_hp(char_class, mods["CON"]["hp"], options.get("reroll_low_hp", False))
    
    # Step 7: Calculate AC
    ac = calculate_ac(mods["DEX"]["ac"])
    
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
            "gold_spent": 0,
            "gold_remaining": starting_gold,
        }
    
    # Step 17: Spells (for Magic-User or Elf)
    spells_known = ""
    if classes.CLASSES[char_class].get("spellcaster"):
        spell_list = classes.MU_ELF_SPELLS_L1
        spells_known = random.choice(spell_list)
    
    # Step 18: Notes
    notes = []
    if spells_known:
        notes.append(f"Spell: {spells_known}")
    if char_class == "Thief":
        notes.append(f"Thief Skills: CS {thief_skills.get('CS', 'N/A')}, TR {thief_skills.get('TR', 'N/A')}, "
                    f"HN {thief_skills.get('HN', 'N/A')}, HS {thief_skills.get('HS', 'N/A')}, "
                    f"MS {thief_skills.get('MS', 'N/A')}, OL {thief_skills.get('OL', 'N/A')}, PP {thief_skills.get('PP', 'N/A')}")
    if kit["gold_remaining"] > 0:
        notes.append(f"Remaining gold: {kit['gold_remaining']} gp")
    
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
        "ac": ac,
        "unarmoured_ac": 9 + mods["DEX"]["ac"],  # Base 9 adjusted for DEX
        "attack_bonus": attack_bonus,
        
        # Saves
        "save_death": saves["D"],
        "save_wands": saves["W"],
        "save_paralysis": saves["P"],
        "save_breath": saves["B"],
        "save_spells": saves["S"],
        
        # Movement
        "encounter_movement": "40'",
        "exploration_movement": "120'",
        "overland_movement": "24",
        
        # Skills
        "find_room_trap": "—",
        "find_secret_door": "—",
        "open_stuck_door": f"{mods['STR']['open_doors']}-in-6",
        "listen_at_door": "—",
        
        # Languages & Literacy
        "languages": ", ".join(languages),
        "literate": literacy == "Literate",
        
        # Special
        "abilities": "; ".join(special_abilities) if special_abilities else "—",
        "notes": "; ".join(notes) if notes else "—",
        
        # XP
        "xp": xp,
        "xp_next_level": xp_next,
        "pr_xp_bonus": pr_xp,
        
        # Equipment
        "equipped": kit["equipped"],
        "packed": kit["packed"],
        
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


def roll_ability_scores(method: str) -> dict:
    """Roll all 6 ability scores."""
    if method == "3d6_order":
        return {
            "STR": dice.roll_3d6(),
            "INT": dice.roll_3d6(),
            "WIS": dice.roll_3d6(),
            "DEX": dice.roll_3d6(),
            "CON": dice.roll_3d6(),
            "CHA": dice.roll_3d6(),
        }
    elif method == "3d6_arrange":
        rolls = [dice.roll_3d6() for _ in range(6)]
        return {
            "STR": rolls[0],
            "INT": rolls[1],
            "WIS": rolls[2],
            "DEX": rolls[3],
            "CON": rolls[4],
            "CHA": rolls[5],
        }
    elif method == "4d6_drop_lowest":
        rolls = [dice.roll_4d6_drop_lowest() for _ in range(6)]
        return {
            "STR": rolls[0],
            "INT": rolls[1],
            "WIS": rolls[2],
            "DEX": rolls[3],
            "CON": rolls[4],
            "CHA": rolls[5],
        }
    else:
        raise ValueError(f"Unknown dice method: {method}")


def determine_class(scores: dict, options: dict) -> str:
    """Determine character class based on scores and options."""
    mode = options.get("class_selection", "random")
    
    if mode == "choose_first" and options.get("chosen_class"):
        return options["chosen_class"]
    
    if mode == "choose_after":
        # Return chosen class if valid, otherwise pick random valid
        chosen = options.get("chosen_class")
        if chosen and is_valid_class(chosen, scores):
            return chosen
    
    # Random valid class
    valid_classes = [c for c in classes.CLASSES if is_valid_class(c, scores)]
    if not valid_classes:
        return "Fighter"  # Fallback
    return random.choice(valid_classes)


def is_valid_class(char_class: str, scores: dict) -> bool:
    """Check if character meets minimum requirements for class."""
    reqs = classes.CLASSES[char_class].get("requirements", {})
    for stat, minimum in reqs.items():
        if scores.get(stat, 0) < minimum:
            return False
    return True


def optimize_prime_requisite(scores: dict, char_class: str) -> dict:
    """
    Apply prime requisite optimization: for every 2 points lowered from 
    non-prime stats, add 1 to a prime requisite (STR/INT/WIS only).
    """
    prs = classes.CLASSES[char_class]["prime_requisites"]
    donors = [s for s in ["STR", "INT", "WIS"] if s not in prs]
    
    # Simple greedy: lower donor stats to boost lowest prime requisite
    scores = scores.copy()
    for donor in donors:
        while scores[donor] > 9 and any(scores[pr] < 13 for pr in prs):
            # Can we lower this donor?
            if scores[donor] >= 11:
                scores[donor] -= 2
                # Boost lowest prime requisite
                lowest_pr = min(prs, key=lambda pr: scores[pr])
                scores[lowest_pr] += 1
            else:
                break
    
    return scores


def determine_alignment(mode: str) -> str:
    """Determine alignment."""
    if mode == "random":
        return random.choice(["Lawful", "Neutral", "Chaotic"])
    return mode.capitalize()


def roll_hp(char_class: str, con_mod: int, reroll_low: bool) -> int:
    """Roll hit points for the class."""
    hd = classes.CLASSES[char_class]["hit_die"]
    hp = dice.roll_hit_die(hd)
    
    if reroll_low and hp <= 2:
        hp = dice.roll_hit_die(hd)
    
    hp += con_mod
    return max(1, hp)  # Always at least 1


def calculate_ac(dex_mod: int) -> int:
    """Calculate base AC (no armor). Default is 9, adjusted by DEX."""
    return 9 - dex_mod  # Higher DEX = lower (better) AC


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
