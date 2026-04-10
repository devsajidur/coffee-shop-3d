"use client"; 
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addToCart } = useCart();

  // ডাটাবেস থেকে প্রোডাক্টগুলো নিয়ে আসার জন্য useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setMenuItems([]); // এরর হলে খালি লিস্ট
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (item: any) => {
    // ডাটাবেস থেকে আসা প্রাইস স্ট্রিংকে ($3.00) নাম্বারে কনভার্ট করা
    const priceNumber = typeof item.price === "string" 
      ? parseFloat(item.price.replace('$', '')) 
      : item.price;
    
    addToCart({
      id: item.id,
      name: item.name,
      price: priceNumber,
      image: item.image,
      quantity: 1
    });

    setAddedItem(item.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 2000);
  };

  if (loading) {
    return (
      <section id="menu" className="max-w-7xl mx-auto px-6 py-16 text-center scroll-mt-20">
        <p className="text-[#c48c5a] animate-pulse uppercase tracking-widest font-bold">Loading Blackstone Menu...</p>
      </section>
    );
  }

  return (
    <section id="menu" className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-20 scroll-mt-20 font-['Hind_Siliguri']">
      
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-[#c48c5a] text-xs lg:text-sm font-bold tracking-[0.3em] uppercase mb-3 lg:mb-4">Discover</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">Our Signature Menu</h3>
        <p className="text-white/50 text-sm mt-4 max-w-xl mx-auto font-normal">আমাদের সিগনেচার মেনু থেকে আপনার পছন্দের প্রিমিয়াম কফি এবং বেকারি আইটেম বেছে নিন।</p>
        <div className="w-12 lg:w-16 h-[2px] bg-[#c48c5a] mx-auto mt-6"></div>
      </div>

      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {menuItems.map((item: any) => (
                <div key={item._id} id={item.id} className="group p-5 rounded-[2rem] bg-[#1a100c]/80 border border-white/5 backdrop-blur-md transition-all duration-500 hover:bg-[#20140f] hover:border-[#c48c5a]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(196,140,90,0.15)] scroll-mt-32 flex flex-col h-full">
                
                    <div className="w-full h-48 md:h-52 mb-6 overflow-hidden rounded-2xl relative bg-[#110804]">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            // যদি ছবি লোড হতে এরর হয়, তবে একটি ডামি ছবি দেখাবে
                            onError={(e) => {
                                (e.target as HTMLImageElement).onerror = null; // ইনফিনিট লুপ এড়াতে
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/110804/c48c5a?text=Cappuccino';
                            }}
                        />
                        <div className="absolute top-3 right-3 bg-[#110804]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                            <span className="text-sm font-black text-[#c48c5a]">{item.price}</span>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col">
                        <p className="text-[#c48c5a] text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5">{item.type}</p>
                        <h4 className="text-lg font-bold text-white group-hover:text-[#c48c5a] transition-colors mb-2">{item.name}</h4>
                        
                        <p className="text-xs text-white/50 leading-relaxed mb-6 flex-grow tracking-wide font-normal">{item.desc}</p>
                        
                        <button 
                            onClick={() => handleAddToCart(item)}
                            className={`w-full py-3 rounded-xl text-[11px] uppercase tracking-[0.1em] font-bold transition-all duration-300 border ${
                            addedItem === item.id 
                                ? "bg-green-500/20 text-green-400 border-green-500/50" 
                                : "bg-transparent text-[#c48c5a] border-[#c48c5a]/30 hover:bg-[#c48c5a] hover:text-[#110804] hover:border-[#c48c5a]" 
                            }`}
                        >
                            {addedItem === item.id ? "Added ✓" : "Add to Order"}
                        </button>
                    </div>

                </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16 text-white/30 border border-white/5 bg-white/5 rounded-3xl">
            <p>No products found. Please seed the database first.</p>
        </div>
      )}
    </section>
  );
}