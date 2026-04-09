"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, setIsLoggedIn, setIsCheckoutOpen } = useCart();
  const [isLoginView, setIsLoginView] = useState(true);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ডেমো লগইন/সাইনআপ লজিক
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setIsCheckoutOpen(true); // লগইন হওয়ার সাথে সাথে চেকআউট মোডাল ওপেন হবে
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAuthOpen(false)}></div>

      <div className="relative w-full max-w-md bg-[#1a100c]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 p-8 md:p-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-[#c48c5a] text-xl font-bold tracking-[0.2em] uppercase">
            {isLoginView ? "Welcome Back" : "Create Account"}
          </h2>
          <button onClick={() => setIsAuthOpen(false)} className="text-white/60 hover:text-white text-3xl transition-colors">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginView && (
            <div>
              <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Full Name</label>
              <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="John Doe" />
            </div>
          )}
          <div>
            <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Email Address</label>
            <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="hello@blackstone.com" />
          </div>
          <div>
            <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Password</label>
            <input required type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-[#c48c5a] text-[#110804] px-8 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#e8c39e] transition-all mt-4">
            {isLoginView ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLoginView(!isLoginView)} className="text-[#c48c5a] text-xs hover:underline tracking-wider font-medium">
            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}