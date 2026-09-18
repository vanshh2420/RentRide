/**
 * Cloudinary & CDN Responsive Image Transformation Helper
 * Formats URLs with dynamic width, auto-format, auto-quality, and face/smart cropping.
 */

export function getOptimizedImageUrl(url, sizeVariant = 'card') {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // If local vehicle asset, return as-is
  if (url.startsWith('/vehicles/') || url.startsWith('/')) {
    return url;
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
