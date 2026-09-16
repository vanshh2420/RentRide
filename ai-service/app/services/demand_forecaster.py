from typing import Dict, Any, List
from datetime import datetime, timedelta

class DemandForecaster:
    """
    Time-series demand forecaster analyzing day-of-week seasonality, 
    local city multipliers, and fleet utilization trends.
    """

    DAY_FACTORS = {
        0: 0.85,  # Monday
        1: 0.80,  # Tuesday
        2: 0.90,  # Wednesday
        3: 1.05,  # Thursday
        4: 1.45,  # Friday (High Weekend Surge)
        5: 1.60,  # Saturday (Peak Demand)
        6: 1.35   # Sunday
    }

    CITY_FACTORS = {
        "indore": 1.20,
        "bhopal": 1.15,
        "gwalior": 1.10,
        "bangalore": 1.25,
        "bengaluru": 1.25,
        "mumbai": 1.25,
        "delhi": 1.18,
        "pune": 1.12,
        "hyderabad": 1.15,
        "goa": 1.40
    }

    CATEGORY_FACTORS = {
        "suv": 1.25,
        "sports-car": 1.30,
        "cruiser-bike": 1.20,
        "scooter": 1.15,
        "electric-scooter": 1.22,
        "two_wheeler": 1.18,
        "four_wheeler": 1.12,
        "hatchback": 0.95,
        "sedan": 1.00,
        "all": 1.00
    }

    @classmethod
    def forecast_7_days(
        cls,
        city: str = "Indore",
        category: str = "all",
        current_utilization: float = 0.50
    ) -> Dict[str, Any]:
        norm_city = (city or "Indore").lower().strip()
        norm_cat = (category or "all").lower().strip()

        city_factor = cls.CITY_FACTORS.get(norm_city, 1.05)
        cat_factor = cls.CATEGORY_FACTORS.get(norm_cat, 1.0)

        forecasts = []
        today = datetime.now()

        peak_days = []
        highest_day = None
        max_index = 0.0

        for i in range(7):
            day_date = today + timedelta(days=i)
            day_of_week = day_date.weekday()
            base_day_factor = cls.DAY_FACTORS.get(day_of_week, 1.0)

            # Combined raw demand index
            raw_index = base_day_factor * (0.6 + 0.4 * city_factor) * (0.7 + 0.3 * cat_factor)
            
            # Incorporate current utilization pressure
            demand_index = round(raw_index * (0.8 + 0.4 * current_utilization), 2)

            # Determine demand level & surge band
            if demand_index >= 1.50:
                demand_level = "PEAK"
                multiplier = 1.25
            elif demand_index >= 1.30:
                demand_level = "VERY HIGH"
                multiplier = 1.20
            elif demand_index >= 1.15:
                demand_level = "HIGH"
                multiplier = 1.15
            elif demand_index >= 0.95:
                demand_level = "MEDIUM"
                multiplier = 1.00
            else:
                demand_level = "LOW"
                multiplier = 0.95

            if demand_index > max_index:
                max_index = demand_index
                highest_day = day_date.strftime("%A")

            if demand_level in ["HIGH", "VERY HIGH", "PEAK"]:
                peak_days.append(day_date.strftime("%A"))

            predicted_utilization = min(98, max(25, int(demand_index * 55)))

            forecasts.append({
                "date": day_date.strftime("%Y-%m-%d"),
                "dayName": day_date.strftime("%A"),
                "demandIndex": demand_index,
                "demandLevel": demand_level,
                "surgeLevel": demand_level,
                "predictedUtilization": predicted_utilization,
                "recommendedMultiplier": multiplier
            })

        avg_demand = round(sum(f["demandIndex"] for f in forecasts) / len(forecasts), 2)

        # Dynamic, forecast-driven operational insight
        cat_display = norm_cat.replace('_', ' ').replace('-', ' ')
        if cat_display == "all":
            cat_display = "overall fleet"

        city_display = city.capitalize()
        peak_summary = ", ".join(list(dict.fromkeys(peak_days))) if peak_days else "the weekend"

        insight = (
            f"Demand for {cat_display} in {city_display} is projected to peak on {highest_day} "
            f"(demand index: {max_index}x, predicted utilization: {forecasts[5]['predictedUtilization']}%). "
            f"High mobility pressure expected across {peak_summary}."
        )

        recommendation = (
            f"Increase {cat_display} fleet availability in {city_display} ahead of {highest_day}. "
            f"Consider applying a +{int((forecasts[5]['recommendedMultiplier'] - 1) * 100)}% dynamic rate surge "
            f"to capture maximum revenue during peak rental windows."
        )

        return {
            "city": city,
            "category": category,
            "averageDemandIndex": avg_demand,
            "forecastHorizonDays": 7,
            "dailyForecasts": forecasts,
            "forecast": forecasts,
            "insight": insight,
            "recommendation": recommendation
        }
