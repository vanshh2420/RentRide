from typing import Dict, Any, List
from datetime import datetime

class DynamicPricingEngine:
    """
    Real-time Dynamic Pricing Engine computing optimal rate multipliers 
    based on fleet availability, day-of-week, and geographic demand.
    """

    @staticmethod
    def calculate_dynamic_rate(
        base_rate: float,
        rental_date_str: str,
        category_slug: str = "general",
        city: str = "Bangalore",
        fleet_utilization: float = 0.50
    ) -> Dict[str, Any]:
        multiplier = 1.0
        applied_factors = []

        try:
            rental_date = datetime.fromisoformat(rental_date_str.replace("Z", "+00:00"))
            day_of_week = rental_date.weekday()
        except Exception:
            rental_date = datetime.now()
            day_of_week = rental_date.weekday()

        # 1. Weekend Factor (Friday, Saturday, Sunday)
        if day_of_week in [4, 5, 6]:
            weekend_boost = 0.15 if day_of_week == 5 else 0.10
            multiplier += weekend_boost
            applied_factors.append(f"Weekend Surge (+{int(weekend_boost * 100)}%)")

        # 2. Fleet Utilization Factor (> 75% utilized = high scarcity)
        if fleet_utilization >= 0.85:
            multiplier += 0.15
            applied_factors.append("High Fleet Scarcity (+15%)")
        elif fleet_utilization >= 0.70:
            multiplier += 0.08
            applied_factors.append("Moderate Fleet Scarcity (+8%)")

        # 3. Metro Demand
        if city.lower() in ["bangalore", "bengaluru", "mumbai", "goa"]:
            multiplier += 0.05
            applied_factors.append(f"High Demand Region ({city.title()}) (+5%)")

        # Bound multiplier between 0.90 (discount) and 1.35 (max surge)
        multiplier = round(min(1.35, max(0.90, multiplier)), 2)
        adjusted_rate = round(base_rate * multiplier, 2)

        surge_badge = "STANDARD_RATE"
        if multiplier >= 1.20:
            surge_badge = "HIGH_DEMAND_SURGE"
        elif multiplier > 1.05:
            surge_badge = "WEEKEND_SURGE"
        elif multiplier < 1.0:
            surge_badge = "VALUE_SAVER"

        return {
            "baseRate": base_rate,
            "multiplier": multiplier,
            "adjustedRate": adjusted_rate,
            "surgeBadge": surge_badge,
            "appliedFactors": applied_factors if applied_factors else ["Standard Base Rate"],
            "potentialRevenueUpliftPercent": int((multiplier - 1.0) * 100) if multiplier > 1.0 else 0
        }
