"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";

function formatCountdown(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function ShopClosedModal() {
  const {
    shopClosedModalOpen,
    setShopClosedModalOpen,
    shopCountdownMs,
    shopNextBoundaryLabel,
  } = useCart();

  return (
    <AnimatePresence>
      {shopClosedModalOpen && (
        <div className="fixed inset-0 z-[860] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShopClosedModalOpen(false)}
          />
          <motion.div
            role="dialog"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md rounded-[2rem] border border-amber-500/30 bg-[#1a100c] p-8 font-['Hind_Siliguri']"
          >
            <button
              type="button"
              className="absolute right-5 top-5 text-white/40 hover:text-white"
              onClick={() => setShopClosedModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-center text-xl font-black text-white">
              দোকান বন্ধ আছে
            </h3>
            <p className="mt-3 text-center text-sm text-white/55">
              অর্ডার ও টেবিল বুকিং শুধুমাত্র খোলার সময়ে পাওয়া যাবে।
            </p>
            <p className="mt-4 text-center text-xs text-white/45">
              পরবর্তী পরিবর্তন:{" "}
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums text-white/80">
                {shopNextBoundaryLabel}
              </span>
            </p>
            <p className="mt-2 text-center font-[family-name:var(--font-geist-sans)] text-2xl font-black tabular-nums text-amber-300">
              {formatCountdown(shopCountdownMs)}
            </p>
            <button
              type="button"
              onClick={() => setShopClosedModalOpen(false)}
              className="mt-6 w-full rounded-xl border border-white/10 py-3 text-xs font-bold uppercase tracking-widest text-white/80 hover:bg-white/5"
            >
              বন্ধ করুন
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
