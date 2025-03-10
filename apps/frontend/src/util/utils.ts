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
