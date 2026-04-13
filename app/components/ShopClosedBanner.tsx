"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
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

export default function ShopClosedBanner() {
  const { isShopOpen, shopCountdownMs, shopNextBoundaryLabel } = useCart();

  return (
    <AnimatePresence>
      {!isShopOpen && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed left-0 right-0 top-[76px] z-[120] border-b border-amber-500/30 bg-gradient-to-r from-[#1a0f0a] via-[#2a1510] to-[#1a0f0a] px-4 py-2.5 text-center shadow-lg font-['Hind_Siliguri']"
        >
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 text-xs text-amber-100/90 md:text-sm">
            <Clock className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="font-semibold tracking-wide">
              দোকান বন্ধ — পরবর্তী সময়:{" "}
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums text-white">
                {shopNextBoundaryLabel}
              </span>
            </span>
            <span className="text-amber-200/80">
              (
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums font-bold text-amber-300">
                {formatCountdown(shopCountdownMs)}
              </span>{" "}
              অবধি)
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
