export interface Park {
  parkId: string;
  fullName: string;
  states: string;
  description: string;
  images: { url: string; altText?: string; caption?: string; credit?: string; title?: string }[];
}
