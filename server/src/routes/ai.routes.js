import { Router } from 'express';
import { 
  getRecommendations, 
  getDemandForecast, 
  getDynamicPricing,
  getPersonalizedOffers,
  handleAssistantChat
} from '../controllers/ai.controller.js';

const router = Router();

// Public / Customer AI Recommendations
router.get('/recommendations', getRecommendations);

// Fleet Demand Forecasting (Vendors & Public Market view)
router.get('/demand-forecast', getDemandForecast);

// Real-time Dynamic Pricing Multiplier Quote
router.post('/dynamic-pricing', getDynamicPricing);

// AI-Driven Personalized Offers (Feature C)
router.get('/personalized-offers', getPersonalizedOffers);
router.post('/personalized-offers', getPersonalizedOffers);

// AI Conversational Rental Assistant (Feature D)
router.post('/assistant', handleAssistantChat);

export default router;
