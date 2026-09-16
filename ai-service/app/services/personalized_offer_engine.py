from typing import Dict, Any, List, Optional
from collections import Counter

class PersonalizedOfferEngine:
    """
    AI behavioral personalization engine analyzing customer rental habits,
    frequent vehicle categories, rental duration, and trip recency
    to recommend tailored promotional offers.
    """

    @classmethod
    def generate_offer(
        cls,
        user_id: str,
        booking_history: List[Dict[str, Any]],
        preferred_city: str = "Indore",
        user_name: str = "Renter"
    ) -> Dict[str, Any]:
        if not booking_history or len(booking_history) == 0:
            # Welcome Offer for new or first-time customer
            return {
                "eligible": True,
                "isPersonalized": False,
                "offerType": "PERCENTAGE",
                "discountValue": 10,
                "couponCode": "WELCOME10",
                "category": "all",
                "title": "10% OFF Your First Rental",
                "badge": "Welcome Gift",
                "reason": "Welcome to RentRide! Enjoy 10% off your initial booking.",
                "minBookingAmount": 400,
                "maxDiscountAmount": 250,
                "validityDays": 14
            }

        # Analyze past booking categories and types
        categories = []
        types = []
        durations = []
        total_spent = 0.0

        for b in booking_history:
            cat = b.get("categoryName") or b.get("categorySlug") or ""
            vtype = b.get("vehicleType") or ""
            if cat:
                categories.append(cat.lower())
            if vtype:
                types.append(vtype.lower())
            durations.append(b.get("durationHours", 3))
            total_spent += b.get("totalAmount", 0)

        top_type = Counter(types).most_common(1)[0][0] if types else "all"
        top_cat = Counter(categories).most_common(1)[0][0] if categories else "all"
        avg_spend = total_spent / len(booking_history) if booking_history else 500

        # Behavioral segmentation
        if "two_wheeler" in top_type or "scooter" in top_cat or "bike" in top_cat:
            return {
                "eligible": True,
                "isPersonalized": True,
                "offerType": "PERCENTAGE",
                "discountValue": 15,
                "couponCode": "RIDEAI15",
                "category": "two_wheeler",
                "title": "15% OFF Your Next Two-Wheeler Rental",
                "badge": "Frequent Rider Perk",
                "reason": f"Because you frequently choose two-wheelers for flexible city commuting in {preferred_city}.",
                "minBookingAmount": 350,
                "maxDiscountAmount": 200,
                "validityDays": 7
            }
        elif "four_wheeler" in top_type or "suv" in top_cat or "sedan" in top_cat:
            discount = 12 if avg_spend < 3000 else 18
            code = "ROADTRIP12" if discount == 12 else "PREMIUM18"
            return {
                "eligible": True,
                "isPersonalized": True,
                "offerType": "PERCENTAGE",
                "discountValue": discount,
                "couponCode": code,
                "category": "four_wheeler",
                "title": f"{discount}% OFF Your Next Weekend Roadtrip",
                "badge": "VIP Roadtripper",
                "reason": f"Exclusive offer based on your travel history and car rental preference in {preferred_city}.",
                "minBookingAmount": 1500,
                "maxDiscountAmount": 600,
                "validityDays": 7
            }
        else:
            return {
                "eligible": True,
                "isPersonalized": True,
                "offerType": "PERCENTAGE",
                "discountValue": 12,
                "couponCode": "EXPLORE12",
                "category": "all",
                "title": "12% OFF Next Adventure",
                "badge": "Explorer Reward",
                "reason": f"Thank you for choosing RentRide in {preferred_city}. Here is a personalized discount.",
                "minBookingAmount": 500,
                "maxDiscountAmount": 300,
                "validityDays": 10
            }
