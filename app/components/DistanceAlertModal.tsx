"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useGeoLock } from "../context/GeoLockContext";
import { DINE_IN_QR_RADIUS_METERS } from "@/lib/blackstoneGeo";

export default function DistanceAlertModal() {
  const { distanceAlertOpen, setDistanceAlertOpen } = useCart();
  const { geoBlockMessage, serviceMode, deliveryRadiusKm } = useGeoLock();

  const title =
    serviceMode === "delivery"
      ? "Outside delivery zone"
      : "Not at the table zone";

  return (
    <AnimatePresence>
      {distanceAlertOpen && (
        <div className="fixed inset-0 z-[850] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setDistanceAlertOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative w-full max-w-md rounded-[2rem] border border-[#c48c5a]/35 bg-[#1a100c] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.75)] font-['Hind_Siliguri']"
          >
            <button
              type="button"
              className="absolute right-5 top-5 text-white/40 hover:text-white transition-colors"
              onClick={() => setDistanceAlertOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c48c5a]/40 bg-[#c48c5a]/10">
              <MapPin className="h-7 w-7 text-[#c48c5a]" />
            </div>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-[#c48c5a]">
              Location
            </p>
            <h3 className="mt-3 text-center text-2xl font-black text-white">{title}</h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-white/60">
              {serviceMode === "delivery" ? (
                geoBlockMessage
              ) : (
                <>
                  For table QR ordering, checkout is only available within{" "}
                  <span className="font-[family-name:var(--font-geist-sans)] tabular-nums text-white/90">
                    {DINE_IN_QR_RADIUS_METERS}m
                  </span>{" "}
                  of the cafe. {geoBlockMessage}
                </>
              )}
            </p>
            {serviceMode === "delivery" && (
              <p className="mt-2 text-center text-[10px] text-white/35 font-[family-name:var(--font-geist-sans)]">
                Current delivery radius setting: {deliveryRadiusKm} km
              </p>
            )}
            <button
              type="button"
              onClick={() => setDistanceAlertOpen(false)}
              className="mt-8 w-full rounded-xl bg-[#c48c5a] py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#110804] hover:bg-[#e8c39e] transition-colors"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
