export type ProfileRole = "seeker" | "property_owner" | "mess_owner";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ProfileRecord {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole | null;
  budget: number | null;
  lifestyle_tags: string[] | null;
  major: string | null;
  graduation_year: number | null;
  bio: string | null;
}

export interface ListingRecord {
  id: string;
  lister_id: string;
  title: string;
  location: string;
  rent_price: number | null;
  deposit_amount?: number | null;
  type: string | null;
  description: string | null;
  distance_from_campus: string | null;
  amenities: string[] | null;
  house_rules: string[] | null;
  image_urls: string[] | null;
  is_active: boolean | null;
  coordinates: Coordinates | null;
  created_at?: string;
}

export interface MessServiceRecord {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  cuisine: string;
  price_per_month: number;
  delivery_time: string | null;
  today_menu: string[] | null;
  image_url: string | null;
  rating: number | null;
  coordinates: Coordinates | null;
  created_at?: string;
}

export interface ListingCardData {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  imageUrl: string;
  amenities: string[];
  distanceToCampus: string;
  coordinates?: Coordinates;
  isInactive?: boolean;
}

export interface MessCardData {
  id: string;
  name: string;
  rating: number;
  cuisine: string;
  pricePerMonth: number;
  todayMenu: string[];
  imageUrl: string;
  deliveryTime: string;
  coordinates?: Coordinates;
}

export interface MapItem {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  imageUrl?: string;
  coordinates: Coordinates;
}

export interface ListingInterest {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
}

export interface ListingInterestWithProfile extends ListingInterest {
  profiles: ProfileRecord | null;
}
