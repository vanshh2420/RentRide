/**
 * RentRide Supported Cities Definition (Backend)
 */

export const SUPPORTED_CITIES = ['Indore', 'Bhopal', 'Gwalior'];

export const isSupportedCity = (city) => {
  if (!city || typeof city !== 'string') return false;
  return SUPPORTED_CITIES.some(
    (c) => c.toLowerCase() === city.trim().toLowerCase()
  );
};
