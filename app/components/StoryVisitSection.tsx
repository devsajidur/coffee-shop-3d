"use client";

export default function StoryVisitSection() {
  return (
    <>
      {/* Story Section */}
      <section id="story" className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-20 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#c48c5a] text-xs lg:text-sm font-bold tracking-[0.3em] uppercase mb-4">Our Story</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-6">Born from Passion.</h3>
            <p className="text-white/60 font-['Hind_Siliguri'] leading-relaxed mb-6">
              ব্ল্যাকস্টোন কফির জন্ম শুধুমাত্র একটি কফি শপ হিসেবে নয়, বরং কফি প্রেমীদের জন্য একটি তীর্থস্থান হিসেবে। আমাদের প্রতিটি কফি বিন বিশ্বের সেরা ফার্মগুলো থেকে সাবধানে সংগ্রহ করা হয় এবং আমাদের নিজস্ব রোস্টারিতে নিখুঁতভাবে রোস্ট করা হয়। 
            </p>
            <p className="text-white/60 font-['Hind_Siliguri'] leading-relaxed">
              আমরা বিশ্বাস করি, এক কাপ ভালো কফি শুধু একটি পানীয় নয়, এটি একটি অভিজ্ঞতা। সেই অভিজ্ঞতা আপনাদের কাছে পৌঁছে দেওয়াই আমাদের মূল লক্ষ্য।
            </p>
          </div>
          <div className="relative h-[400px] rounded-[2rem] overflow-hidden border border-white/10">
            <img src="/assets/coffee-items/Espresso.png" alt="Our Story" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>
      </section>

      {/* Visit Section */}
      <section id="visit" className="bg-[#1a100c]/80 border-t border-b border-white/5 py-20 relative z-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-[#c48c5a] text-xs lg:text-sm font-bold tracking-[0.3em] uppercase mb-4">Visit Us</h2>
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-12">Experience Blackstone</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <h4 className="text-white font-bold text-lg mb-3">Location</h4>
              <p className="text-white/50 text-sm font-['Hind_Siliguri']">গুলশান এভিনিউ, রোড নং ১২<br />ঢাকা, বাংলাদেশ</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <h4 className="text-white font-bold text-lg mb-3">Opening Hours</h4>
              <p className="text-white/50 text-sm font-['Hind_Siliguri']">প্রতিদিন: সকাল ৮:০০ - রাত ১১:০০<br />শুক্রবার: বিকাল ৩:০০ - রাত ১১:০০</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <h4 className="text-white font-bold text-lg mb-3">Contact</h4>
              <p className="text-white/50 text-sm font-['Hind_Siliguri']">hello@blackstone.com<br />+880 1234 567 890</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}