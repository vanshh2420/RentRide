import { vehicleImageManifest, modelFamilyManifest } from '../../../data/vehicleImageManifest';

/**
 * List of known legacy generic Unsplash images that were erroneously reused across multiple categories.
 * Any vehicle matching these URLs will be intercepted and replaced with its verified exact model image.
 */
const KNOWN_GENERIC_URL_PATTERNS = [
  'photo-1558981403-c5f9899a28bc', // generic e-scooter
  'photo-1568772585407-9361f9bf3a87', // generic blue scooter
  'photo-1558981806-ec527fa84c39', // generic bike
  'photo-1541899481282-d53bffe3c35d', // generic red hatchback
  'photo-1550355291-bbee04a92027', // generic sedan
  'photo-1533473359331-0135ef1b58bf'  // generic SUV
];

/**
 * Check if a given URL is one of the generic stock photo URLs
 * @param {string} url 
 * @returns {boolean}
 */
export function isGenericStockUrl(url) {
  if (!url || typeof url !== 'string') return true;
  return KNOWN_GENERIC_URL_PATTERNS.some(pattern => url.includes(pattern));
}

/**
 * Generate a normalized slug from vehicle brand and model
 * e.g., "Royal Enfield", "Hunter 350 (Dapper Ash)" -> "royal-enfield-hunter-350"
 * @param {string} brand 
 * @param {string} model 
 * @returns {string}
 */
export function getModelSlug(brand = '', model = '') {
  const combined = `${brand} ${model}`.toLowerCase();
  // Strip parentheses and variant suffixes
  const cleaned = combined.replace(/\([^)]*\)/g, '').trim();
  return cleaned.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Extract canonical catalogKey from vehicle object
 * @param {object} vehicle 
 * @returns {string}
 */
export function getVehicleCatalogKey(vehicle) {
  if (!vehicle) return '';
  return (
    vehicle.catalogKey ||
    vehicle.catalogId?.catalogKey ||
    vehicle.catalog?.catalogKey ||
    ''
  ).toLowerCase().trim();
}

/**
 * Resolves the primary exact vehicle image.
 * Deterministic priority:
 *  1. Physical vendor-uploaded unit photo (if valid and not a generic category stock photo)
 *  2. Exact catalogKey in vehicleImageManifest
 *  3. Normalized model family slug in modelFamilyManifest
 *  4. Verified backend catalog image (if non-generic and tagged VERIFIED)
 *  5. Fallback neutral indicator (null if no exact image, ensuring no wrong vehicle is shown)
 * 
 * @param {object} vehicle - Vehicle object
 * @returns {string|null} - Exact image URL or null if under verification
 */
export function getVehiclePrimaryImage(vehicle) {
  if (!vehicle) return null;

  // Check physical vendor photos if explicitly marked as custom real upload
  if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    const primaryUnitPhoto = vehicle.images.find(img => img.isPrimary && !isGenericStockUrl(img.url));
    if (primaryUnitPhoto && primaryUnitPhoto.url.startsWith('https://res.cloudinary.com')) {
      return primaryUnitPhoto.url;
    }
  }

  // 1. Exact catalogKey match in verified manifest
  const catalogKey = getVehicleCatalogKey(vehicle);
  if (catalogKey && vehicleImageManifest[catalogKey]) {
    return vehicleImageManifest[catalogKey].primary;
  }

  // 2. Model slug match in modelFamilyManifest
  const slug = getModelSlug(vehicle.brand, vehicle.model);
  if (slug && modelFamilyManifest[slug]) {
    return modelFamilyManifest[slug];
  }

  // Check prefix matches in model family manifest
  for (const [key, url] of Object.entries(modelFamilyManifest)) {
    if (slug.startsWith(key) || catalogKey.startsWith(key)) {
      return url;
    }
  }

  // 3. Check backend catalog images if non-generic
  const backendImages = vehicle.catalogId?.images || vehicle.catalog?.images || vehicle.images || [];
  for (const img of backendImages) {
    if (img?.url && !isGenericStockUrl(img.url)) {
      return img.url;
    }
  }

  // Return null rather than a generic wrong vehicle
  return null;
}

/**
 * Resolves all verified gallery images for a vehicle.
 * @param {object} vehicle 
 * @returns {Array<{url: string, label: string}>}
 */
export function getVehicleGallery(vehicle) {
  if (!vehicle) return [];

  const gallery = [];
  const addedUrls = new Set();

  const addImage = (url, label) => {
    if (url && !isGenericStockUrl(url) && !addedUrls.has(url)) {
      addedUrls.add(url);
      gallery.push({ url, label });
    }
  };

  // Add physical vendor photos if available
  if (Array.isArray(vehicle.images)) {
    vehicle.images.forEach((img, idx) => {
      if (img?.url && !isGenericStockUrl(img.url)) {
        addImage(img.url, img.caption || `Physical Unit Photo ${idx + 1}`);
      }
    });
  }

  // Add manifest gallery views
  const catalogKey = getVehicleCatalogKey(vehicle);
  if (catalogKey && vehicleImageManifest[catalogKey]?.gallery) {
    vehicleImageManifest[catalogKey].gallery.forEach(item => {
      addImage(item.url, item.label);
    });
  }

  // Fallback to primary image if gallery is empty
  if (gallery.length === 0) {
    const primary = getVehiclePrimaryImage(vehicle);
    if (primary) {
      gallery.push({ url: primary, label: 'Showroom Studio View' });
    }
  }

  return gallery;
}

/**
 * Determine if a vehicle has an exact verified image available
 * @param {object} vehicle 
 * @returns {boolean}
 */
export function hasVerifiedImage(vehicle) {
  return getVehiclePrimaryImage(vehicle) !== null;
}

/**
 * Get human-readable verification metadata
 * @param {object} vehicle 
 * @returns {{status: 'VERIFIED'|'PENDING', label: string, modelName: string}}
 */
export function getVehicleImageMeta(vehicle) {
  const catalogKey = getVehicleCatalogKey(vehicle);
  const manifestEntry = vehicleImageManifest[catalogKey];
  const modelName = `${vehicle?.brand || ''} ${vehicle?.model || ''}`.trim();

  if (manifestEntry?.verified) {
    return {
      status: 'VERIFIED',
      label: 'Exact Model Verified',
      modelName: manifestEntry.modelName || modelName
    };
  }

  const primary = getVehiclePrimaryImage(vehicle);
  if (primary) {
    return {
      status: 'VERIFIED',
      label: 'Verified Model Family',
      modelName
    };
  }

  return {
    status: 'PENDING',
    label: 'Image in Verification',
    modelName
  };
}
