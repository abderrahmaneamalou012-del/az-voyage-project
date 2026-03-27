

export type ID = string;

export interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Price {
  amount: number;
  currency: string; 
  per?: 'person' | 'package' | string;
  original?: number; 
  discountPercent?: number;
}

export interface ProgramDay {
  day: number;
  title?: string;
  description?: string;
  locations?: string[];
  meals?: string[]; 
  images?: Image[];
  isLast?: boolean;
}

export interface Hotel {
  id: ID;
  name: string;
  description?: string;
  stars?: number; 
  rating?: number; 
  address?: string;
  city?: string;
  country?: string;
  mainImage?: Image;
  images?: Image[];
  amenities?: string[];
  price?: Price;
  pricePerPerson?: string;
  currency?: string;
  dates?: string;
  distanceFromCenterKm?: number;
  transferIncluded?: boolean;
  breakfastIncluded?: boolean;
}

export interface Offer {
  id: ID;
  slug?: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  mainImage?: Image;
  images?: Image[]; 
  price: Price;
  durationDays?: number;
  durationNights?: number;
  numberOfDays?: number;
  location?: {
    country?: string;
    city?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  time?: string;
  categories?: string[];
  inclusions?: string[];
  exclusions?: string[];
  program?: ProgramDay[];
  hotels?: Hotel[];
  availability?: { from: string; to?: string }[]; 
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface OfferDetail extends Offer {
  itinerary?: ProgramDay[]; 
  policies?: {
    cancellation?: string;
    payment?: string;
    notes?: string;
  };
  terms?: string;
}

export interface ReservationRequest {
  offerId: ID;
  hotelId?: ID;
  startDate: string; 
  endDate?: string; 
  adults: number;
  children?: number;
  rooms?: number;
  extras?: string[];
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
