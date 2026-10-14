"""
Unit test for Python AI Service DynamicPricingEngine
"""
import sys
from app.services.dynamic_pricing_engine import DynamicPricingEngine
from app.core.constants import (
    MIN_DYNAMIC_MULTIPLIER,
    MAX_DYNAMIC_MULTIPLIER,
    BADGE_VALUE_SAVER,
    BADGE_STANDARD_RATE,
    BADGE_WEEKEND_SURGE,
    BADGE_HIGH_DEMAND_SURGE
)

def run():
    print("Testing Python AI DynamicPricingEngine...")

    # 1. Normal Monday in Bhopal with 50% util -> 1.00x
    res1 = DynamicPricingEngine.calculate_dynamic_rate(
        base_rate=100.0,
        rental_date_str="2026-09-14T10:00:00Z",
        city="Bhopal",
        fleet_utilization=0.50
    )
    assert res1["multiplier"] == 1.00, f"Expected 1.00, got {res1['multiplier']}"
    assert res1["surgeBadge"] == BADGE_STANDARD_RATE
    print("✓ Test 1: Normal Monday Bhopal (1.00x) passed")

    # 2. Tuesday in Bhopal with 15% util -> 0.90x (Lower bound!)
    res2 = DynamicPricingEngine.calculate_dynamic_rate(
        base_rate=500.0,
        rental_date_str="2026-09-15T10:00:00Z",
        city="Bhopal",
        fleet_utilization=0.15
    )
    assert res2["multiplier"] == 0.90, f"Expected 0.90, got {res2['multiplier']}"
    assert res2["adjustedRate"] == 450.0
    assert res2["dynamicAdjustment"] == -50.0
    assert res2["surgeBadge"] == BADGE_VALUE_SAVER
    print("✓ Test 2: Low-demand Tuesday + 15% util (0.90x lower bound) passed")

    # 3. Saturday in Indore with 90% util -> 1.33x surge (1.00 + 0.15 + 0.15 + 0.03)
    res3 = DynamicPricingEngine.calculate_dynamic_rate(
        base_rate=1000.0,
        rental_date_str="2026-09-19T10:00:00Z",
        city="Indore",
        fleet_utilization=0.90
    )
    assert res3["multiplier"] == 1.33, f"Expected 1.33, got {res3['multiplier']}"
    assert res3["adjustedRate"] == 1330.0
    assert res3["dynamicAdjustment"] == 330.0
    assert res3["surgeBadge"] == BADGE_HIGH_DEMAND_SURGE
    print("✓ Test 3: Saturday Indore peak (1.33x surge) passed")

    # 4. Upper bound clamp <= 1.35
    res4 = DynamicPricingEngine.calculate_dynamic_rate(
        base_rate=1000.0,
        rental_date_str="2026-09-19T10:00:00Z",
        city="Indore",
        fleet_utilization=1.00
    )
    assert res4["multiplier"] <= 1.35, f"Expected <= 1.35, got {res4['multiplier']}"
    print("✓ Test 4: Upper bound clamp passed")

    # 5. Invalid date handling
    res5 = DynamicPricingEngine.calculate_dynamic_rate(
        base_rate=1000.0,
        rental_date_str="malformed_invalid_date",
        city="Indore",
        fleet_utilization=0.50
    )
    assert res5["multiplier"] >= 0.90 and res5["multiplier"] <= 1.35
    print("✓ Test 5: Malformed date fallback passed")

    print("\nALL PYTHON AI SERVICE PRICING TESTS PASSED!")

if __name__ == "__main__":
    run()
