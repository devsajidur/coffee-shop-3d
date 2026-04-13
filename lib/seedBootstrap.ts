import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryItem from "@/models/InventoryItem";
import Coupon from "@/models/Coupon";
import Staff from "@/models/Staff";
import StoreSettings from "@/models/StoreSettings";
import RawMaterial from "@/models/RawMaterial";

const DEFAULT_PRODUCTS = [
  {
    id: "espresso",
    name: "Classic Espresso",
    desc: "Bold single-origin shot.",
    price: "$3.00",
    type: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    desc: "Silky foam, double shot.",
    price: "$4.50",
    type: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1572442388796-11648a67e4a9?w=600",
  },
  {
    id: "iced-americano",
    name: "Iced Americano",
    desc: "Chilled clarity.",
    price: "$4.00",
    type: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  },
];

const DEFAULT_INVENTORY = [
  { name: "Arabica Beans", sku: "BEAN-AR", unit: "kg", currentStock: 8, capacity: 100 },
  { name: "Whole Milk", sku: "MILK-W", unit: "L", currentStock: 45, capacity: 50 },
  { name: "Oat Milk", sku: "MILK-O", unit: "L", currentStock: 4, capacity: 40 },
  { name: "Vanilla Syrup", sku: "SYR-V", unit: "L", currentStock: 12, capacity: 20 },
  { name: "Cups (8oz)", sku: "CUP-8", unit: "pcs", currentStock: 900, capacity: 1000 },
];

export async function runSeedBootstrap() {
  await connectToDatabase();

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(DEFAULT_PRODUCTS);
  }

  const invCount = await InventoryItem.countDocuments();
  if (invCount === 0) {
    await InventoryItem.insertMany(DEFAULT_INVENTORY);
  }

  await StoreSettings.findOneAndUpdate(
    { singletonKey: "blackstone" },
    {
      $setOnInsert: {
        singletonKey: "blackstone",
        autoPuzzleDiscountEnabled: false,
        puzzleWinnerPercent: 10,
        deliveryRadiusKm: 3,
      },
    },
    { upsert: true }
  );

  await StoreSettings.updateOne(
    { singletonKey: "blackstone", deliveryRadiusKm: { $exists: false } },
    { $set: { deliveryRadiusKm: 3 } }
  );

  const rawSeeds = [
    { key: "beans", name: "Coffee Beans", stockLevel: 8, unit: "kg" },
    { key: "milk", name: "Milk", stockLevel: 45, unit: "L" },
    { key: "sugar", name: "Sugar", stockLevel: 12, unit: "kg" },
  ];
  for (const r of rawSeeds) {
    await RawMaterial.findOneAndUpdate(
      { key: r.key },
      { $setOnInsert: { ...r } },
      { upsert: true }
    );
  }

  const codes = ["COFFEE20", "FLAT5"];
  for (const code of codes) {
    const exists = await Coupon.findOne({ code });
    if (!exists) {
      if (code === "COFFEE20") {
        await Coupon.create({
          code,
          type: "percent",
          value: 20,
          minSpend: 30,
          active: true,
        });
      } else {
        await Coupon.create({
          code,
          type: "fixed",
          value: 5,
          minSpend: 20,
          active: true,
        });
      }
    }
  }

  const staffCount = await Staff.countDocuments();
  if (staffCount === 0) {
    await Staff.insertMany([
      { name: "রাহাত হোসেন", role: "Head Barista", phone: "+8801XXXXXXXXX", active: true },
      { name: "সুমাইয়া আক্তার", role: "Floor Lead", phone: "+8801XXXXXXXXX", active: true },
    ]);
  }

  return {
    products: await Product.countDocuments(),
    inventory: await InventoryItem.countDocuments(),
    rawMaterials: await RawMaterial.countDocuments(),
    coupons: await Coupon.countDocuments(),
    staff: await Staff.countDocuments(),
  };
}
