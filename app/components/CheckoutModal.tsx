"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useGeoLock } from "../context/GeoLockContext";

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    finalTotal,
    subTotal,
    discount,
    puzzleDiscount,
    cartItems,
    clearCart,
    tableId,
    adultCount,
    childrenCount,
    setAdultCount,
    setChildrenCount,
    isShopOpen,
  } = useCart();
  const { canOrder, ensureTracking } = useGeoLock();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (isCheckoutOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (isCheckoutOpen) ensureTracking();
  }, [isCheckoutOpen, ensureTracking]);

  useEffect(() => {
    if (isCheckoutOpen && (!isShopOpen || !tableId || !canOrder)) {
      setIsCheckoutOpen(false);
    }
  }, [isCheckoutOpen, isShopOpen, tableId, canOrder, setIsCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canOrder || !isShopOpen || !tableId) return;
    if (adultCount < 1) {
      alert("অন্তত ১ জন প্রাপ্তবয়স্ক প্রয়োজন।");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const orderData = {
      customerName: formData.get("name"),
      email: formData.get("email") || "guest@blackstone.com",
      phone: formData.get("phone"),
      address: formData.get("address"),
      tableNumber: tableId,
      adults: adultCount,
      children: childrenCount,
      items: cartItems,
      subTotal,
      discount: discount + puzzleDiscount,
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
        const err = await response.json().catch(() => ({}));
        alert(err.error || "Order failed!");
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
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      ></div>
      <div className="relative w-full max-w-xl bg-[#1a100c] p-8 rounded-3xl border border-white/10 font-['Hind_Siliguri']">
        {step === "form" ? (
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <h2 className="text-[#c48c5a] text-xl font-bold uppercase tracking-widest">
              Checkout
            </h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-[10px] uppercase tracking-widest text-white/40">
                Table ID
              </p>
              <p className="mt-1 font-[family-name:var(--font-geist-sans)] text-lg font-black tabular-nums text-[#c48c5a]">
                #{tableId}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[10px] uppercase tracking-widest text-white/40">
                প্রাপ্তবয়স্ক
                <input
                  type="number"
                  min={1}
                  value={adultCount}
                  onChange={(e) =>
                    setAdultCount(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="mt-1 w-full bg-white/5 p-3 rounded-xl text-white outline-none font-[family-name:var(--font-geist-sans)] tabular-nums"
                />
              </label>
              <label className="text-[10px] uppercase tracking-widest text-white/40">
                শিশু
                <input
                  type="number"
                  min={0}
                  value={childrenCount}
                  onChange={(e) =>
                    setChildrenCount(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                  className="mt-1 w-full bg-white/5 p-3 rounded-xl text-white outline-none font-[family-name:var(--font-geist-sans)] tabular-nums"
                />
              </label>
            </div>
            <input
              name="name"
              required
              placeholder="Name"
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none"
            />
            <input
              name="phone"
              required
              placeholder="Phone"
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none font-[family-name:var(--font-geist-sans)]"
            />
            <textarea
              name="address"
              required
              placeholder="Address / notes"
              className="w-full bg-white/5 p-3 rounded-xl text-white outline-none rows={2}"
              rows={2}
            ></textarea>
            <div className="flex justify-between bg-white/5 p-4 rounded-xl font-[family-name:var(--font-geist-sans)] tabular-nums">
              <span className="text-white/50 uppercase text-[10px] font-bold self-center font-['Hind_Siliguri']">
                Total
              </span>
              <span className="text-[#c48c5a] font-black">${finalTotal.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading || !canOrder}
              className="w-full bg-[#c48c5a] py-4 rounded-xl font-bold uppercase text-xs text-[#110804] disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        ) : (
          <div className="text-center p-10">
            <h2 className="text-2xl text-white font-black mb-4 uppercase">Success!</h2>
            <p className="text-[#c48c5a] mb-6 font-[family-name:var(--font-geist-sans)] tabular-nums">
              Order ID: {orderId}
            </p>
            <button
              onClick={handleClose}
              className="bg-white/10 px-8 py-3 rounded-full text-white uppercase text-[10px] font-bold"
            >
              Shop More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
