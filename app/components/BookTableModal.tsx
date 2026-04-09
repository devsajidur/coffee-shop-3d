"use client";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

export default function BookTableModal() {
  const { isBookTableOpen, setIsBookTableOpen } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  
  // Custom Dropdown এর জন্য State
  const [guests, setGuests] = useState("1 Person");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const guestOptions = ["1 Person", "2 People", "3 People", "4 People", "5+ People"];

  useEffect(() => {
    if (isBookTableOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isBookTableOpen]);

  // ড্রপডাউনের বাইরে ক্লিক করলে যাতে বন্ধ হয়ে যায়
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isBookTableOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  const handleClose = () => {
    setIsBookTableOpen(false);
    setTimeout(() => {
      setStep("form");
      setIsDropdownOpen(false);
      setGuests("1 Person");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={step === "form" ? handleClose : undefined}></div>

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a100c]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300 scrollbar-thin scrollbar-thumb-[#c48c5a]/50">
        
        {step === "form" ? (
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 sticky top-0 bg-[#1a100c]/90 backdrop-blur-md z-10">
              <h2 className="text-[#c48c5a] text-xl font-bold tracking-[0.2em] uppercase">Book A Table</h2>
              <button onClick={handleClose} className="text-white/60 hover:text-white text-3xl transition-colors">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Phone</label>
                  <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="+880..." />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Date</label>
                  <input required type="date" style={{ colorScheme: 'dark' }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Time</label>
                  <input required type="time" style={{ colorScheme: 'dark' }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" />
                </div>
                
                {/* --- Custom Dropdown --- */}
                <div className="md:col-span-2 relative" ref={dropdownRef}>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Number of Guests</label>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full bg-white/5 border ${isDropdownOpen ? 'border-[#c48c5a]' : 'border-white/10'} rounded-xl px-4 py-3 text-white cursor-pointer flex justify-between items-center transition-colors hover:border-[#c48c5a]`}
                  >
                    <span>{guests}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Options List */}
                  {isDropdownOpen && (
                    <div className="absolute w-full mt-2 bg-[#1a100c] border border-[#c48c5a]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      {guestOptions.map((option) => (
                        <div 
                          key={option}
                          onClick={() => {
                            setGuests(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors text-sm ${guests === option ? 'bg-[#c48c5a]/20 text-[#c48c5a] font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* ---------------------- */}

              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <button type="submit" className="w-full bg-[#c48c5a] text-[#110804] px-8 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#e8c39e] transition-all">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Table Booked!</h2>
            <p className="text-white/50 font-['Hind_Siliguri'] mb-8">আপনার টেবিল বুকিং কনফার্ম হয়েছে। নির্দিষ্ট সময়ে উপস্থিত থাকার অনুরোধ রইলো।</p>
            <button onClick={handleClose} className="border border-[#c48c5a] text-[#c48c5a] px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#c48c5a] hover:text-[#110804] transition-all">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}