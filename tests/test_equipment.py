"""Tests for equipment.py — armour and auto-kit logic."""

from src.equipment import (
    best_affordable_armour,
    auto_kit,
    CLASS_ARMOUR_RULES,
    CLASS_ESSENTIALS,
    ADVENTURING_GEAR,
)


def test_cleric_armour_at_different_gold_levels():
    """Cleric should get best armour affordable after buying Holy Symbol."""
    # 50gp start: after 25gp Holy Symbol = 25gp left → Leather
    kit = auto_kit("Cleric", 50)
    assert "Leather" in kit["equipped"], f"Expected Leather at 50gp, got {kit['equipped']}"
    
    # 70gp start: after 25gp = 45gp left → Chainmail
    kit = auto_kit("Cleric", 70)
    assert "Chainmail" in kit["equipped"], f"Expected Chainmail at 70gp, got {kit['equipped']}"
    
    # 90gp start: after 25gp = 65gp left → Plate mail
    kit = auto_kit("Cleric", 90)
    assert "Plate mail" in kit["equipped"], f"Expected Plate mail at 90gp, got {kit['equipped']}"
    
    # 150gp start: Plate + Shield
    kit = auto_kit("Cleric", 150)
    assert "Plate mail" in kit["equipped"], f"Expected Plate mail at 150gp"
    assert "Shield" in kit["equipped"], f"Expected Shield at 150gp"


def test_magic_user_no_armour():
    """Magic-Users cannot wear armour."""
    from src.equipment import ARMOUR
    kit = auto_kit("Magic-User", 100)
    # Check no ARMOUR items are in equipped (weapons are separate)
    armour_equipped = [i for i in kit["equipped"] if i in ARMOUR]
    assert armour_equipped == [], f"MU should have no armour, got {armour_equipped}"


def test_thief_leather_only():
    """Thieves can only wear Leather armour."""
    kit = auto_kit("Thief", 100)
    assert "Leather" in kit["equipped"], f"Thief should have Leather"
    assert "Chainmail" not in kit["equipped"], "Thief should not have Chainmail"
    assert "Plate mail" not in kit["equipped"], "Thief should not have Plate mail"


def test_armour_prioritizes_best_ac():
    """best_affordable_armour should return lowest AC (best protection) affordable."""
    # At 60gp, Cleric can afford Plate (AC 3) but not Chain + Plate
    armour, cost = best_affordable_armour("Cleric", 60)
    assert armour == "Plate mail", f"Expected Plate mail, got {armour}"
    
    # At 40gp, Cleric can afford Chain (AC 5) but not Plate
    armour, cost = best_affordable_armour("Cleric", 40)
    assert armour == "Chainmail", f"Expected Chainmail, got {armour}"
    
    # At 20gp, Cleric can afford Leather (AC 7) but not Chain
    armour, cost = best_affordable_armour("Cleric", 20)
    assert armour == "Leather", f"Expected Leather, got {armour}"


def test_shield_only_if_allowed():
    """Shield should only be added for classes that can use it."""
    # Fighter at 150gp should get Shield
    kit = auto_kit("Fighter", 150)
    assert "Shield" in kit["equipped"], "Fighter should have Shield at high gold"
    
    # Thief should NEVER get Shield
    kit = auto_kit("Thief", 150)
    assert "Shield" not in kit["equipped"], "Thief should never have Shield"
    
    # Magic-User should NEVER get Shield
    kit = auto_kit("Magic-User", 150)
    assert "Shield" not in kit["equipped"], "Magic-User should never have Shield"


if __name__ == "__main__":
    test_cleric_armour_at_different_gold_levels()
    print("✓ test_cleric_armour_at_different_gold_levels")
    
    test_magic_user_no_armour()
    print("✓ test_magic_user_no_armour")
    
    test_thief_leather_only()
    print("✓ test_thief_leather_only")
    
    test_armour_prioritizes_best_ac()
    print("✓ test_armour_prioritizes_best_ac")
    
    test_shield_only_if_allowed()
    print("✓ test_shield_only_if_allowed")
    
    print("\n✅ All tests passed!")
