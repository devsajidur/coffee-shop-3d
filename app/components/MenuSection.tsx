"use client"; 
import { useState } from "react";

export default function MenuSection() {
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const menuItems = [
    // --- Hot Coffee ---
    { id: "espresso", name: "Classic Espresso", desc: "একদম পিউর এবং কড়া কফি শট।", price: "$3.00", type: "Hot Coffee", image: "/assets/coffee-items/Espresso.png" },
    { id: "macchiato", name: "Macchiato", desc: "এসপ্রেসোর ওপর সামান্য দুধের ফোম।", price: "$3.50", type: "Hot Coffee", image: "/assets/coffee-items/Macchiato.png" },
    { id: "cortado", name: "Cortado", desc: "সমান পরিমাণ এসপ্রেসো এবং গরম দুধ।", price: "$4.00", type: "Hot Coffee", image: "/assets/coffee-items/Cortado.png" },
    
    { id: "caffe-latte", name: "Caffe Latte", desc: "বেশি পরিমাণ দুধ ও অল্প ফোমসহ এসপ্রেসো।", price: "$4.50", type: "Hot Coffee", image: "/assets/coffee-items/Caffe-Latte.png" },
    { id: "flat-white", name: "Flat White", desc: "সরু মাইক্রো-ফোমযুক্ত সিল্কি টেক্সচারের কফি।", price: "$4.50", type: "Hot Coffee", image: "/assets/coffee-items/Flat-White.png" },
    { id: "americano", name: "Americano", desc: "এসপ্রেসোর সাথে গরম পানির মিশ্রণ।", price: "$3.50", type: "Hot Coffee", image: "/assets/coffee-items/Americano.png" },
    { id: "mocha", name: "Mocha", desc: "এসপ্রেসো, চকোলেট সিরাপ এবং স্টিমড মিল্ক।", price: "$5.00", type: "Hot Coffee", image: "/assets/coffee-items/Mocha.png" },

    // --- Cold Coffee ---
    { id: "iced-americano", name: "Iced Americano", desc: "বরফ ও ঠান্ডা পানির সাথে এসপ্রেসো।", price: "$4.00", type: "Cold Coffee", image: "/assets/coffee-items/Iced-Americano.png" },
    { id: "cold-brew", name: "Cold Brew", desc: "১২-২৪ ঘণ্টা ঠান্ডা পানিতে ভিজিয়ে রাখা বিশেষ কফি।", price: "$4.50", type: "Cold Coffee", image: "/assets/coffee-items/Cold-Brew.png" },
    { id: "nitro-cold-brew", name: "Nitro Cold Brew", desc: "নাইট্রোজেন গ্যাস মিশ্রিত ক্রিমি টেক্সচারের কোল্ড কফি।", price: "$5.50", type: "Cold Coffee", image: "/assets/coffee-items/Nitro-Cold-Brew.png" },
    { id: "affogato", name: "Affogato", desc: "ভ্যানিলা আইসক্রিমের ওপর গরম এসপ্রেসো ঢেলে দেওয়া।", price: "$6.00", type: "Cold Coffee", image: "/assets/coffee-items/Affogato.png" },
    { id: "frappuccino", name: "Frappuccino", desc: "বরফ, কফি এবং বিভিন্ন ফ্লেভার একসাথে ব্লেন্ড করা।", price: "$5.50", type: "Cold Coffee", image: "/assets/coffee-items/Frappuccino.png" },

    // --- Signatures ---
    { id: "spanish-latte", name: "Spanish Latte", desc: "কনডেন্সড মিল্ক ও এসপ্রেসোর মিষ্টি মিশ্রণ।", price: "$5.50", type: "Signatures", image: "/assets/coffee-items/Spanish-Latte.png" },
    { id: "salted-caramel", name: "Salted Caramel Latte", desc: "লবণাক্ত ক্যারামেল ফ্লেভারের লাতে।", price: "$5.50", type: "Signatures", image: "/assets/coffee-items/Salted-Caramel-Latte.png" },
    { id: "lavender-latte", name: "Lavender Latte", desc: "ফুলের সুগন্ধিযুক্ত প্রিমিয়াম লাতে।", price: "$6.00", type: "Signatures", image: "/assets/coffee-items/Lavender-Latte.png" },
    { id: "pistachio-latte", name: "Pistachio Latte", desc: "পেস্তা বাদামের ফ্লেভার দেওয়া কফি।", price: "$6.00", type: "Signatures", image: "/assets/coffee-items/Pistachio-Latte.png" },

    // --- Non-Coffee ---
    { id: "hot-chocolate", name: "Hot Chocolate", desc: "প্রিমিয়াম ডার্ক বা মিল্ক চকোলেটের পানীয়।", price: "$4.50", type: "Non-Coffee", image: "/assets/coffee-items/Hot-Chocolate.png" },
    { id: "matcha-latte", name: "Matcha Latte", desc: "জাপানিজ গ্রিন টি পাউডার ও দুধের মিশ্রণ।", price: "$5.00", type: "Non-Coffee", image: "/assets/coffee-items/Matcha-Latte.png" },
    { id: "artisan-tea", name: "Artisan Tea", desc: "গ্রিন টি, আর্ল গ্রে, ক্যামোমাইল বা জেসমিন টি।", price: "$3.50", type: "Non-Coffee", image: "/assets/coffee-items/Artisan-Tea.png" },
    { id: "smoothies", name: "Smoothies & Juices", desc: "তাজা ফল বা বেরি দিয়ে তৈরি স্মুদি।", price: "$6.00", type: "Non-Coffee", image: "/assets/coffee-items/Smoothies&Juices.png" },

    // --- Food & Bakery ---
    { id: "croissants", name: "Croissants", desc: "মাখনযুক্ত প্লেইন, চকোলেট বা আমন্ড ক্রসাঁ।", price: "$3.50", type: "Food & Bakery", image: "/assets/coffee-items/Croissants.png" },
    { id: "pastries", name: "Pastries", desc: "ড্যানিশ, মাফিন বা বিভিন্ন স্বাদের কুকিজ।", price: "$3.00", type: "Food & Bakery", image: "/assets/coffee-items/Pastries.png" },
    { id: "cakes", name: "Cakes", desc: "চিজকেক, রেড ভেলভেট বা বেলজিয়ান চকোলেট কেক।", price: "$5.00", type: "Food & Bakery", image: "/assets/coffee-items/Cakes.png" },
    { id: "sandwiches", name: "Sandwiches", desc: "চিকেন অ্যাভোকাডো, স্মোকড টার্কি বা চিজ স্যান্ডউইচ।", price: "$7.00", type: "Food & Bakery", image: "/assets/coffee-items/Sandwiches.png" }
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
        <p className="text-white/50 text-sm mt-4 max-w-xl mx-auto font-['Hind_Siliguri']">আমাদের সিগনেচার মেনু থেকে আপনার পছন্দের প্রিমিয়াম কফি এবং বেকারি আইটেম বেছে নিন।</p>
        <div className="w-12 lg:w-16 h-[2px] bg-[#c48c5a] mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {menuItems.map((item) => (
          <div key={item.id} id={item.id} className="group p-5 rounded-[2rem] bg-[#1a100c]/80 border border-white/5 backdrop-blur-md transition-all duration-500 hover:bg-[#20140f] hover:border-[#c48c5a]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(196,140,90,0.15)] scroll-mt-32 flex flex-col h-full">
            
            <div className="w-full h-48 md:h-52 mb-6 overflow-hidden rounded-2xl relative bg-[#110804]">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/110804/c48c5a?text=Coffee';
                }}
              />
              <div className="absolute top-3 right-3 bg-[#110804]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <span className="text-sm font-black text-[#c48c5a]">{item.price}</span>
              </div>
            </div>

            <div className="flex-grow flex flex-col">
              <p className="text-[#c48c5a] text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5">{item.type}</p>
              <h4 className="text-lg font-bold text-white group-hover:text-[#c48c5a] transition-colors mb-2">{item.name}</h4>
              
              {/* এখানেই বাংলা ফন্ট অ্যাড করা হয়েছে */}
              <p className="text-xs text-white/50 leading-relaxed mb-6 flex-grow font-['Hind_Siliguri'] tracking-wide">{item.desc}</p>
              
              <button 
                onClick={() => handleAddToCart(item.id)}
                className={`w-full py-3 rounded-xl text-[11px] uppercase tracking-[0.1em] font-bold transition-all duration-300 border ${
                  addedItem === item.id 
                    ? "bg-green-500/20 text-green-400 border-green-500/50" 
                    : "bg-transparent text-[#c48c5a] border-[#c48c5a]/30 hover:bg-[#c48c5a] hover:text-[#110804] hover:border-[#c48c5a]" 
                }`}
              >
                {addedItem === item.id ? "Added to Cart ✓" : "Add to Order"}
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}