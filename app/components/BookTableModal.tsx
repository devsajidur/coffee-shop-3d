"use client";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { getTimeSlotsForDate } from "@/lib/shopHours";

const TZ = "Asia/Dhaka";

/** Today's date string in Asia/Dhaka (YYYY-MM-DD) */
function getTodayDhaka(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Format an ISO string to a human-readable Dhaka date/time */
function formatDhakaDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      timeZone: TZ,
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function BookTableModal() {
  const {
    isBookTableOpen,
    setIsBookTableOpen,
    shopCountdownMs,
    shopNextBoundaryLabel,
    isSystemClosed,
    closureReason,
    closedUntil,
  } = useCart();

  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [contactErr, setContactErr] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Minimum selectable date is today in Dhaka
  const todayDhaka = getTodayDhaka();

  // Derive available time slots whenever the selected date changes
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlotsForDate(selectedDate);
  }, [selectedDate]);

  // Reset time selection when date changes (old slot may not be valid for new day)
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  useEffect(() => {
    if (isBookTableOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isBookTableOpen]);

  if (!isBookTableOpen) return null;

  // ── Emergency / scheduled closure banner ──────────────────────────────────
  if (isSystemClosed) {
    const untilLabel = closedUntil ? formatDhakaDateTime(closedUntil) : "further notice";
    return (
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsBookTableOpen(false)}
        />
        <div className="relative w-full max-w-xl bg-[#1a100c] p-8 rounded-3xl border border-red-500/30 font-['Hind_Siliguri'] text-center">
          <div className="mb-2 text-4xl">🚫</div>
          <h2 className="text-xl font-black uppercase tracking-widest text-red-400 mb-3">
            Temporarily Closed
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-2">
            We are temporarily closed until{" "}
            <span className="font-bold text-amber-300">{untilLabel}</span>.
          </p>
          {closureReason && (
            <p className="text-white/60 text-xs mt-1">
              Reason: <span className="text-white/80">{closureReason}</span>
            </p>
          )}
          <button
            onClick={() => setIsBookTableOpen(false)}
            className="mt-6 bg-white/10 px-8 py-3 rounded-full text-white uppercase text-[10px] font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactErr("");

    const formData = new FormData(e.currentTarget);
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    if (phone.length < 6 && email.length < 5) {
      setContactErr("Please enter a valid phone number or email.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setContactErr("Please select a date and time slot.");
      return;
    }

    setLoading(true);

    const bookingData = {
      customerName: formData.get("name"),
      phone,
      email,
      date: selectedDate,
      time: selectedTime,
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
    setTimeout(() => {
      setStep("form");
      setContactErr("");
      setSelectedDate("");
      setSelectedTime("");
    }, 300);
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
      />
      <div className="relative w-full max-w-xl bg-[#1a100c] p-8 rounded-3xl border border-white/10 font-['Hind_Siliguri']">
        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-[#c48c5a] text-xl font-bold uppercase tracking-widest">
              Book A Table
            </h2>
            <p className="text-[10px] text-white/40">
              Phone or email is required so we can confirm your reservation.
              You can book from anywhere — no location required.
            </p>

            <input
              name="name"
              required
              placeholder="Name"
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none"
            />
            <input
              name="phone"
              placeholder="Phone (optional if email provided)"
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none font-[family-name:var(--font-geist-sans)]"
            />
            <input
              name="email"
              type="email"
              placeholder="Email (optional if phone provided)"
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none font-[family-name:var(--font-geist-sans)]"
            />
            {contactErr && (
              <p className="text-xs text-red-300 font-[family-name:var(--font-geist-sans)]">
                {contactErr}
              </p>
            )}

            {/* Date picker — min is today in Dhaka */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40">
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={todayDhaka}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white/5 p-3 rounded-xl text-white outline-none"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              {/* Time slot dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40">
                  Time Slot
                </label>
                {!selectedDate ? (
                  <div className="bg-white/5 p-3 rounded-xl text-white/30 text-sm">
                    Select a date first
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="bg-white/5 p-3 rounded-xl text-red-300 text-sm">
                    No slots available
                  </div>
                ) : (
                  <select
                    required
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-white/5 p-3 rounded-xl text-white outline-none font-[family-name:var(--font-geist-sans)]"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" disabled>
                      Choose a slot
                    </option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Shop-hours info banner */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[10px] text-white/50 leading-relaxed">
              <span className="font-bold text-white/70">Operating hours:</span>{" "}
              Sat–Thu 08:00–23:00 · Fri 15:00–23:00 (Asia/Dhaka)
              <br />
              Next change:{" "}
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums text-amber-300/80">
                {shopNextBoundaryLabel}
              </span>{" "}
              <span className="font-[family-name:var(--font-geist-sans)] tabular-nums">
                ({fmt(shopCountdownMs)})
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime}
              className="w-full bg-[#c48c5a] py-4 rounded-xl font-bold uppercase text-xs text-[#110804] disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Booking"}
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
