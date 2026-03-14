"""Dice rolling utilities for OSE Character Creator."""

import random


def roll(dice: str) -> int:
    """Roll dice in format '3d6', '1d8', etc. Returns sum."""
    if 'd' not in dice:
        raise ValueError(f"Invalid dice format: {dice}")
    num, die = dice.split('d')
    num = int(num)
    die = int(die)
    return sum(random.randint(1, die) for _ in range(num))


def roll_3d6() -> int:
    """Roll 3d6, return sum."""
    return roll("3d6")


def roll_4d6_drop_lowest() -> int:
    """Roll 4d6, drop lowest die, return sum."""
    dice = [random.randint(1, 6) for _ in range(4)]
    dice.remove(min(dice))
    return sum(dice)


def roll_hit_die(die_type: int) -> int:
    """Roll a single hit die (d4, d6, d8, etc.)."""
    return random.randint(1, die_type)


def roll_starting_gold() -> int:
    """Roll starting gold: 3d6 × 10."""
    return roll("3d6") * 10
