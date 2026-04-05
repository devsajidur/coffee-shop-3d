import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    {children}
  </body>
</html>
    
  );
}