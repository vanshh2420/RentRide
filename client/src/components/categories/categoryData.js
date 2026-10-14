/**
 * CANONICAL FLEET CATEGORY DATA
 * 
 * Centralized, high-precision configuration mapping each fleet category
 * to its exact representative real-world vehicle, variant, color, and studio imagery.
 * Treated as the single source of truth across Home and Categories pages.
 */

export const CATEGORY_VEHICLES = [
  {
    id: 'bikes',
    slug: 'bikes',
    categoryName: 'Bikes',
    vehicleName: 'Royal Enfield Meteor 350',
    variantColor: 'Fireball Black',
    colorHex: '#18181b',
    borderColor: 'rgba(250, 204, 21, 0.4)',
    imageUrl: '/categories/royal-enfield-meteor-350-fireball-black.jpg',
    altText: 'Royal Enfield Meteor 350 Fireball Black motorcycle',
    ctaText: 'Explore Bikes',
    categoryTag: 'Cruiser',
    route: '/explore?category=bikes'
  },
  {
    id: 'hatchbacks',
    slug: 'hatchbacks',
    categoryName: 'Hatchbacks',
    vehicleName: 'Maruti Suzuki Baleno',
    variantColor: 'Blue',
    colorHex: '#1d4ed8',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    imageUrl: '/categories/maruti-suzuki-baleno-blue.jpg',
    altText: 'Maruti Suzuki Baleno blue hatchback',
    ctaText: 'Explore Hatchbacks',
    categoryTag: 'Premium Hatch',
    route: '/explore?category=hatchbacks'
  },
  {
    id: 'suvs',
    slug: 'suvs',
    categoryName: 'SUVs',
    vehicleName: 'Hyundai Creta',
    variantColor: 'Black',
    colorHex: '#09090b',
    borderColor: 'rgba(148, 163, 184, 0.4)',
    imageUrl: '/categories/hyundai-creta-black.jpg',
    altText: 'Hyundai Creta black SUV',
    ctaText: 'Explore SUVs',
    categoryTag: 'Prime SUV',
    route: '/explore?category=suvs'
  },
  {
    id: 'scooters',
    slug: 'scooters',
    categoryName: 'Scooters',
    vehicleName: 'Honda Activa 6G',
    variantColor: 'Blue',
    colorHex: '#0284c7',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    imageUrl: '/categories/honda-activa-6g-blue.jpg',
    altText: 'Honda Activa 6G blue scooter',
    ctaText: 'Explore Scooters',
    categoryTag: 'City Commuter',
    route: '/explore?category=scooters'
  },
  {
    id: 'sedans',
    slug: 'sedans',
    categoryName: 'Sedans',
    vehicleName: 'Hyundai Verna',
    variantColor: 'White',
    colorHex: '#f8fafc',
    borderColor: 'rgba(241, 245, 249, 0.6)',
    imageUrl: '/categories/hyundai-verna-white.jpg',
    altText: 'Hyundai Verna white sedan',
    ctaText: 'Explore Sedans',
    categoryTag: 'Executive Sedan',
    route: '/explore?category=sedans'
  }
];

export default CATEGORY_VEHICLES;
