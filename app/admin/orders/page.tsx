"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Users } from "lucide-react";
import { adminJson } from "../adminFetch";

type KitchenStatus = "Pending" | "Preparing" | "Ready" | "Served";

type OrderRow = {
  _id: string;
  orderId: string;
  tableNumber: string;
  adults?: number;
  children?: number;
  peopleCount?: number;
  kitchenStatus: KitchenStatus;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  createdAt: string;
};

const STATUSES: KitchenStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Served",
];

function OrderCard({
  o,
  onStatus,
}: {
  o: OrderRow;
  onStatus: (orderId: string, s: KitchenStatus) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="rounded-2xl border border-white/10 bg-[#100a08] p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c48c5a]">
            {o.orderId}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-white">
            <span className="flex items-center gap-2 text-lg font-black font-[family-name:var(--font-geist-sans)] tabular-nums">
              {o.tableNumber ? `Table ${o.tableNumber}` : "Delivery"}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/50">
              <Users className="h-3.5 w-3.5" />
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums">
                {(o.adults ?? 1) + (o.children ?? 0)} guests
              </span>
              <span className="text-white/35">
                ({o.adults ?? 1}A + {o.children ?? 0}C)
              </span>
            </span>
          </div>
        </div>
        <ChefHat className="h-8 w-8 text-[#c48c5a]/40" />
      </div>

      <ul className="mt-4 space-y-2 border-t border-white/5 pt-4 text-sm text-white/80">
        {o.items?.map((it, i) => (
          <li
            key={i}
            className="flex justify-between gap-4 font-[family-name:var(--font-geist-sans)] tabular-nums"
          >
            <span>
              {it.name}{" "}
              <span className="text-white/40">×{it.quantity}</span>
            </span>
            <span className="text-[#c48c5a]">
              ${(it.price * it.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-right text-xs text-white/40">
        Total{" "}
        <span className="font-[family-name:var(--font-geist-sans)] text-base font-black text-white">
          ${Number(o.totalAmount).toFixed(2)}
        </span>
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(o.orderId, s)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
              o.kitchenStatus === s
                ? "bg-[#c48c5a] text-black ring-2 ring-[#c48c5a]/40"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </motion.article>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await adminJson<OrderRow[]>("/api/admin/orders");
      setOrders(data);
      setErr("");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, [load]);

  const liveQueue = useMemo(
    () =>
      orders.filter(
        (o) => o.kitchenStatus === "Pending" || o.kitchenStatus === "Preparing"
      ),
    [orders]
  );

  const patchStatus = async (orderId: string, kitchenStatus: KitchenStatus) => {
    try {
      await adminJson("/api/admin/orders", {
        method: "PATCH",
        body: JSON.stringify({ orderId, kitchenStatus }),
      });
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div className="space-y-8 font-['Hind_Siliguri']">
      <div>
        <h1 className="text-3xl font-black text-white">Live Kitchen</h1>
        <p className="mt-1 text-sm text-white/45">
          Pending &amp; Preparing tickets refresh every 4 seconds.
        </p>
      </div>

      {err && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </p>
      )}

      {loading && (
        <p className="text-sm text-white/40 animate-pulse">লোড হচ্ছে…</p>
      )}

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c48c5a]">
          Active queue (Pending / Preparing)
        </h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {liveQueue.map((o) => (
              <OrderCard key={`live-${o.orderId}`} o={o} onStatus={patchStatus} />
            ))}
          </AnimatePresence>
        </div>
        {!loading && liveQueue.length === 0 && (
          <p className="text-sm text-white/35">No active kitchen tickets.</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/50">
          All orders
        </h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {orders.map((o) => (
              <OrderCard key={o.orderId} o={o} onStatus={patchStatus} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {!loading && orders.length === 0 && (
        <p className="text-sm text-white/35">কোনো অর্ডার নেই।</p>
      )}
    </div>
  );
}
