"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, finalTotal, subTotal, discount, cartItems, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (isCheckoutOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      customerName: formData.get("name"),
      email: formData.get("email") || "guest@blackstone.com",
      phone: formData.get("phone"),
      address: formData.get("address"),
      items: cartItems,
      subTotal,
      discount,
      totalAmount: finalTotal,
      paymentMethod: "cod",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.order.orderId);
        setStep("success");
        clearCart();
      } else {
        alert("Order failed!");
      }
    } catch (error) {
      console.error("Order Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => setStep("form"), 300);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose}></div>
      <div className="relative w-full max-w-xl bg-[#1a100c] p-8 rounded-3xl border border-white/10">
        {step === "form" ? (
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <h2 className="text-[#c48c5a] text-xl font-bold uppercase tracking-widest">Checkout</h2>
            <input name="name" required placeholder="Name" className="w-full bg-white/5 p-3 rounded-xl text-white outline-none" />
            <input name="phone" required placeholder="Phone" className="w-full bg-white/5 p-3 rounded-xl text-white outline-none" />
            <textarea name="address" required placeholder="Address" className="w-full bg-white/5 p-3 rounded-xl text-white outline-none" rows={2}></textarea>
            <div className="flex justify-between bg-white/5 p-4 rounded-xl">
              <span className="text-white/50 uppercase text-[10px] font-bold">Total</span>
              <span className="text-[#c48c5a] font-black">${finalTotal.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#c48c5a] py-4 rounded-xl font-bold uppercase text-xs">
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        ) : (
          <div className="text-center p-10">
            <h2 className="text-2xl text-white font-black mb-4 uppercase">Success!</h2>
            <p className="text-[#c48c5a] mb-6">Order ID: {orderId}</p>
            <button onClick={handleClose} className="bg-white/10 px-8 py-3 rounded-full text-white uppercase text-[10px] font-bold">Shop More</button>
          </div>
        )}
      </div>
    </div>
  );
}