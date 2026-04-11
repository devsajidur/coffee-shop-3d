"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { isShopOpenAt } from "@/lib/shopHours";

export default function BookTableModal() {
  const { isBookTableOpen, setIsBookTableOpen, shopCountdownMs, shopNextBoundaryLabel } =
    useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (isBookTableOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isBookTableOpen]);

  if (!isBookTableOpen) return null;

  const open = isShopOpenAt();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isShopOpenAt()) {
      alert("দোকান বন্ধ — বুকিং নেই।");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const bookingData = {
      customerName: formData.get("name"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      time: formData.get("time"),
      guests: "Table booking",
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.booking.bookingId);
        setStep("success");
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.error || "Booking failed!");
      }
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsBookTableOpen(false);
    setTimeout(() => setStep("form"), 300);
  };

  function fmt(ms: number) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  }

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      ></div>
      <div className="relative w-full max-w-xl bg-[#1a100c] p-8 rounded-3xl border border-white/10 font-['Hind_Siliguri']">
        {!open && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-100">
            <p className="font-bold">দোকান বন্ধ — বুকিং বন্ধ</p>
            <p className="mt-2 text-xs text-amber-100/80">
              পরবর্তী:{" "}
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums">
                {shopNextBoundaryLabel}
              </span>
            </p>
            <p className="mt-1 font-[family-name:var(--font-geist-sans)] text-lg font-black tabular-nums text-amber-300">
              {fmt(shopCountdownMs)}
            </p>
          </div>
        )}
        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-[#c48c5a] text-xl font-bold uppercase tracking-widest">
              Book A Table
            </h2>
            <input
              name="name"
              required
              placeholder="Name"
              disabled={!open}
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none disabled:opacity-40"
            />
            <input
              name="phone"
              required
              placeholder="Phone"
              disabled={!open}
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none disabled:opacity-40 font-[family-name:var(--font-geist-sans)]"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="date"
                required
                type="date"
                disabled={!open}
                className="bg-white/5 p-3 rounded-xl text-white outline-none disabled:opacity-40"
                style={{ colorScheme: "dark" }}
              />
              <input
                name="time"
                required
                type="time"
                disabled={!open}
                className="bg-white/5 p-3 rounded-xl text-white outline-none disabled:opacity-40"
                style={{ colorScheme: "dark" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !open}
              className="w-full bg-[#c48c5a] py-4 rounded-xl font-bold uppercase text-xs text-[#110804] disabled:opacity-50"
            >
              {loading ? "Processing..." : open ? "Confirm Booking" : "Shop Closed"}
            </button>
          </form>
        ) : (
          <div className="text-center p-10">
            <h2 className="text-2xl text-white font-black mb-4 uppercase">Reserved!</h2>
            <p className="text-[#c48c5a] mb-6 font-[family-name:var(--font-geist-sans)]">
              Booking ID: {bookingId}
            </p>
            <button
              onClick={handleClose}
              className="bg-white/10 px-8 py-3 rounded-full text-white uppercase text-[10px] font-bold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
