"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, finalTotal, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // পপ-আপ ওপেন থাকলে পেছনের ওয়েবসাইটের স্ক্রল বন্ধ করার লজিক
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    clearCart();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => setStep("form"), 300);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={step === "form" ? handleClose : undefined}
      ></div>

      {/* এখানেই max-h-[90vh], overflow-y-auto এবং কাস্টম স্ক্রলবার অ্যাড করা হয়েছে */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a100c]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300 scrollbar-thin scrollbar-thumb-[#c48c5a]/50">
        
        {step === "form" ? (
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 sticky top-0 bg-[#1a100c]/90 backdrop-blur-md z-10">
              <h2 className="text-[#c48c5a] text-xl font-bold tracking-[0.2em] uppercase">Secure Checkout</h2>
              <button onClick={handleClose} className="text-white/60 hover:text-white text-3xl transition-colors">&times;</button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Full Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Phone Number</label>
                  <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="+880 1..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Delivery Address</label>
                  <textarea required rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors" placeholder="House, Street, City..."></textarea>
                </div>
                <div className="md:col-span-2 mt-2">
                  <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-2">Order Notes (Optional)</label>
                  <textarea rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c48c5a] transition-colors font-['Hind_Siliguri']" placeholder="চিনি কম দেবেন, বা এক্সট্রা বরফ দেবেন..."></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="block text-[10px] text-white/50 uppercase tracking-widest mb-4">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${paymentMethod === "cod" ? "border-[#c48c5a] bg-[#c48c5a]/10" : "border-white/10 hover:border-white/30"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-[#c48c5a]" : "border-white/50"}`}>
                      {paymentMethod === "cod" && <div className="w-2 h-2 bg-[#c48c5a] rounded-full"></div>}
                    </div>
                    <span className="text-white text-sm font-medium">Cash on Delivery</span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod("card")}
                    className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${paymentMethod === "card" ? "border-[#c48c5a] bg-[#c48c5a]/10" : "border-white/10 hover:border-white/30"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-[#c48c5a]" : "border-white/50"}`}>
                      {paymentMethod === "card" && <div className="w-2 h-2 bg-[#c48c5a] rounded-full"></div>}
                    </div>
                    <span className="text-white text-sm font-medium">Credit/Debit Card</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center border-t border-white/10 mt-6">
                <div className="text-white">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Total to Pay</p>
                  <p className="text-2xl font-black text-[#c48c5a]">${finalTotal.toFixed(2)}</p>
                </div>
                <button type="submit" className="bg-[#c48c5a] text-[#110804] px-8 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#e8c39e] transition-all">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Order Placed!</h2>
            <p className="text-white/50 font-['Hind_Siliguri'] mb-8">আপনার অর্ডারটি সফলভাবে রিসিভ করা হয়েছে। খুব শিঘ্রই আমরা আপনার সাথে যোগাযোগ করব।</p>
            <p className="text-[#c48c5a] text-sm tracking-widest font-mono mb-8">ORDER ID: #BLS-{Math.floor(Math.random() * 1000000)}</p>
            <button onClick={handleClose} className="border border-[#c48c5a] text-[#c48c5a] px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#c48c5a] hover:text-[#110804] transition-all">
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
}