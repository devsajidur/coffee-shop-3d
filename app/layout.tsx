import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./context/CartContext";
import { GeoLockProvider } from "./context/GeoLockContext";
import CartSidebar from "./components/CartSidebar";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import BookTableModal from "./components/BookTableModal";
import UrlTableSync from "./components/UrlTableSync";
import DistanceAlertModal from "./components/DistanceAlertModal";
import ShopClosedBanner from "./components/ShopClosedBanner";
import ShopClosedModal from "./components/ShopClosedModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blackstone Cafe | 3D Experience",
  description: "Premium Coffee Experience by Sajid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true} 
      >
        <CartProvider>
          <GeoLockProvider>
            <Suspense fallback={null}>
              <UrlTableSync />
            </Suspense>
            <ShopClosedBanner />
            <DistanceAlertModal />
            <ShopClosedModal />
            {children}
            <CartSidebar />
            <CheckoutModal />
            <AuthModal />
            <BookTableModal />
          </GeoLockProvider>
        </CartProvider>
      </body>
    </html>
  );
}