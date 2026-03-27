








export interface DemoResponse {
  message: string;
}




export interface CustomTripRequest {
  fullName: string;
  phone: string;
  email: string;
  destinations: string[];
  startDate: string | null;
  endDate: string | null;
  budget: string;
  adults: number;
  children: number;
  childAges: number[];
}

export interface CustomTripResponse {
  success: boolean;
  message: string;
}




export interface ReservationRequest {
  fullName: string;
  phone: string;
  offerTitle?: string;
  offerId?: string;
  selectedHotelId?: string;
  selectedHotel: string;
  adults: number;
  children: number;
  totalEstimated?: string;
  currency?: string;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  reservationId?: string;
}
