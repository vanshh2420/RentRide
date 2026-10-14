from typing import Dict, Any, List
from datetime import datetime
from app.core.constants import (
    MIN_DYNAMIC_MULTIPLIER,
    MAX_DYNAMIC_MULTIPLIER,
    BASE_MULTIPLIER,
    LOW_UTILIZATION_THRESHOLD,
    LOW_UTILIZATION_DELTA,
    MODERATE_SCARCITY_THRESHOLD,
    MODERATE_SCARCITY_DELTA,
    HIGH_SCARCITY_THRESHOLD,
    HIGH_SCARCITY_DELTA,
    OFF_PEAK_WEEKDAY_DAYS,
    OFF_PEAK_WEEKDAY_DELTA,
    FRIDAY_DELTA,
    SATURDAY_DELTA,
    SUNDAY_DELTA,
    CITY_FACTORS,
    DEFAULT_CITY_DELTA,
    BADGE_VALUE_SAVER,
    BADGE_STANDARD_RATE,
    BADGE_WEEKEND_SURGE,
    BADGE_MODERATE_SURGE,
    BADGE_HIGH_DEMAND_SURGE,
)


class DynamicPricingEngine:
    """
    Real-time Dynamic Pricing Engine computing optimal rate multipliers
    based on fleet availability, day-of-week, and geographic demand.
    Bounded deterministically between 0.90x and 1.35x.
    """

    @staticmethod
    def calculate_dynamic_rate(
        base_rate: float,
        rental_date_str: str,
        category_slug: str = "general",
        city: str = "Indore",
        fleet_utilization: float = 0.50,
    ) -> Dict[str, Any]:
        # 0. Sanitize inputs
        try:
            safe_base_rate = max(0.0, float(base_rate))
        except (ValueError, TypeError):
            safe_base_rate = 0.0

        try:
            safe_utilization = min(1.0, max(0.0, float(fleet_utilization)))
        except (ValueError, TypeError):
            safe_utilization = 0.50

        # Parse rental date safely
        try:
            if rental_date_str:
                clean_date_str = rental_date_str.replace("Z", "+00:00")
                rental_date = datetime.fromisoformat(clean_date_str)
            else:
                rental_date = datetime.now()
        except Exception:
            rental_date = datetime.now()

        # Day of week: Monday=0, Tuesday=1, Wednesday=2, Thursday=3, Friday=4, Saturday=5, Sunday=6
        day_of_week = rental_date.weekday()

        multiplier = BASE_MULTIPLIER
        applied_factors: List[str] = []
        is_weekend = False

        # 1. Day / Time Factor
        if day_of_week == 5:  # Saturday
            multiplier += SATURDAY_DELTA
            applied_factors.append(f"Peak Weekend Surge (+{int(SATURDAY_DELTA * 100)}%)")
            is_weekend = True
        elif day_of_week in [4, 6]:  # Friday or Sunday
            delta = FRIDAY_DELTA if day_of_week == 4 else SUNDAY_DELTA
            multiplier += delta
            applied_factors.append(f"Weekend Surge (+{int(delta * 100)}%)")
            is_weekend = True
        elif day_of_week in OFF_PEAK_WEEKDAY_DAYS:  # Tuesday (1) or Wednesday (2)
            multiplier += OFF_PEAK_WEEKDAY_DELTA
            applied_factors.append(f"Value Saver Off-Peak Discount ({int(OFF_PEAK_WEEKDAY_DELTA * 100)}%)")

        # 2. Fleet Scarcity / Utilization Factor
        if safe_utilization >= HIGH_SCARCITY_THRESHOLD:
            multiplier += HIGH_SCARCITY_DELTA
            applied_factors.append(f"High Fleet Scarcity (+{int(HIGH_SCARCITY_DELTA * 100)}%)")
        elif safe_utilization >= MODERATE_SCARCITY_THRESHOLD:
            multiplier += MODERATE_SCARCITY_DELTA
            applied_factors.append(f"Moderate Fleet Scarcity (+{int(MODERATE_SCARCITY_DELTA * 100)}%)")
        elif safe_utilization < LOW_UTILIZATION_THRESHOLD:
            multiplier += LOW_UTILIZATION_DELTA
            applied_factors.append(f"Low Fleet Demand Discount ({int(LOW_UTILIZATION_DELTA * 100)}%)")

        # 3. Location Factor (Operating Hubs: Indore, Bhopal, Gwalior)
        city_key = (city or "Indore").strip().lower()
        city_delta = CITY_FACTORS.get(city_key, DEFAULT_CITY_DELTA)
        if city_delta > 0:
            multiplier += city_delta
            applied_factors.append(f"Commercial Hub Adjustment ({city_key.title()}) (+{int(city_delta * 100)}%)")

        # 4. Strict bounding between MIN (0.90) and MAX (1.35)
        final_multiplier = round(min(MAX_DYNAMIC_MULTIPLIER, max(MIN_DYNAMIC_MULTIPLIER, multiplier)), 2)
        adjusted_rate = round(safe_base_rate * final_multiplier, 2)
        dynamic_adjustment = round(adjusted_rate - safe_base_rate, 2)

        # 5. Determine surge badge
        if final_multiplier < 1.0:
            surge_badge = BADGE_VALUE_SAVER
        elif final_multiplier == 1.0:
            surge_badge = BADGE_STANDARD_RATE
        elif final_multiplier >= 1.20:
            surge_badge = BADGE_HIGH_DEMAND_SURGE
        elif is_weekend:
            surge_badge = BADGE_WEEKEND_SURGE
        else:
            surge_badge = BADGE_MODERATE_SURGE

        potential_uplift = int(round((final_multiplier - 1.0) * 100)) if final_multiplier > 1.0 else 0
        potential_savings = int(round((1.0 - final_multiplier) * 100)) if final_multiplier < 1.0 else 0

        return {
            "baseRate": safe_base_rate,
            "multiplier": final_multiplier,
            "dynamicMultiplier": final_multiplier,
            "dynamicAdjustment": dynamic_adjustment,
            "adjustedRate": adjusted_rate,
            "surgeBadge": surge_badge,
            "appliedFactors": applied_factors if applied_factors else ["Standard Base Rate"],
            "potentialRevenueUpliftPercent": potential_uplift,
            "potentialSavingsPercent": potential_savings,
        }
