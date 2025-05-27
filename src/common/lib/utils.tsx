import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert a Base64 string to a Blob
export function base64ToBlob(base64String: string, contentType: string) {
  const byteCharacters = atob(base64String.split(',')[1] || base64String); // Decode Base64
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
}

// Function to convert the Base64 string to a File (optional)
export function base64ToFile(
  base64String: string,
  fileName: string,
  contentType: string
) {
  const blob = base64ToBlob(base64String, contentType);
  return new File([blob], fileName, { type: contentType });
}
