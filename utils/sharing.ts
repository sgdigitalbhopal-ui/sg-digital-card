import { CardData } from '../types';
import LZString from 'lz-string';

export const encodeCardData = (data: CardData): string => {
  try {
    const jsonString = JSON.stringify(data);
    // Compress the JSON string to reduce URL length significantly
    return LZString.compressToEncodedURIComponent(jsonString);
  } catch (error) {
    console.error('Failed to encode card data:', error);
    return '';
  }
};

export const decodeCardData = (encodedString: string): CardData | null => {
  try {
    // Attempt to decompress
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedString);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
    
    // Fallback for older links (Base64)
    const jsonString = decodeURIComponent(escape(atob(encodedString)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode card data:', error);
    return null;
  }
};

export const generateShareUrl = (data: CardData): string => {
  const encoded = encodeCardData(data);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?card=${encoded}`;
};