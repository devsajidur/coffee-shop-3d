"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = { id: string; name: string; price: number; image: string; quantity: number; };

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  isCartOpen: boolean; setIsCartOpen: (isOpen: boolean) => void;
  isCheckoutOpen: boolean; setIsCheckoutOpen: (isOpen: boolean) => void;
  isAuthOpen: boolean; setIsAuthOpen: (isOpen: boolean) => void;
  isBookTableOpen: boolean; setIsBookTableOpen: (isOpen: boolean) => void; // <--- নতুন
  isLoggedIn: boolean; setIsLoggedIn: (isLogged: boolean) => void;
  subTotal: number; discount: number; finalTotal: number;
  activeCoupon: string | null; couponMessage: string;
  applyCoupon: (code: string) => void; removeCoupon: () => void; clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookTableOpen, setIsBookTableOpen] = useState(false); // <--- নতুন
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) return prev.map((item) => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCartItems((prev) => prev.filter((item) => item.id !== id));
  const updateQuantity = (id: string, amount: number) => setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
  const clearCart = () => { setCartItems([]); setActiveCoupon(null); };

  const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  let discount = 0; let couponMessage = "";

  if (activeCoupon === "COFFEE20") {
    if (subTotal >= 30) { discount = subTotal * 0.20; couponMessage = "20% Discount Applied!"; } 
    else { couponMessage = `Add $${(30 - subTotal).toFixed(2)} more to use this code.`; }
  } else if (activeCoupon === "FLAT5") {
    if (subTotal >= 20) { discount = 5.00; couponMessage = "$5 Flat Discount Applied!"; } 
    else { couponMessage = `Minimum order $20 required for this code.`; }
  }

  const finalTotal = subTotal - discount;

  const applyCoupon = (code: string) => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === "COFFEE20" || uppercaseCode === "FLAT5") setActiveCoupon(uppercaseCode);
    else setActiveCoupon("INVALID");
  };
  const removeCoupon = () => setActiveCoupon(null);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, 
      isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen,
      isAuthOpen, setIsAuthOpen, isBookTableOpen, setIsBookTableOpen, isLoggedIn, setIsLoggedIn,
      subTotal, discount, finalTotal, activeCoupon, couponMessage, applyCoupon, removeCoupon, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};