"use client";
import { useState } from "react";

export default function Navbar() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  return (
    <>
     
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-10 py-6 flex justify-between items-center bg-[#110804]/40 backdrop-blur-md border-b border-white/10">
        
      
        <h2 className="text-xl lg:text-2xl font-black tracking-tighter uppercase leading-none cursor-pointer">
          <span className="text-white">BLACKSTONE</span> <br /> 
          <span className="text-[#c48c5a] text-xs lg:text-sm font-bold tracking-[0.2em] mt-1 inline-block">COFFEE</span>
        </h2>
        
        
        <div className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.5em] font-bold opacity-80 items-center">
          
       
          <div className="relative group py-4">
            <button className="flex items-center gap-2 hover:text-[#c48c5a] transition-colors focus:outline-none">
              Menu
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-[#1a100c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6">
                <div>
                  <h3 className="text-[#c48c5a] tracking-[0.3em] mb-3 border-b border-white/10 pb-2">Hot Brews</h3>
                  <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                    <li><a href="#espresso" className="hover:text-white hover:translate-x-1 inline-block transition-all">Classic Espresso</a></li>
                    <li><a href="#latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Caramel Latte</a></li>
                    <li><a href="#cappuccino" className="hover:text-white hover:translate-x-1 inline-block transition-all">Dark Cappuccino</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[#c48c5a] tracking-[0.3em] mb-3 border-b border-white/10 pb-2">Cold & Fresh</h3>
                  <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                    <li><a href="#iced-latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Iced Vanilla Latte</a></li>
                    <li><a href="#cold-brew" className="hover:text-white hover:translate-x-1 inline-block transition-all">Nitro Cold Brew</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[#c48c5a] tracking-[0.3em] mb-3 border-b border-white/10 pb-2">Bites</h3>
                  <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                    <li><a href="#croissant" className="hover:text-white hover:translate-x-1 inline-block transition-all">Butter Croissant</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <a href="#story" className="hover:text-[#c48c5a] transition-all py-4">Story</a>
          <a href="#visit" className="hover:text-[#c48c5a] transition-all py-4">Visit</a>
          <a href="#book" className="ml-4 px-5 py-2 border border-[#c48c5a] text-[#c48c5a] rounded-full hover:bg-[#c48c5a] hover:text-[#110804] transition-all">
            Book Table
          </a>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="flex md:hidden flex-col gap-1.5 focus:outline-none z-[160]"
        >
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "opacity-0" : ""}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
        </button>

      </nav>

      <div 
        className={`fixed top-0 right-0 h-screen w-full md:hidden bg-[#110804]/95 backdrop-blur-xl z-[150] p-10 pt-36 border-l border-white/10 flex flex-col gap-10 text-[11px] uppercase tracking-[0.6em] font-bold opacity-80 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      
        <button 
          onClick={() => { setIsMenuOpen(false); setIsMobileDropdownOpen(false); }} 
          className="absolute top-8 right-8 text-white text-3xl opacity-60 hover:opacity-100"
        >
          &times;
        </button>

        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col gap-5">
            <button 
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className="flex items-center gap-3 text-white hover:text-[#c48c5a] transition-colors focus:outline-none"
            >
              Menu
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isMobileDropdownOpen && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 pl-8 flex flex-col gap-6 font-medium normal-case tracking-normal text-[13px] text-white/70">
                
                {/* Hot Brews */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Hot Brews</h4>
                  <a href="#espresso" onClick={() => setIsMenuOpen(false)}>Classic Espresso</a>
                  <a href="#latte" onClick={() => setIsMenuOpen(false)}>Caramel Latte</a>
                  <a href="#cappuccino" onClick={() => setIsMenuOpen(false)}>Dark Cappuccino</a>
                </div>

                {/* Cold & Fresh */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Cold & Fresh</h4>
                  <a href="#iced-latte" onClick={() => setIsMenuOpen(false)}>Iced Vanilla Latte</a>
                  <a href="#cold-brew" onClick={() => setIsMenuOpen(false)}>Nitro Cold Brew</a>
                </div>

             
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Bites</h4>
                  <a href="#croissant" onClick={() => setIsMenuOpen(false)}>Butter Croissant</a>
                </div>

              </div>
            )}
          </div>

          <a href="#story" onClick={() => setIsMenuOpen(false)}>Story</a>
          <a href="#visit" onClick={() => setIsMenuOpen(false)}>Visit</a>
        </div>
        
        <a href="#book" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 border border-[#c48c5a] text-[#c48c5a] rounded-full text-center hover:bg-[#c48c5a] hover:text-[#110804] transition-all">
          Book Table
        </a>
      </div>
    </>
  );
}