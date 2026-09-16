import re
from typing import Dict, Any, List, Optional

class RentalAssistantEngine:
    """
    Conversational AI intent parser and dialogue engine for the RentRide Assistant.
    Parses user requests regarding vehicle discovery, pricing plans, availability,
    cancellation policies, nearby hubs, and personalized discounts.
    """

    @classmethod
    def parse_query(
        cls,
        message: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        msg = (message or "").lower().strip()
        user_city = (user_context or {}).get("city", "Indore")
        user_name = (user_context or {}).get("name", "Traveler")

        # 1. Rental Plans Explanation
        if any(w in msg for w in ["plan", "hourly", "12-hour", "12 hour", "24-hour", "24 hour", "day pass"]):
            return {
                "intent": "EXPLAIN_PLANS",
                "reply": (
                    "RentRide offers three transparent rental plans tailored to your journey:\n\n"
                    "⏱️ **Hourly Plan**: Pay only for the exact hours you ride (min 1 hour). Perfect for quick errands.\n"
                    "☀️ **12-Hour Day Pass**: Flat discounted rate for full-day work commutes or city day trips.\n"
                    "🌙 **24-Hour Overnight**: Maximum value for weekend road trips and multi-day travel.\n\n"
                    "Would you like me to recommend vehicles under a specific plan?"
                ),
                "suggestedActions": [
                    "Show Hourly Bikes",
                    "Show 12-Hour Cars",
                    "Explain Security Deposit"
                ],
                "filters": {}
            }

        # 2. Security Deposit & Pricing Breakdown
        if any(w in msg for w in ["deposit", "security", "pricing", "gst", "fee", "cost", "surge", "breakdown"]):
            return {
                "intent": "EXPLAIN_PRICING",
                "reply": (
                    "Here is how RentRide pricing works:\n\n"
                    "1. **Base Rental**: Determined by your selected plan (Hourly / 12h / 24h).\n"
                    "2. **Weekend Surge**: +15% multiplier applied during peak Saturday & Sunday slots.\n"
                    "3. **Platform Fee**: A standard 5% customer convenience fee.\n"
                    "4. **GST**: 18% statutory tax calculated on the subtotal.\n"
                    "5. **Refundable Deposit**: Typically ₹1,000 held as security, refunded upon vehicle return."
                ),
                "suggestedActions": [
                    "What is cancellation policy?",
                    "Find vehicles under ₹1,000",
                    "Do you have coupons?"
                ],
                "filters": {}
            }

        # 3. Cancellation & Refund Policy
        if any(w in msg for w in ["cancel", "refund", "return", "policy", "penalty"]):
            return {
                "intent": "EXPLAIN_POLICIES",
                "reply": (
                    "🛡️ **RentRide Cancellation & Refund Policy**:\n\n"
                    "• **> 24 hours before pickup**: Full refund minus a nominal 5% processing fee.\n"
                    "• **12 to 24 hours before pickup**: 50% rental refund + 100% security deposit returned.\n"
                    "• **< 12 hours before pickup**: Security deposit is 100% refunded; base rental is retained.\n\n"
                    "You can cancel any upcoming trip directly from **My Bookings** before the vendor hands over the vehicle."
                ),
                "suggestedActions": [
                    "View My Bookings",
                    "Find Rides Near Me",
                    "How does handover work?"
                ],
                "filters": {}
            }

        # 4. Offers & Coupons
        if any(w in msg for w in ["offer", "coupon", "discount", "promo", "deal"]):
            return {
                "intent": "OFFERS_QUERY",
                "reply": (
                    f"🎁 Great news, {user_name}! We have AI-personalized discounts active right now:\n\n"
                    "• Use code **RIDEAI15** for 15% off two-wheelers\n"
                    "• Use code **WELCOME10** for 10% off your initial booking\n\n"
                    "You can apply these codes right at the checkout screen!"
                ),
                "suggestedActions": [
                    "Explore Two-Wheelers",
                    "Find Nearby Vehicles",
                    "View Fleet in Indore"
                ],
                "filters": {}
            }

        # 5. Nearby Vehicles
        if any(w in msg for w in ["near", "nearby", "close", "around me", "location", "hub", "map"]):
            return {
                "intent": "FIND_NEARBY",
                "reply": (
                    f"I can locate the nearest available vehicles around you in {user_city}! "
                    "Allow location access or view our interactive pickup hub map to see verified vehicles parked at nearby vendor desks."
                ),
                "suggestedActions": [
                    "Find Rides Near Me",
                    "Explore Map View",
                    "Browse All Cities"
                ],
                "filters": { "nearby": True }
            }

        # 6. Vehicle Discovery & Search Queries
        budget_match = re.search(r"(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)", msg)
        max_budget = int(budget_match.group(1)) if budget_match else None

        extracted_type = None
        if any(w in msg for w in ["bike", "motorcycle", "two-wheeler", "2-wheeler", "bullet", "hunter", "scooter", "activa"]):
            extracted_type = "two_wheeler"
        elif any(w in msg for w in ["car", "suv", "hatchback", "sedan", "creta", "four-wheeler", "4-wheeler"]):
            extracted_type = "four_wheeler"

        fuel_type = None
        if "electric" in msg or "ev" in msg:
            fuel_type = "electric"
        elif "diesel" in msg:
            fuel_type = "diesel"
        elif "petrol" in msg:
            fuel_type = "petrol"
        elif "cng" in msg:
            fuel_type = "cng"

        transmission = None
        if "automatic" in msg:
            transmission = "automatic"
        elif "manual" in msg:
            transmission = "manual"

        city = None
        if "indore" in msg:
            city = "Indore"
        elif "bhopal" in msg:
            city = "Bhopal"
        elif "gwalior" in msg:
            city = "Gwalior"

        filters = {
            "vehicleType": extracted_type,
            "fuelType": fuel_type,
            "transmission": transmission,
            "maxBudget": max_budget,
            "city": city or user_city
        }

        # Clean empty keys
        clean_filters = {k: v for k, v in filters.items() if v is not None}

        reply_parts = []
        if extracted_type:
            reply_parts.append(f"{'two-wheelers' if extracted_type == 'two_wheeler' else 'cars'}")
        if fuel_type:
            reply_parts.append(f"with {fuel_type} motors")
        if transmission:
            reply_parts.append(f"with {transmission} transmission")
        if max_budget:
            reply_parts.append(f"under ₹{max_budget}")
        if city:
            reply_parts.append(f"in {city}")

        criteria_str = " ".join(reply_parts) if reply_parts else "top recommended fleet vehicles"

        return {
            "intent": "DISCOVER_VEHICLES",
            "reply": (
                f"I found the best verified options matching your search for **{criteria_str}**. "
                "Here are live available rides with instant booking guaranteed:"
            ),
            "suggestedActions": [
                "Find Automatic Cars",
                "Electric Scooters",
                "Vehicles Under ₹800"
            ],
            "filters": clean_filters
        }
