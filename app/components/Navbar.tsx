"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  
  // setIsBookTableOpen এখানে ইমপোর্ট করা হলো
  const { cartItems, setIsCartOpen, setIsAuthOpen, isLoggedIn, setIsLoggedIn, setIsBookTableOpen } = useCart(); 
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-10 py-6 flex justify-between items-center bg-[#110804]/40 backdrop-blur-md border-b border-white/10">
        
        <h2 className="text-xl lg:text-2xl font-black tracking-tighter uppercase leading-none cursor-pointer">
          <span className="text-white">BLACKSTONE</span> <br /> 
          <span className="text-[#c48c5a] text-xs lg:text-sm font-bold tracking-[0.2em] mt-1 inline-block">COFFEE</span>
        </h2>
        
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 lg:space-x-12 text-[10px] uppercase tracking-[0.5em] font-bold opacity-80 items-center">
          
          <div className="relative group py-4">
            <button className="flex items-center gap-2 hover:text-[#c48c5a] transition-colors focus:outline-none">
              Menu
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-[#1a100c]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-3 gap-10">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-[#c48c5a] tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Hot Coffee</h3>
                    <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                      <li><a href="#espresso" className="hover:text-white hover:translate-x-1 inline-block transition-all">Classic Espresso</a></li>
                      <li><a href="#cappuccino" className="hover:text-white hover:translate-x-1 inline-block transition-all">Cappuccino</a></li>
                      <li><a href="#caffe-latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Caffe Latte</a></li>
                      <li><a href="#americano" className="hover:text-white hover:translate-x-1 inline-block transition-all">Americano</a></li>
                      <li><a href="#mocha" className="hover:text-white hover:translate-x-1 inline-block transition-all">Mocha</a></li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-[#c48c5a] tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Cold Coffee</h3>
                    <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                      <li><a href="#iced-americano" className="hover:text-white hover:translate-x-1 inline-block transition-all">Iced Americano</a></li>
                      <li><a href="#cold-brew" className="hover:text-white hover:translate-x-1 inline-block transition-all">Cold Brew</a></li>
                      <li><a href="#nitro-cold-brew" className="hover:text-white hover:translate-x-1 inline-block transition-all">Nitro Cold Brew</a></li>
                      <li><a href="#frappuccino" className="hover:text-white hover:translate-x-1 inline-block transition-all">Frappuccino</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#c48c5a] tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Signatures</h3>
                    <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                      <li><a href="#spanish-latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Spanish Latte</a></li>
                      <li><a href="#pistachio-latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Pistachio Latte</a></li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-[#c48c5a] tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Non-Coffee</h3>
                    <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                      <li><a href="#hot-chocolate" className="hover:text-white hover:translate-x-1 inline-block transition-all">Hot Chocolate</a></li>
                      <li><a href="#matcha-latte" className="hover:text-white hover:translate-x-1 inline-block transition-all">Matcha Latte</a></li>
                      <li><a href="#smoothies" className="hover:text-white hover:translate-x-1 inline-block transition-all">Smoothies & Juices</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#c48c5a] tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Food & Bakery</h3>
                    <ul className="flex flex-col gap-3 normal-case tracking-normal font-medium text-[13px] text-white/70">
                      <li><a href="#croissants" className="hover:text-white hover:translate-x-1 inline-block transition-all">Croissants</a></li>
                      <li><a href="#pastries" className="hover:text-white hover:translate-x-1 inline-block transition-all">Pastries</a></li>
                      <li><a href="#cakes" className="hover:text-white hover:translate-x-1 inline-block transition-all">Cakes</a></li>
                      <li><a href="#sandwiches" className="hover:text-white hover:translate-x-1 inline-block transition-all">Sandwiches</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a href="#story" className="hover:text-[#c48c5a] transition-all py-4">Story</a>
          <a href="#visit" className="hover:text-[#c48c5a] transition-all py-4">Visit</a>

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <button onClick={() => setIsLoggedIn(false)} className="hover:text-[#c48c5a] transition-all py-4">Logout</button>
          ) : (
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-[#c48c5a] transition-all py-4">Login</button>
          )}
          
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-[#c48c5a] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c48c5a] text-[#110804] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Book Table Button */}
          <button onClick={() => setIsBookTableOpen(true)} className="ml-4 px-5 py-2 border border-[#c48c5a] text-[#c48c5a] rounded-full hover:bg-[#c48c5a] hover:text-[#110804] transition-all focus:outline-none">
            Book Table
          </button>

        </div>

        {/* Mobile Header Right */}
        <div className="flex md:hidden items-center gap-6 z-[160]">
          
          <button onClick={() => isLoggedIn ? setIsLoggedIn(false) : setIsAuthOpen(true)} className="text-white hover:text-[#c48c5a] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-[#c48c5a] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c48c5a] text-[#110804] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="flex flex-col gap-1.5 focus:outline-none"
          >
            <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>

      </nav>

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full md:hidden bg-[#110804]/95 backdrop-blur-xl z-[150] p-10 pt-36 border-l border-white/10 flex flex-col gap-10 text-[11px] uppercase tracking-[0.6em] font-bold opacity-80 transition-transform duration-300 overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button 
          onClick={() => { setIsMenuOpen(false); setIsMobileDropdownOpen(false); }} 
          className="absolute top-8 right-8 text-white text-3xl opacity-60 hover:opacity-100"
        >
          &times;
        </button>

        <div className="flex flex-col gap-8 pb-10">
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
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Hot Coffee</h4>
                  <a href="#espresso" onClick={() => setIsMenuOpen(false)}>Classic Espresso</a>
                  <a href="#cappuccino" onClick={() => setIsMenuOpen(false)}>Cappuccino</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Cold Coffee</h4>
                  <a href="#iced-americano" onClick={() => setIsMenuOpen(false)}>Iced Americano</a>
                  <a href="#cold-brew" onClick={() => setIsMenuOpen(false)}>Cold Brew</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Signatures</h4>
                  <a href="#spanish-latte" onClick={() => setIsMenuOpen(false)}>Spanish Latte</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Non-Coffee</h4>
                  <a href="#hot-chocolate" onClick={() => setIsMenuOpen(false)}>Hot Chocolate</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[#c48c5a] uppercase font-bold text-[10px] tracking-[0.2em]">Food & Bakery</h4>
                  <a href="#croissants" onClick={() => setIsMenuOpen(false)}>Croissants</a>
                  <a href="#sandwiches" onClick={() => setIsMenuOpen(false)}>Sandwiches</a>
                </div>
              </div>
            )}
          </div>

          <a href="#story" onClick={() => setIsMenuOpen(false)}>Story</a>
          <a href="#visit" onClick={() => setIsMenuOpen(false)}>Visit</a>
          
          {isLoggedIn ? (
            <button onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); }} className="text-left text-white hover:text-[#c48c5a] transition-all">Logout</button>
          ) : (
            <button onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }} className="text-left text-white hover:text-[#c48c5a] transition-all">Login / Sign Up</button>
          )}

          {/* Mobile Book Table Button */}
          <button onClick={() => { setIsBookTableOpen(true); setIsMenuOpen(false); }} className="px-6 py-3 border border-[#c48c5a] text-[#c48c5a] rounded-full text-center hover:bg-[#c48c5a] hover:text-[#110804] transition-all focus:outline-none mt-4">
            Book Table
          </button>
        </div>
      </div>
    </>
  );
}