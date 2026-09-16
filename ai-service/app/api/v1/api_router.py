from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.security import verify_api_key
from app.services.recommendation_engine import RecommendationEngine
from app.services.demand_forecaster import DemandForecaster
from app.services.dynamic_pricing_engine import DynamicPricingEngine
from app.services.personalized_offer_engine import PersonalizedOfferEngine
from app.services.rental_assistant_engine import RentalAssistantEngine

api_router = APIRouter()

class RecommendationRequest(BaseModel):
    vehicles: List[Dict[str, Any]] = Field(..., description="Candidate vehicle listings")
    preferences: Dict[str, Any] = Field(default_factory=dict, description="User preference filters")
    limit: Optional[int] = Field(default=6, description="Max recommendations to return")

class DemandForecastRequest(BaseModel):
    city: str = Field(default="Indore")
    category: str = Field(default="all")
    currentUtilization: float = Field(default=0.50, ge=0.0, le=1.0)

class DynamicPricingRequest(BaseModel):
    baseRate: float = Field(..., gt=0)
    rentalDate: str = Field(..., description="ISO format datetime")
    categorySlug: Optional[str] = Field(default="general")
    city: Optional[str] = Field(default="Indore")
    fleetUtilization: Optional[float] = Field(default=0.50, ge=0.0, le=1.0)

class PersonalizedOfferRequest(BaseModel):
    userId: str = Field(..., description="Customer user identifier")
    bookingHistory: List[Dict[str, Any]] = Field(default_factory=list, description="Customer past rental records")
    preferredCity: Optional[str] = Field(default="Indore")
    userName: Optional[str] = Field(default="Traveler")

class AssistantRequest(BaseModel):
    message: str = Field(..., description="User message or prompt")
    userContext: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User metadata and location")

@api_router.get("/status", dependencies=[Depends(verify_api_key)])
async def get_ai_status():
    return {
        "status": "ready",
        "modules": [
            "vehicle_recommendations",
            "demand_prediction",
            "dynamic_pricing",
            "personalized_offers",
            "rental_assistant"
        ]
    }

@api_router.post("/recommendations", dependencies=[Depends(verify_api_key)])
async def get_vehicle_recommendations(req: RecommendationRequest):
    try:
        ranked = RecommendationEngine.rank_vehicles(
            candidate_vehicles=req.vehicles,
            preferences=req.preferences,
            limit=req.limit or 6
        )
        return {
            "success": True,
            "count": len(ranked),
            "recommendations": ranked
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/demand-forecast", dependencies=[Depends(verify_api_key)])
async def get_demand_forecast(req: DemandForecastRequest):
    try:
        forecast = DemandForecaster.forecast_7_days(
            city=req.city,
            category=req.category,
            current_utilization=req.currentUtilization
        )
        return {
            "success": True,
            "forecast": forecast
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/dynamic-pricing", dependencies=[Depends(verify_api_key)])
async def get_dynamic_pricing(req: DynamicPricingRequest):
    try:
        pricing = DynamicPricingEngine.calculate_dynamic_rate(
            base_rate=req.baseRate,
            rental_date_str=req.rentalDate,
            category_slug=req.categorySlug or "general",
            city=req.city or "Indore",
            fleet_utilization=req.fleetUtilization or 0.50
        )
        return {
            "success": True,
            "pricing": pricing
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/personalized-offers", dependencies=[Depends(verify_api_key)])
async def get_personalized_offers(req: PersonalizedOfferRequest):
    try:
        offer = PersonalizedOfferEngine.generate_offer(
            user_id=req.userId,
            booking_history=req.bookingHistory,
            preferred_city=req.preferredCity or "Indore",
            user_name=req.userName or "Traveler"
        )
        return {
            "success": True,
            "offer": offer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/assistant", dependencies=[Depends(verify_api_key)])
async def process_assistant_message(req: AssistantRequest):
    try:
        response = RentalAssistantEngine.parse_query(
            message=req.message,
            user_context=req.userContext
        )
        return {
            "success": True,
            "assistant": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
