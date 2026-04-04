/**
 * Преобразует прямой URL Vercel Blob в прокси URL
 * Это нужно для обхода блокировок Vercel Blob в некоторых регионах
 */
export function getProxyFileUrl(originalUrl: string): string {
  // Проверяем что это URL от Vercel Blob
  if (originalUrl.includes('blob.vercel-storage.com')) {
    return `/api/files/proxy?url=${encodeURIComponent(originalUrl)}`
  }
  // Для других URL возвращаем как есть
  return originalUrl
}

/**
 * Получить оригинальный URL (для Office Viewer который требует публичный URL)
 * Office Viewer не может работать через прокси, поэтому используем оригинальный URL
 */
export function getOriginalFileUrl(url: string): string {
  // Если это уже прокси URL, извлекаем оригинальный
  if (url.startsWith('/api/files/proxy?url=')) {
    const params = new URLSearchParams(url.split('?')[1])
    return params.get('url') || url
  }
  return url
}
