"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getShopHoursSnapshot } from "@/lib/shopHours";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type PublicSettings = {
  autoPuzzleDiscountEnabled: boolean;
  puzzleWinnerPercent: number;
  deliveryRadiusKm: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (isOpen: boolean) => void;
  isBookTableOpen: boolean;
  setIsBookTableOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLogged: boolean) => void;
  tableId: string | null;
  setTableId: (id: string | null) => void;
  adultCount: number;
  childrenCount: number;
  setAdultCount: (n: number) => void;
  setChildrenCount: (n: number) => void;
  subTotal: number;
  discount: number;
  puzzleDiscount: number;
  finalTotal: number;
  activeCoupon: string | null;
  couponMessage: string;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  clearCart: () => void;
  isShopOpen: boolean;
  shopCountdownMs: number;
  shopNextBoundaryLabel: string;
  distanceAlertOpen: boolean;
  setDistanceAlertOpen: (v: boolean) => void;
  shopClosedModalOpen: boolean;
  setShopClosedModalOpen: (v: boolean) => void;
  deliveryRadiusKm: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function formatBoundaryDhaka(d: Date): string {
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookTableOpen, setIsBookTableOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [publicSettings, setPublicSettings] = useState<PublicSettings | null>(
    null
  );
  const [shopTick, setShopTick] = useState(0);
  const [distanceAlertOpen, setDistanceAlertOpen] = useState(false);
  const [shopClosedModalOpen, setShopClosedModalOpen] = useState(false);

  useEffect(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsAuthOpen(false);
    setIsBookTableOpen(false);
    document.body.style.overflow = "unset";
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/settings/public");
        const d = await r.json();
        if (!alive) return;
        setPublicSettings({
          autoPuzzleDiscountEnabled: Boolean(d.autoPuzzleDiscountEnabled),
          puzzleWinnerPercent: Number(d.puzzleWinnerPercent) || 10,
          deliveryRadiusKm: Number(d.deliveryRadiusKm) > 0 ? Number(d.deliveryRadiusKm) : 3,
        });
      } catch {
        if (!alive) return;
        setPublicSettings({
          autoPuzzleDiscountEnabled: false,
          puzzleWinnerPercent: 10,
          deliveryRadiusKm: 3,
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setShopTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const shopSnap = useMemo(() => getShopHoursSnapshot(), [shopTick]);
  const isShopOpen = shopSnap.isOpen;
  const shopCountdownMs = shopSnap.msRemaining;
  const shopNextBoundaryLabel = formatBoundaryDhaka(shopSnap.nextBoundary);

  useEffect(() => {
    if (
      isCartOpen ||
      isCheckoutOpen ||
      isAuthOpen ||
      isBookTableOpen ||
      distanceAlertOpen ||
      shopClosedModalOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    isCartOpen,
    isCheckoutOpen,
    isAuthOpen,
    isBookTableOpen,
    distanceAlertOpen,
    shopClosedModalOpen,
  ]);

  const addToCart = useCallback((newItem: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, amount: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setActiveCoupon(null);
    setCouponDiscount(0);
    setCouponMessage("");
  }, []);

  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const puzzleDiscount = useMemo(() => {
    if (!publicSettings?.autoPuzzleDiscountEnabled) return 0;
    if (typeof window === "undefined") return 0;
    if (window.localStorage.getItem("blackstone_puzzle_winner") !== "1")
      return 0;
    const pct = publicSettings.puzzleWinnerPercent / 100;
    return Math.min(subTotal * pct, subTotal);
  }, [publicSettings, subTotal, shopTick]);

  const discount = couponDiscount;
  const finalTotal = Math.max(0, subTotal - discount - puzzleDiscount);

  const applyCoupon = useCallback(
    async (code: string) => {
      const trimmed = code.toUpperCase().trim();
      if (!trimmed) {
        setActiveCoupon("INVALID");
        setCouponDiscount(0);
        setCouponMessage("Enter a code.");
        return;
      }
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: trimmed, subTotal }),
        });
        const data = await res.json();
        if (data.ok) {
          setActiveCoupon(trimmed);
          setCouponDiscount(Number(data.discount) || 0);
          setCouponMessage(String(data.message || "Applied"));
        } else {
          setActiveCoupon("INVALID");
          setCouponDiscount(0);
          setCouponMessage(String(data.message || "Invalid code."));
        }
      } catch {
        setActiveCoupon("INVALID");
        setCouponDiscount(0);
        setCouponMessage("Could not validate coupon.");
      }
    },
    [subTotal]
  );

  const removeCoupon = useCallback(() => {
    setActiveCoupon(null);
    setCouponDiscount(0);
    setCouponMessage("");
  }, []);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isAuthOpen,
    setIsAuthOpen,
    isBookTableOpen,
    setIsBookTableOpen,
    isLoggedIn,
    setIsLoggedIn,
    tableId,
    setTableId,
    adultCount,
    childrenCount,
    setAdultCount,
    setChildrenCount,
    subTotal,
    discount,
    puzzleDiscount,
    finalTotal,
    activeCoupon,
    couponMessage,
    applyCoupon,
    removeCoupon,
    clearCart,
    isShopOpen,
    shopCountdownMs,
    shopNextBoundaryLabel,
    distanceAlertOpen,
    setDistanceAlertOpen,
    shopClosedModalOpen,
    setShopClosedModalOpen,
    deliveryRadiusKm: publicSettings?.deliveryRadiusKm ?? 3,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
