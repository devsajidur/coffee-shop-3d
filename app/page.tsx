"use client";
import { useState } from "react";
import CoffeeScene from "./components/CoffeeScene";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);

  return (
    <main className="min-h-screen bg-[#110804] text-[#f5ebd9] overflow-x-hidden selection:bg-[#c48c5a] selection:text-black relative font-sans">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(60,35,20,0.4),transparent_60%)] pointer-events-none"></div>

      {/* --- Navbar Section (Updated with Dropdown) --- */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-10 py-6 flex justify-between items-center bg-[#110804]/40 backdrop-blur-md border-b border-white/10">
        
        {/* Logo */}
        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none cursor-pointer">
          <span className="text-white">BLACKSTONE</span> <br /> 
          <span className="text-[#c48c5a] text-sm font-bold tracking-[0.2em] mt-1 inline-block">COFFEE</span>
        </h2>
        
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.5em] font-bold opacity-80 items-center">
          
          {/* MENU with Dropdown */}
          <div className="relative group py-4">
            <button className="flex items-center gap-2 hover:text-[#c48c5a] transition-colors focus:outline-none">
              Menu
              {/* Dropdown Arrow Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Menu Box */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-[#1a100c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6">
                
                {/* Category 1 */}
                <div>
                  <h3 className="text-[#c48c5a] tracking-[0.3em] mb-3 border-b border-white/10 pb-2">Hot Brews</h3>
                  <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                    <li><a href="#espresso" className="hover:text-white hover:translate-x-1 inline-block transition-all">Classic Espresso</a></li>
                    <li><a href="#latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Caramel Latte</a></li>
                    <li><a href="#cappuccino" className="hover:text-white hover:translate-x-1 inline-block transition-all">Dark Cappuccino</a></li>
                  </ul>
                </div>

                {/* Category 2 */}
                <div>
                  <h3 className="text-[#c48c5a] tracking-[0.3em] mb-3 border-b border-white/10 pb-2">Cold & Fresh</h3>
                  <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                    <li><a href="#iced-latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Iced Vanilla Latte</a></li>
                    <li><a href="#cold-brew" className="hover:text-white hover:translate-x-1 inline-block transition-all">Nitro Cold Brew</a></li>
                    <li><a href="#frappe" className="hover:text-white hover:translate-x-1 inline-block transition-all">Mocha Frappuccino</a></li>
                  </ul>
                </div>

                {/* Category 3 */}
                <div>
                  <h3 className="text-[#c48c5a] tracking-[0.3em] mb-3 border-b border-white/10 pb-2">Bites</h3>
                  <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                    <li><a href="#croissant" className="hover:text-white hover:translate-x-1 inline-block transition-all">Butter Croissant</a></li>
                    <li><a href="#muffin" className="hover:text-white hover:translate-x-1 inline-block transition-all">Blueberry Muffin</a></li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          <a href="#story" className="hover:text-[#c48c5a] transition-all py-4">Story</a>
          <a href="#visit" className="hover:text-[#c48c5a] transition-all py-4">Visit</a>
          
          {/* Extra Call to Action button in Navbar */}
          <a href="#book" className="ml-4 px-5 py-2 border border-[#c48c5a] text-[#c48c5a] rounded-full hover:bg-[#c48c5a] hover:text-[#110804] transition-all">
            Book Table
          </a>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen pt-36 pb-12 relative">
        
        <div className="relative z-[30] order-2 lg:order-1 p-10 lg:p-12 rounded-[2rem] 
          bg-gradient-to-br from-white/[0.06] via-transparent to-[#c48c5a]/[0.15] 
          backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col justify-center items-start 
          transition-all duration-700 ease-out 
          hover:border-[#c48c5a]/60 hover:shadow-[0_0_60px_-10px_rgba(196,140,90,0.3)] hover:to-[#c48c5a]/[0.25]">
          
          <h1 className="text-5xl lg:text-[90px] font-black leading-[0.9] mb-6 tracking-tight text-white uppercase">
            PURE JOY <br /> IN EVERY SIP
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-sm">
            Handcrafted coffee, perfected daily with the finest beans.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <button className="bg-[#c48c5a] text-[#110804] text-[11px] uppercase tracking-[0.1em] font-bold py-4 px-8 rounded-full hover:bg-[#e8c39e] transition-all shadow-xl">
              Order Coffee
            </button>
            <button className="bg-transparent border border-[#c48c5a] text-[#c48c5a] text-[11px] uppercase tracking-[0.1em] font-bold py-4 px-8 rounded-full hover:bg-white/5 transition-all">
              Explore Flavors
            </button>
          </div>

          <div className="flex gap-4">
             {[1, 2, 3].map((num) => (
               <div 
                 key={num} 
                 onClick={() => setActiveModel(num)}
                 className={`w-10 h-10 flex items-center justify-center rounded-lg border text-[10px] font-bold transition-all cursor-pointer
                   ${activeModel === num 
                     ? "bg-[#c48c5a] text-[#110804] border-[#c48c5a] scale-110 shadow-[0_0_15px_rgba(196,140,90,0.4)]" 
                     : "bg-white/5 border-white/10 text-[#f5ebd9] hover:border-[#c48c5a]"
                   }
                 `}
               >
                 {num}
               </div>
             ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2 w-full h-[60vh] lg:h-full min-h-[500px] flex items-center justify-center z-[20]">
          <CoffeeScene activeModel={activeModel} />
        </div>
      </section>

      {/* Decorative Bottom Elements */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-3 opacity-40 z-50 pointer-events-none">
        <div className="h-[1px] w-24 bg-white/40"></div>
        <p className="text-[9px] tracking-[1em] font-black text-white uppercase">Artisan Quality</p>
      </div>
    </main>
  );
}