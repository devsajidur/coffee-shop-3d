"use client";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

export default function BookTableModal() {
  const { isBookTableOpen, setIsBookTableOpen } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [guests, setGuests] = useState("1 Person");

  useEffect(() => {
    if (isBookTableOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isBookTableOpen]);

  if (!isBookTableOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const bookingData = {
      customerName: formData.get("name"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      time: formData.get("time"),
      guests: guests,
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
        alert("Booking failed!");
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

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose}></div>
      <div className="relative w-full max-w-xl bg-[#1a100c] p-8 rounded-3xl border border-white/10">
        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-[#c48c5a] text-xl font-bold uppercase tracking-widest">Book A Table</h2>
            <input name="name" required placeholder="Name" className="w-full bg-white/5 p-3 rounded-xl text-white outline-none" />
            <input name="phone" required placeholder="Phone" className="w-full bg-white/5 p-3 rounded-xl text-white outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input name="date" required type="date" className="bg-white/5 p-3 rounded-xl text-white outline-none" style={{colorScheme:'dark'}} />
              <input name="time" required type="time" className="bg-white/5 p-3 rounded-xl text-white outline-none" style={{colorScheme:'dark'}} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#c48c5a] py-4 rounded-xl font-bold uppercase text-xs">
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        ) : (
          <div className="text-center p-10">
            <h2 className="text-2xl text-white font-black mb-4 uppercase">Reserved!</h2>
            <p className="text-[#c48c5a] mb-6">Booking ID: {bookingId}</p>
            <button onClick={handleClose} className="bg-white/10 px-8 py-3 rounded-full text-white uppercase text-[10px] font-bold">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}