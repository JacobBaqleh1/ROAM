// import type { Park } from './Park.js';

export interface Park {
  parkId: string;
  fullName: string;
  state: string;
  description: string;
  images: string[]; // Changed from image: string to images: string[]
}