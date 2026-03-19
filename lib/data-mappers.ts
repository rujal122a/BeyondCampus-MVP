import type {
  ListingCardData,
  ListingRecord,
  MapItem,
  MessCardData,
  MessServiceRecord,
} from "@/lib/types";

export const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200";

export const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200";

export function mapListingToCard(listing: ListingRecord): ListingCardData {
  return {
    id: listing.id,
    title: listing.title,
    location: listing.location,
    price: listing.rent_price ?? 0,
    type: listing.type ?? "Stay",
    imageUrl: listing.image_urls?.[0] ?? FALLBACK_PROPERTY_IMAGE,
    amenities: listing.amenities ?? [],
    distanceToCampus: listing.distance_from_campus ?? "Distance unavailable",
    coordinates: listing.coordinates ?? undefined,
    isInactive: listing.is_active === false,
  };
}

export function mapServiceToCard(service: MessServiceRecord): MessCardData {
  return {
    id: service.id,
    name: service.name,
    rating: service.rating ?? 4.5,
    cuisine: service.cuisine,
    pricePerMonth: service.price_per_month,
    todayMenu: service.today_menu ?? [],
    imageUrl: service.image_url ?? FALLBACK_SERVICE_IMAGE,
    deliveryTime: service.delivery_time ?? "12:00 PM - 2:00 PM",
    coordinates: service.coordinates ?? undefined,
  };
}

export function mapListingsToMapItems(listings: ListingRecord[]): MapItem[] {
  return listings
    .filter(
      (
        listing
      ): listing is ListingRecord & {
        coordinates: NonNullable<ListingRecord["coordinates"]>;
      } => Boolean(listing.coordinates)
    )
    .map((listing) => ({
      id: listing.id,
      title: listing.title,
      subtitle: listing.location,
      priceLabel: `Rs ${listing.rent_price ?? 0}/mo`,
      imageUrl: listing.image_urls?.[0] ?? FALLBACK_PROPERTY_IMAGE,
      coordinates: listing.coordinates,
    }));
}

export function mapServicesToMapItems(services: MessServiceRecord[]): MapItem[] {
  return services
    .filter(
      (
        service
      ): service is MessServiceRecord & {
        coordinates: NonNullable<MessServiceRecord["coordinates"]>;
      } => Boolean(service.coordinates)
    )
    .map((service) => ({
      id: service.id,
      title: service.name,
      subtitle: service.cuisine,
      priceLabel: `Rs ${service.price_per_month}/mo`,
      imageUrl: service.image_url ?? FALLBACK_SERVICE_IMAGE,
      coordinates: service.coordinates,
    }));
}
