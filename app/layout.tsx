import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import BookTableModal from "./components/BookTableModal"; 

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
          {children}
          <CartSidebar />
          <CheckoutModal />
          <AuthModal />
          <BookTableModal /> 
        </CartProvider>
      </body>
    </html>
  );
}