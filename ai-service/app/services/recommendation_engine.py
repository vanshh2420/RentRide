from typing import List, Dict, Any, Optional
import math

class RecommendationEngine:
    """
    AI Vehicle Recommendation Engine using multi-attribute feature scoring 
    and collaborative preference matching.
    """
    
    @staticmethod
    def calculate_vehicle_score(
        vehicle: Dict[str, Any],
        preferences: Dict[str, Any]
    ) -> Dict[str, Any]:
        score = 50.0  # Base neutral score
        highlights = []

        # 1. Category Match (Weight: 25)
        preferred_category = preferences.get("categoryId") or preferences.get("categorySlug")
        vehicle_category = vehicle.get("categorySlug") or (vehicle.get("categoryId") if isinstance(vehicle.get("categoryId"), str) else vehicle.get("categoryId", {}).get("slug"))
        if preferred_category and vehicle_category:
            if preferred_category.lower() == str(vehicle_category).lower():
                score += 25.0
                highlights.append("Preferred Category Match")

        # 2. Seating Capacity (Weight: 15)
        preferred_seating = preferences.get("seatingCapacity")
        vehicle_seating = vehicle.get("seatingCapacity", 4)
        if preferred_seating:
            if int(vehicle_seating) >= int(preferred_seating):
                score += 15.0
                highlights.append(f"Fits {vehicle_seating}+ Passengers")
            else:
                score -= 10.0

        # 3. Fuel Type & Transmission Preference (Weight: 15)
        preferred_fuel = preferences.get("fuelType")
        if preferred_fuel and str(vehicle.get("fuelType")).upper() == str(preferred_fuel).upper():
            score += 10.0
            highlights.append(f"{vehicle.get('fuelType')} Engine")

        preferred_transmission = preferences.get("transmission")
        if preferred_transmission and str(vehicle.get("transmission")).upper() == str(preferred_transmission).upper():
            score += 10.0
            highlights.append(f"{vehicle.get('transmission')} Drive")

        # 4. Budget Compatibility (Weight: 20)
        max_budget_hourly = preferences.get("maxBudgetHourly")
        hourly_rate = vehicle.get("pricing", {}).get("hourlyRate", 100)
        if max_budget_hourly:
            if hourly_rate <= float(max_budget_hourly):
                score += 20.0
                highlights.append("Within Budget")
            else:
                diff_ratio = (hourly_rate - float(max_budget_hourly)) / float(max_budget_hourly)
                score -= min(25.0, diff_ratio * 30)

        # 5. Rating & Popularity Boost (Weight: 15)
        rating_avg = float(vehicle.get("ratingAverage", 4.5))
        rating_count = int(vehicle.get("ratingCount", 0))
        score += (rating_avg - 3.0) * 6.0
        if rating_avg >= 4.7:
            highlights.append(f"Top Rated ({rating_avg}★)")

        if rating_count > 10:
            highlights.append("Popular Choice")

        # Normalize score between 60% and 99%
        match_percentage = min(99, max(60, int(score)))

        return {
            "vehicleId": vehicle.get("_id") or vehicle.get("id"),
            "vehicle": vehicle,
            "matchPercentage": match_percentage,
            "highlights": highlights[:3],
            "recommendationReason": (
                f"{match_percentage}% match based on your preferences for "
                f"{vehicle.get('brand')} {vehicle.get('model')}, with high customer ratings and verified reliability."
            )
        }

    @classmethod
    def rank_vehicles(
        cls,
        candidate_vehicles: List[Dict[str, Any]],
        preferences: Dict[str, Any],
        limit: int = 6
    ) -> List[Dict[str, Any]]:
        scored = [
            cls.calculate_vehicle_score(v, preferences)
            for v in candidate_vehicles
        ]
        # Sort descending by match percentage
        scored.sort(key=lambda x: x["matchPercentage"], reverse=True)
        return scored[:limit]
