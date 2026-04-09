"use client";
import { useState } from "react";
import CoffeeScene from "./CoffeeScene"; 

export default function HeroSection() {
  const [activeModel, setActiveModel] = useState(1);

  return (
    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen pt-28 md:pt-36 pb-12 relative z-20">
      
      {/* Text Card */}
      <div className="order-2 md:order-1 relative p-8 md:p-10 lg:p-12 rounded-[2rem] 
        bg-gradient-to-br from-white/[0.06] via-transparent to-[#c48c5a]/[0.15] 
        backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col justify-center items-start 
        transition-all duration-700 ease-out 
        hover:border-[#c48c5a]/60 hover:shadow-[0_0_60px_-10px_rgba(196,140,90,0.3)] hover:to-[#c48c5a]/[0.25]">
        
        <h1 className="text-3xl md:text-[40px] lg:text-[75px] font-black leading-[1] mb-4 md:mb-6 tracking-tight text-white uppercase mt-2 md:mt-0">
          PURE JOY <br /> IN EVERY SIP
        </h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
          Handcrafted coffee, perfected daily with the finest beans.
        </p>
        
        <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10">
          <a href="#menu" className="bg-[#c48c5a] text-[#110804] text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-bold py-3 px-6 md:py-4 md:px-8 rounded-full hover:bg-[#e8c39e] transition-all shadow-xl">
            Order Coffee
          </a>
          <a href="#menu" className="bg-transparent border border-[#c48c5a] text-[#c48c5a] text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-bold py-3 px-6 md:py-4 md:px-8 rounded-full hover:bg-white/5 transition-all">
            Explore Flavors
          </a>
        </div>

        <div className="flex gap-3 md:gap-4">
           {[1, 2, 3].map((num) => (
             <div key={num} onClick={() => setActiveModel(num)}
               className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg border text-[10px] font-bold transition-all cursor-pointer
                 ${activeModel === num ? "bg-[#c48c5a] text-[#110804] border-[#c48c5a] scale-110 shadow-[0_0_15px_rgba(196,140,90,0.4)]" : "bg-white/5 border-white/10 text-[#f5ebd9] hover:border-[#c48c5a]"}`}>
               {num}
             </div>
           ))}
        </div>
      </div>

      <div className="order-1 md:order-2 w-full h-[35vh] md:h-[45vh] lg:h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center mt-16 md:mt-0">
        <CoffeeScene activeModel={activeModel} />
      </div>
    </section>
  );
}