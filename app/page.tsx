"use client";
import { useState } from "react";
import CoffeeScene from "./components/CoffeeScene";

export default function Home() {
  const [activeModel, setActiveModel] = useState(1);

  return (
    <main className="min-h-screen bg-[#110804] text-[#f5ebd9] overflow-x-hidden selection:bg-[#c48c5a] selection:text-black relative font-sans">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(60,35,20,0.4),transparent_60%)] pointer-events-none"></div>

      <nav className="fixed top-0 left-0 w-full z-[100] px-10 py-8 flex justify-between items-center bg-white/[0.03] backdrop-blur-md border-b border-white/10">
        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
          <span className="text-white">BLACKSTONE</span> <br /> 
          <span className="text-[#c48c5a] text-sm font-bold tracking-[0.2em] mt-1 inline-block">COFFEE</span>
        </h2>
        
        <div className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.5em] font-bold opacity-60">
          <a href="#" className="hover:text-[#c48c5a] transition-all">Menu</a>
          <a href="#" className="hover:text-[#c48c5a] transition-all">Story</a>
          <a href="#" className="hover:text-[#c48c5a] transition-all">Visit</a>
        </div>
      </nav>

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

      {/* Established 2026 লেখাটি রিমুভ করা হয়েছে */}

      <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-3 opacity-40 z-50">
        <div className="h-[1px] w-24 bg-white/40"></div>
        <p className="text-[9px] tracking-[1em] font-black text-white uppercase">Artisan Quality</p>
      </div>
    </main>
  );
}