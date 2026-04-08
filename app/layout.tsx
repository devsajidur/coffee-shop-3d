import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --- নতুন ইমপোর্টগুলো ---
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true} 
      >
        {/* CartProvider দিয়ে পুরো অ্যাপ র‍্যাপ করা হলো যাতে সব পেজ থেকে কার্ট অ্যাক্সেস করা যায় */}
        <CartProvider>
          {children}
          {/* CartSidebar যুক্ত করা হলো */}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}