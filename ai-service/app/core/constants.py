"""
RentRide AI Service - Centralized Pricing Constants
Matches server/src/constants/pricing.js
"""

MIN_DYNAMIC_MULTIPLIER = 0.90
MAX_DYNAMIC_MULTIPLIER = 1.35
BASE_MULTIPLIER = 1.00

# Demand / Fleet Scarcity Thresholds and Deltas
LOW_UTILIZATION_THRESHOLD = 0.30
LOW_UTILIZATION_DELTA = -0.07

MODERATE_SCARCITY_THRESHOLD = 0.70
MODERATE_SCARCITY_DELTA = 0.08

HIGH_SCARCITY_THRESHOLD = 0.85
HIGH_SCARCITY_DELTA = 0.15

# Day / Time Deltas
# Python weekday(): Monday=0, Tuesday=1, Wednesday=2, Thursday=3, Friday=4, Saturday=5, Sunday=6
OFF_PEAK_WEEKDAY_DAYS = [1, 2] # Tuesday (1), Wednesday (2)
OFF_PEAK_WEEKDAY_DELTA = -0.03
FRIDAY_DELTA = 0.10
SATURDAY_DELTA = 0.15
SUNDAY_DELTA = 0.10

# Location / City Factors (RentRide Operational Hubs)
CITY_FACTORS = {
    "indore": 0.03,
    "bhopal": 0.00,
    "gwalior": 0.00
}
DEFAULT_CITY_DELTA = 0.00

# Badge Constants
BADGE_VALUE_SAVER = "VALUE_SAVER"
BADGE_STANDARD_RATE = "STANDARD_RATE"
BADGE_WEEKEND_SURGE = "WEEKEND_SURGE"
BADGE_MODERATE_SURGE = "MODERATE_SURGE"
BADGE_HIGH_DEMAND_SURGE = "HIGH_DEMAND_SURGE"
