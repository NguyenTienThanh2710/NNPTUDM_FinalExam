export const getImageURL = (img) => {
  if (!img || typeof img !== 'string') return null;

  // 1. Handle absolute URLs (links)
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('//') || img.startsWith('data:') || img.startsWith('blob:')) {
    return img;
  }

  // 2. Clear out double slashes and finalize the server URL
  let baseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // 3. Clean product image/logo path from DB
  let cleanPath = img.trim();
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // Check if it already contains the folder path
  if (cleanPath.startsWith('/uploads/')) {
    return `${baseUrl}${cleanPath}`;
  }

  // Final fallback (typically for local filenames only)
  return `${baseUrl}/uploads${cleanPath}`;
};
