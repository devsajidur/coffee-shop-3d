"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DEFAULT_DELIVERY_RADIUS_KM,
  GEO_MESSAGES,
  SHOP_LATITUDE,
  SHOP_LONGITUDE,
  canDeliveryService,
  canDineInCheckout,
  resolveGeoServiceMode,
  type GeoServiceMode,
} from "@/lib/blackstoneGeo";
import { haversineDistanceMeters } from "@/lib/haversineMeters";
import { useCart } from "./CartContext";

export type GeoLockStatus =
  | "idle"
  | "locating"
  | "denied"
  | "unavailable"
  | "error"
  | "unlocked"
  | "locked";

type GeoLockContextValue = {
  status: GeoLockStatus;
  distanceMeters: number | null;
  /** Legacy: true when current mode’s distance rule passes (checkout for dine-in, delivery radius for delivery). */
  canOrder: boolean;
  /** Mode A: always true (ordering blocked at checkout). Mode B: within delivery radius. */
  canAddToCart: boolean;
  /** Table QR flow: within 50m. Delivery: within deliveryRadiusKm. */
  canCheckoutGeo: boolean;
  serviceMode: GeoServiceMode;
  deliveryRadiusKm: number;
  geoBlockMessage: string;
  isVerifying: boolean;
  trackingEngaged: boolean;
  ensureTracking: () => void;
  retryTracking: () => void;
};

const GeoLockContext = createContext<GeoLockContextValue | undefined>(
  undefined
);

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 25_000,
};

export function GeoLockProvider({ children }: { children: ReactNode }) {
  const { tableId, deliveryRadiusKm } = useCart();
  const [status, setStatus] = useState<GeoLockStatus>("idle");
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [trackingEngaged, setTrackingEngaged] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const prevUnlockedRef = useRef(false);
  const welcomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const serviceMode: GeoServiceMode = resolveGeoServiceMode(Boolean(tableId));
  const radiusKm =
    Number.isFinite(deliveryRadiusKm) && deliveryRadiusKm > 0
      ? deliveryRadiusKm
      : DEFAULT_DELIVERY_RADIUS_KM;

  const clearWatch = useCallback(() => {
    if (
      watchIdRef.current !== null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
  }, []);

  const applyPosition = useCallback(
    (position: GeolocationPosition) => {
      const meters = haversineDistanceMeters(
        position.coords.latitude,
        position.coords.longitude,
        SHOP_LATITUDE,
        SHOP_LONGITUDE
      );
      setDistanceMeters(meters);

      const dineIn = canDineInCheckout(meters);
      const deliveryOk = canDeliveryService(meters, radiusKm);
      const unlockedForMode =
        serviceMode === "dine_in_qr" ? dineIn : deliveryOk;
      setStatus(unlockedForMode ? "unlocked" : "locked");

      if (
        serviceMode === "dine_in_qr" &&
        dineIn &&
        !prevUnlockedRef.current
      ) {
        if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
        setWelcomeOpen(true);
        welcomeTimerRef.current = setTimeout(() => {
          setWelcomeOpen(false);
          welcomeTimerRef.current = null;
        }, 4_200);
      }
      prevUnlockedRef.current = unlockedForMode;
    },
    [radiusKm, serviceMode]
  );

  const startWatch = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    clearWatch();
    setStatus("locating");
    setDistanceMeters(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        applyPosition(position);
      },
      (error) => {
        setDistanceMeters(null);
        if (error.code === 1) {
          setStatus("denied");
        } else {
          setStatus("error");
        }
      },
      WATCH_OPTIONS
    );
  }, [applyPosition, clearWatch]);

  const ensureTracking = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setTrackingEngaged(true);
      setStatus("unavailable");
      return;
    }
    if (watchIdRef.current !== null) return;
    setTrackingEngaged(true);
    startWatch();
  }, [startWatch]);

  const retryTracking = useCallback(() => {
    clearWatch();
    prevUnlockedRef.current = false;
    setStatus("idle");
    setDistanceMeters(null);
    startWatch();
  }, [clearWatch, startWatch]);

  useEffect(() => {
    prevUnlockedRef.current = false;
  }, [serviceMode, tableId]);

  useEffect(() => {
    ensureTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearWatch();
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    };
  }, [clearWatch]);

  const isVerifying = status === "locating";
  const canCheckoutGeo =
    serviceMode === "dine_in_qr"
      ? canDineInCheckout(distanceMeters)
      : canDeliveryService(distanceMeters, radiusKm);

  const canAddToCart =
    serviceMode === "dine_in_qr"
      ? true
      : canDeliveryService(distanceMeters, radiusKm);

  const canOrder = canCheckoutGeo;

  const geoBlockMessage =
    serviceMode === "dine_in_qr"
      ? GEO_MESSAGES.dineInCheckoutBlocked
      : GEO_MESSAGES.deliveryServiceBlocked(radiusKm);

  const value: GeoLockContextValue = {
    status,
    distanceMeters,
    canOrder,
    canAddToCart,
    canCheckoutGeo,
    serviceMode,
    deliveryRadiusKm: radiusKm,
    geoBlockMessage,
    isVerifying,
    trackingEngaged,
    ensureTracking,
    retryTracking,
  };

  return (
    <GeoLockContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {welcomeOpen && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed bottom-8 left-1/2 z-[900] w-[min(92vw,380px)] -translate-x-1/2 pointer-events-none"
          >
            <div className="rounded-2xl border border-[#c48c5a]/40 bg-[#1a100c]/95 px-5 py-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c48c5a]">
                Blackstone Coffee
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Welcome to Blackstone Coffee
              </p>
              <p className="mt-1 text-xs text-white/55">
                You are at the table — ordering is unlocked.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GeoLockContext.Provider>
  );
}

export function useGeoLock() {
  const ctx = useContext(GeoLockContext);
  if (!ctx) {
    throw new Error("useGeoLock must be used within a GeoLockProvider");
  }
  return ctx;
}
