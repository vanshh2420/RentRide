/**
 * Cloudinary & CDN Responsive Image Transformation Helper
 * Formats URLs with dynamic width, auto-format, auto-quality, and face/smart cropping.
 */

const FALLBACK_VEHICLE_IMAGE = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';

/**
 * Generate an optimized responsive image URL
 * @param {string} url - Source image URL (Cloudinary, Unsplash, or generic)
 * @param {'thumbnail'|'card'|'detail'|'raw'} sizeVariant - Target size preset
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(url, sizeVariant = 'card') {
  if (!url || typeof url !== 'string') {
    return FALLBACK_VEHICLE_IMAGE;
  }

  // Dimension presets
  const presets = {
    thumbnail: { width: 250, height: 180, quality: 75 },
    card: { width: 550, height: 360, quality: 80 },
    detail: { width: 1200, height: 800, quality: 85 },
    raw: null
  };

  const preset = presets[sizeVariant] || presets.card;
  if (!preset) return url;

  // 1. Cloudinary Transform Injection
  if (url.includes('res.cloudinary.com')) {
    // Check if already transformed
    const uploadIdx = url.indexOf('/upload/');
    if (uploadIdx !== -1) {
      const transform = `c_fill,g_auto,w_${preset.width},h_${preset.height},q_auto,f_auto`;
      return `${url.slice(0, uploadIdx + 8)}${transform}/${url.slice(uploadIdx + 8)}`;
    }
    return url;
  }

  // 2. Unsplash Transform Injection
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', preset.width.toString());
      parsed.searchParams.set('h', preset.height.toString());
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('q', preset.quality.toString());
      return parsed.toString();
    } catch {
      return url;
    }
  }

  // Return standard URL for other origins
  return url;
}
