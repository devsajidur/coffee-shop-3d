"use client"; 
import { useState } from "react";

export default function MenuSection() {
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const menuItems = [
    { id: "espresso", name: "Classic Espresso", desc: "Rich, full-bodied espresso with a thick crema.", price: "$3.50", type: "Hot Brew" },
    { id: "latte", name: "Caramel Latte", desc: "Espresso with steamed milk and a touch of caramel.", price: "$4.50", type: "Hot Brew" },
    { id: "cappuccino", name: "Dark Cappuccino", desc: "Perfect balance of espresso, steamed milk and foam.", price: "$4.00", type: "Hot Brew" },
    { id: "iced-latte", name: "Iced Vanilla Latte", desc: "Chilled espresso, milk, and sweet vanilla syrup.", price: "$5.00", type: "Cold & Fresh" },
    { id: "cold-brew", name: "Nitro Cold Brew", desc: "Smooth, velvety cold brew infused with nitrogen.", price: "$5.50", type: "Cold & Fresh" },
    { id: "croissant", name: "Butter Croissant", desc: "Flaky, buttery French pastry baked fresh daily.", price: "$3.00", type: "Bites" },
  ];

  const handleAddToCart = (id: string) => {
    setAddedItem(id);
    setTimeout(() => {
      setAddedItem(null);
    }, 2000);
  };

  return (
    <section id="menu" className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-20 scroll-mt-20">
      
      
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-[#c48c5a] text-xs lg:text-sm font-bold tracking-[0.3em] uppercase mb-3 lg:mb-4">Discover</h2>
        
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">Our Signature Menu</h3>
        
        <div className="w-12 lg:w-16 h-[2px] bg-[#c48c5a] mx-auto mt-4 lg:mt-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} id={item.id} className="group p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:border-[#c48c5a]/50 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(196,140,90,0.2)] scroll-mt-32">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[#c48c5a] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">{item.type}</p>
                <h4 className="text-lg lg:text-xl font-bold text-white group-hover:text-[#c48c5a] transition-colors">{item.name}</h4>
              </div>
              <span className="text-base lg:text-lg font-black text-white/90">{item.price}</span>
            </div>
            <p className="text-xs lg:text-sm text-white/50 leading-relaxed mb-6">{item.desc}</p>
            
            <button 
              onClick={() => handleAddToCart(item.id)}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold border-b pb-1 transition-all duration-300 ${
                addedItem === item.id 
                  ? "text-green-400 border-green-400" 
                  : "text-[#c48c5a] border-[#c48c5a]/30 hover:border-[#c48c5a]" 
              }`}
            >
              {addedItem === item.id ? "Added! ✓" : "Add to Order +"}
            </button>

          </div>
        ))}
      </div>
    </section>
  );
}