export function sanitizeString(input: string): string {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizeNumber(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : Math.max(0, num);
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url.trim());

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return '';
    }

    return parsedUrl.href;
  } catch {
    return '';
  }
}

export function sanitizeTextarea(input: string, maxLength?: number): string {
  if (!input) return '';

  let sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
