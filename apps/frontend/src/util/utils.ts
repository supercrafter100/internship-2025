import { environment } from '../environments/environment';

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function parseCDNUrl(url: string) {
  if (url.startsWith('http')) {
    return url;
  }

  return `${environment.cdnUrl}${url}`;
}

export function getDashboardId(url: string): number | null {
  const parts = url.split('/');
  const dashboardIndex = parts.indexOf('dashboard');

  if (dashboardIndex !== -1 && parts[dashboardIndex + 1]) {
    return Number(parts[dashboardIndex + 1]) || null;
  }

  return null;
}

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
export const stringToColour = (str: string) => {
  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
};
