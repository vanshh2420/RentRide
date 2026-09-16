import axios from 'axios';
import { Vehicle } from '../models/vehicle.model.js';
import { Booking } from '../models/booking.model.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';

let rawAiUrl = (process.env.AI_SERVICE_URL || 'http://localhost:8000').trim();
if (!rawAiUrl.endsWith('/api/v1')) {
  rawAiUrl = rawAiUrl.replace(/\/+$/, '') + '/api/v1';
}
const AI_BASE_URL = rawAiUrl;
const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'rentride_ai_internal_secret_key_2026';

const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    'X-AI-API-KEY': AI_API_KEY
  }
});

export class AiService {
  /**
   * Get AI Personalized Vehicle Recommendations
   */
  static async getRecommendations({ categoryId, fuelType, transmission, maxBudget, city, limit = 6 }) {
    let candidateVehicles = [];
    try {
      const query = { status: 'AVAILABLE', isApproved: true };
      if (city && city !== 'all') query['location.city'] = { $regex: city, $options: 'i' };

      candidateVehicles = await Vehicle.find(query)
        .populate('categoryId', 'name slug type')
        .populate('vendorId', 'name vendorProfile')
        .limit(30)
        .lean()
        .maxTimeMS(2000);
    } catch (err) {
      console.warn('[AI Service Warning] Database query unavailable, using sample vehicles:', err.message);
    }

    if (!candidateVehicles || candidateVehicles.length === 0) {
      candidateVehicles = [
        {
          _id: 'mock_v1',
          brand: 'Royal Enfield',
          model: 'Hunter 350',
          pricing: { hourlyRate: 90, rate12Hour: 750, rate24Hour: 1100 },
          fuelEconomy: 36,
          fuelEconomyUnit: 'km/l',
          ratingAverage: 4.8,
          images: [{ url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80' }],
          location: { city: city || 'Indore', address: 'Vijay Nagar Hub' }
        },
        {
          _id: 'mock_v2',
          brand: 'Hyundai',
          model: 'Creta SX',
          pricing: { hourlyRate: 350, rate12Hour: 2800, rate24Hour: 4200 },
          fuelEconomy: 17,
          fuelEconomyUnit: 'km/l',
          ratingAverage: 4.9,
          images: [{ url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' }],
          location: { city: city || 'Indore', address: 'Bhawarkua Hub' }
        }
      ];
    }

    try {
      const response = await aiClient.post('/recommendations', {
        vehicles: candidateVehicles,
        preferences: {
          categoryId,
          fuelType,
          transmission,
          maxBudgetHourly: maxBudget
        },
        limit: Number(limit)
      });

      if (response.data?.recommendations) {
        return response.data.recommendations;
      }
    } catch (err) {
      console.warn('[AI Service Warning] Falling back to heuristic ranking:', err.message);
    }

    return candidateVehicles
      .sort((a, b) => (b.ratingAverage || 4.5) - (a.ratingAverage || 4.5))
      .slice(0, Number(limit))
      .map((v) => ({
        vehicleId: v._id,
        vehicle: v,
        matchPercentage: Math.floor(90 + Math.random() * 8),
        highlights: ['Top Rated in Fleet', 'Verified Reliability', 'Instant Booking'],
        recommendationReason: `Recommended ${v.brand} ${v.model} based on popularity and stellar customer feedback.`
      }));
  }

  /**
   * Enhanced 7-Day Demand Forecast for Vendor Fleet Planning
   */
  static async getDemandForecast({ city = 'Indore', category = 'all' }) {
    let utilization = 0.65;
    try {
      const [totalFleet, activeBookings] = await Promise.all([
        Vehicle.countDocuments({ isApproved: true }).maxTimeMS(2000),
        Booking.countDocuments({ status: { $in: ['CONFIRMED', 'ACTIVE'] } }).maxTimeMS(2000)
      ]);
      utilization = totalFleet > 0 ? Math.min(1.0, activeBookings / totalFleet) : 0.50;
    } catch (err) {
      utilization = 0.60;
    }

    try {
      const response = await aiClient.post('/demand-forecast', {
        city,
        category,
        currentUtilization: utilization
      });

      if (response.data?.forecast) {
        return response.data.forecast;
      }
    } catch (err) {
      console.warn('[AI Service Warning] Falling back to dynamic heuristic forecast:', err.message);
    }

    // Dynamic heuristic forecast fallback
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyForecasts = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayNum = d.getDay();
      const isWeekend = dayNum === 5 || dayNum === 6;
      const isFriday = dayNum === 5;
      const isSaturday = dayNum === 6;

      let demandIndex = 0.95;
      let demandLevel = 'MEDIUM';
      let multiplier = 1.00;
      let predictedUtil = 55;

      if (isSaturday) {
        demandIndex = 1.58;
        demandLevel = 'PEAK';
        multiplier = 1.25;
        predictedUtil = 90;
      } else if (isFriday) {
        demandIndex = 1.38;
        demandLevel = 'VERY HIGH';
        multiplier = 1.20;
        predictedUtil = 80;
      } else if (dayNum === 0) { // Sunday
        demandIndex = 1.22;
        demandLevel = 'HIGH';
        multiplier = 1.15;
        predictedUtil = 75;
      } else if (dayNum === 4) { // Thursday
        demandIndex = 1.10;
        demandLevel = 'HIGH';
        multiplier = 1.05;
        predictedUtil = 65;
      }

      return {
        date: d.toISOString().split('T')[0],
        dayName: days[dayNum],
        demandIndex,
        demandLevel,
        surgeLevel: demandLevel,
        predictedUtilization: predictedUtil,
        recommendedMultiplier: multiplier
      };
    });

    const catDisplay = category === 'all' ? 'overall fleet' : category.replace('_', ' ');
    const cityDisplay = (city || 'Indore').charAt(0).toUpperCase() + (city || 'Indore').slice(1);

    return {
      city: cityDisplay,
      category,
      averageDemandIndex: 1.18,
      forecastHorizonDays: 7,
      dailyForecasts,
      forecast: dailyForecasts,
      insight: `Peak rental demand forecasted for ${catDisplay} in ${cityDisplay} on Friday & Saturday (up to 90% utilization).`,
      recommendation: `Increase ${catDisplay} fleet availability in ${cityDisplay} ahead of the weekend. A +15% to +25% rate adjustment will optimize revenue.`
    };
  }

  /**
   * Real-time Dynamic Pricing Multiplier
   */
  static async getDynamicPricing({ baseRate, rentalDate, categorySlug = 'general', city = 'Indore' }) {
    try {
      const response = await aiClient.post('/dynamic-pricing', {
        baseRate: Number(baseRate),
        rentalDate: rentalDate || new Date().toISOString(),
        categorySlug,
        city,
        fleetUtilization: 0.65
      });

      if (response.data?.pricing) {
        return response.data.pricing;
      }
    } catch (err) {
      console.warn('[AI Service Warning] Falling back to standard pricing:', err.message);
    }

    const d = new Date(rentalDate || Date.now());
    const isWeekend = d.getDay() === 5 || d.getDay() === 6;
    const mult = isWeekend ? 1.15 : 1.00;

    return {
      baseRate: Number(baseRate),
      multiplier: mult,
      adjustedRate: Math.round(Number(baseRate) * mult),
      surgeBadge: isWeekend ? 'WEEKEND_SURGE' : 'STANDARD_RATE',
      appliedFactors: isWeekend ? ['Weekend Surge (+15%)'] : ['Standard Base Rate'],
      potentialRevenueUpliftPercent: isWeekend ? 15 : 0
    };
  }

  /**
   * AI-Driven Personalized Offers based on Customer Rental Habits
   */
  static async getPersonalizedOffers({ userId, city = 'Indore' }) {
    let bookingHistory = [];
    let userName = 'Traveler';

    if (userId) {
      try {
        const [user, pastBookings] = await Promise.all([
          User.findById(userId).select('name').lean(),
          Booking.find({ customerId: userId, status: { $in: ['CONFIRMED', 'ACTIVE', 'COMPLETED'] } })
            .populate('vehicleId', 'brand model fuelType categoryId')
            .limit(10)
            .lean()
        ]);

        if (user?.name) userName = user.name;

        if (pastBookings && pastBookings.length > 0) {
          bookingHistory = pastBookings.map((b) => ({
            categorySlug: b.vehicleId?.fuelType || 'general',
            vehicleType: b.vehicleId?.fuelType === 'electric' ? 'electric' : 'petrol',
            durationHours: b.durationHours || 4,
            totalAmount: b.priceBreakdown?.totalAmount || 800
          }));
        }
      } catch (err) {
        console.warn('[AI Service Warning] Could not fetch past bookings for offer personalization:', err.message);
      }
    }

    try {
      const response = await aiClient.post('/personalized-offers', {
        userId: userId || 'anonymous',
        bookingHistory,
        preferredCity: city,
        userName
      });

      if (response.data?.offer) {
        return response.data.offer;
      }
    } catch (err) {
      console.warn('[AI Service Warning] Falling back to deterministic offer generator:', err.message);
    }

    // Heuristic Fallback Offer
    if (bookingHistory.length > 0) {
      return {
        eligible: true,
        isPersonalized: true,
        offerType: 'PERCENTAGE',
        discountValue: 15,
        couponCode: 'RIDEAI15',
        category: 'two_wheeler',
        title: '15% OFF Your Next City Ride',
        badge: 'Frequent Rider Reward',
        reason: `Exclusive discount tailored for you based on your verified rental activity in ${city}.`,
        minBookingAmount: 350,
        maxDiscountAmount: 200,
        validityDays: 7
      };
    }

    return {
      eligible: true,
      isPersonalized: false,
      offerType: 'PERCENTAGE',
      discountValue: 10,
      couponCode: 'WELCOME10',
      category: 'all',
      title: '10% OFF Your First Rental',
      badge: 'Welcome Perk',
      reason: `Welcome to RentRide! Enjoy a verified 10% discount on your initial booking in ${city}.`,
      minBookingAmount: 400,
      maxDiscountAmount: 250,
      validityDays: 14
    };
  }

  /**
   * Conversational AI Rental Assistant Orchestrator
   */
  static async handleAssistantQuery({ message, userContext = {} }) {
    let assistantData = null;

    try {
      const response = await aiClient.post('/assistant', {
        message,
        userContext
      });
      if (response.data?.assistant) {
        assistantData = response.data.assistant;
      }
    } catch (err) {
      console.warn('[AI Service Warning] Assistant service offline, using heuristic fallback:', err.message);
    }

    // Heuristic fallback dialogue parser if Python service is offline
    if (!assistantData) {
      const msg = (message || '').toLowerCase();
      if (msg.includes('plan') || msg.includes('hour')) {
        assistantData = {
          intent: 'EXPLAIN_PLANS',
          reply: 'RentRide provides 3 flexible plans: Hourly (pay by the hour, min 1 hr), 12-Hour Day Pass (ideal for day trips), and 24-Hour Overnight (best for weekend getaways).',
          suggestedActions: ['Show Hourly Bikes', 'Show 12-Hour Cars', 'Explain Security Deposit'],
          filters: {}
        };
      } else if (msg.includes('deposit') || msg.includes('price') || msg.includes('cost')) {
        assistantData = {
          intent: 'EXPLAIN_PRICING',
          reply: 'Our pricing includes: Base Plan + Weekend Surge (1.15x on Sat/Sun) + 5% Platform Fee + 18% GST + Refundable Security Deposit (typically ₹1,000 returned on trip completion).',
          suggestedActions: ['What is cancellation policy?', 'Find vehicles under ₹800', 'Show Active Coupons'],
          filters: {}
        };
      } else if (msg.includes('cancel') || msg.includes('refund')) {
        assistantData = {
          intent: 'EXPLAIN_POLICIES',
          reply: 'Cancellation is free (>24h prior: 100% refund minus 5% fee; 12-24h prior: 50% rental refund + 100% deposit; <12h: deposit refunded). Cancel anytime from My Bookings.',
          suggestedActions: ['View My Bookings', 'Find Rides Near Me', 'Show Top Bikes'],
          filters: {}
        };
      } else {
        const isBike = msg.includes('bike') || msg.includes('scooter') || msg.includes('two');
        const isCar = msg.includes('car') || msg.includes('suv');
        assistantData = {
          intent: 'DISCOVER_VEHICLES',
          reply: `Here are verified available vehicles matching "${message}". You can inspect specifications or proceed to instant checkout!`,
          suggestedActions: ['Find Bikes under ₹800', 'Electric Vehicles', 'Show Cars in Indore'],
          filters: {
            vehicleType: isBike ? 'two_wheeler' : isCar ? 'four_wheeler' : undefined
          }
        };
      }
    }

    // If intent is discovery, query real matching vehicles from MongoDB
    let matchedVehicles = [];
    if (assistantData.intent === 'DISCOVER_VEHICLES' || assistantData.intent === 'FIND_NEARBY') {
      try {
        const query = { status: 'AVAILABLE', isApproved: true };
        const f = assistantData.filters || {};

        if (f.city) query['location.city'] = { $regex: f.city, $options: 'i' };
        if (f.fuelType) query.fuelType = f.fuelType;
        if (f.transmission) query.transmission = f.transmission;
        if (f.maxBudget) query['pricing.hourlyRate'] = { $lte: Number(f.maxBudget) };

        matchedVehicles = await Vehicle.find(query)
          .populate('categoryId', 'name slug type')
          .populate('vendorId', 'name vendorProfile')
          .limit(4)
          .lean();

        if (f.vehicleType && matchedVehicles.length > 0) {
          matchedVehicles = matchedVehicles.filter(v => v.categoryId?.type === f.vehicleType);
        }
      } catch (err) {
        console.warn('[AI Service Warning] Failed to query vehicles for assistant:', err.message);
      }
    }

    return {
      reply: assistantData.reply,
      intent: assistantData.intent,
      suggestedActions: assistantData.suggestedActions || ['Find Bikes', 'Find Cars', 'Explain Plans'],
      vehicles: matchedVehicles
    };
  }
}
