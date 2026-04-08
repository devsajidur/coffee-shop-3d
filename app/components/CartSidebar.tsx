"use client";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      {/* Background Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#1a100c]/95 backdrop-blur-xl border-l border-white/10 z-[200] p-6 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-[#c48c5a] text-lg font-bold tracking-[0.2em] uppercase">Your Order</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-white/60 hover:text-white text-3xl transition-colors">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-[#c48c5a]/50">
          {cartItems.length === 0 ? (
            <div className="text-center text-white/50 mt-20 font-['Hind_Siliguri']">আপনার কার্টে কোনো আইটেম নেই।</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-black" />
                <div className="flex-grow">
                  <h4 className="text-white font-bold text-sm">{item.name}</h4>
                  <p className="text-[#c48c5a] text-sm font-black mt-1">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#c48c5a] transition-colors">-</button>
                    <span className="text-white text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#c48c5a] transition-colors">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400/70 hover:text-red-400 p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/10 pt-6 mt-4">
          <div className="flex justify-between text-white mb-6">
            <span className="font-bold tracking-widest uppercase text-sm">Total</span>
            <span className="font-black text-xl text-[#c48c5a]">${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            className="w-full bg-[#c48c5a] text-[#110804] py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#e8c39e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}