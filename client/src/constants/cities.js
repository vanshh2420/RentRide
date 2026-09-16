/**
 * RentRide Supported Operating Cities & Landmark Metadata
 * Extensible data structure for city autocomplete and inventory filtering
 */

export const SUPPORTED_CITIES = [
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    landmark: 'Rajwada Palace',
    landmarkDescription: 'Historic 7-story Holkar Palace & cultural epicenter',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
    keywords: ['indore', 'rajwada', 'mp', 'ind', 'chappan', 'holkar', 'cleanest city'],
    popular: true,
    hubsCount: '12 Pickup Hubs'
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    landmark: 'Taj-ul-Masajid',
    landmarkDescription: 'The Crown of Mosques & scenic City of Lakes',
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=400&q=80',
    keywords: ['bhopal', 'taj-ul-masajid', 'mp', 'bho', 'upper lake', 'city of lakes'],
    popular: true,
    hubsCount: '9 Pickup Hubs'
  },
  {
    id: 'gwalior',
    name: 'Gwalior',
    state: 'Madhya Pradesh',
    landmark: 'Gwalior Fort',
    landmarkDescription: '8th-century Hill Fortress & royal Scindia heritage',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
    keywords: ['gwalior', 'gwalior fort', 'mp', 'gwl', 'scindia', 'hilltop fort'],
    popular: true,
    hubsCount: '7 Pickup Hubs'
  }
];

export const CITY_NAMES = SUPPORTED_CITIES.map((c) => c.name);

export const getCityByName = (name) => {
  if (!name) return null;
  const query = name.trim().toLowerCase();
  return SUPPORTED_CITIES.find(
    (c) => c.name.toLowerCase() === query || c.id === query
  ) || null;
};
