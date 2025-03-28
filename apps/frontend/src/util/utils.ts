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
