import CoffeeScene from "./components/CoffeeScene";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-gold-500 mb-8 text-yellow-500">
        Blackstone Cafe 3D Experience
      </h1>
      
      {/* আমরা যে ৩ডি সিন বানালাম সেটা এখানে ডাকছি */}
      <div className="w-full max-w-4xl border border-yellow-900/30 rounded-2xl p-4 bg-zinc-900/50">
        <CoffeeScene />
      </div>

      <p className="mt-6 text-gray-400">
        মাউস দিয়ে কফি কাপটা ঘুরিয়ে দেখুন!
      </p>
    </main>
  );
}