/**
 * Blackstone Coffee — WGS84 shop anchor (Dhaka).
 * @see https://en.wikipedia.org/wiki/Haversine_formula (used in lib/haversineMeters.ts)
 */
export const SHOP_LATITUDE = 23.723832;
export const SHOP_LONGITUDE = 90.361773;

/** Mode A — QR / table link: guest must be within this radius of the cafe (meters). */
export const DINE_IN_QR_RADIUS_METERS = 50;

/** @deprecated Use DINE_IN_QR_RADIUS_METERS */
export const ORDER_UNLOCK_RADIUS_METERS = DINE_IN_QR_RADIUS_METERS;

/** Fallback when settings are not yet loaded (km). */
export const DEFAULT_DELIVERY_RADIUS_KM = 3;

export type GeoServiceMode = "dine_in_qr" | "delivery";

export function resolveGeoServiceMode(hasTableQuery: boolean): GeoServiceMode {
  return hasTableQuery ? "dine_in_qr" : "delivery";
}

export function deliveryRadiusMeters(radiusKm: number): number {
  const km = Number.isFinite(radiusKm) && radiusKm > 0 ? radiusKm : DEFAULT_DELIVERY_RADIUS_KM;
  return km * 1000;
}

export function isWithinMeters(
  distanceMeters: number | null | undefined,
  maxMeters: number
): boolean {
  if (distanceMeters == null || !Number.isFinite(distanceMeters)) return false;
  return distanceMeters <= maxMeters;
}

/** Checkout allowed near the shop when ordering from a table QR link. */
export function canDineInCheckout(distanceMeters: number | null): boolean {
  return isWithinMeters(distanceMeters, DINE_IN_QR_RADIUS_METERS);
}

/** Add-to-cart / delivery checkout: within configured delivery radius. */
export function canDeliveryService(distanceMeters: number | null, radiusKm: number): boolean {
  return isWithinMeters(distanceMeters, deliveryRadiusMeters(radiusKm));
}

export const GEO_MESSAGES = {
  dineInCheckoutBlocked:
    "Please visit our cafe to order from this table.",
  deliveryServiceBlocked: (km: number) =>
    `To maintain coffee quality, we only deliver within a ${km}km radius.`,
} as const;
