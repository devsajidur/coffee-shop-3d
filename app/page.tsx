import Navbar from "./components/Navbar"; 
import HeroSection from "./components/HeroSection";
import MenuSection from "./components/MenuSection"; 
import StoryVisitSection from "./components/StoryVisitSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#110804] text-[#f5ebd9] overflow-x-hidden selection:bg-[#c48c5a] selection:text-black relative font-sans">
      
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(60,35,20,0.4),transparent_60%)] pointer-events-none"></div>

      <Navbar />
      <HeroSection />
      <MenuSection />
      <StoryVisitSection />

      {/* Decorative Bottom Elements */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-3 opacity-40 z-50 pointer-events-none">
        <div className="h-[1px] w-24 bg-white/40"></div>
        <p className="text-[9px] tracking-[1em] font-black text-white uppercase">Artisan Quality</p>
      </div>
      
    </main>
  );
}