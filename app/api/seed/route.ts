import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

// ১. ডাটাবেস থেকে সব প্রোডাক্ট গেট করার জন্য
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 }); // নতুনগুলো আগে দেখাবে
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ২. ভবিষ্যতে নতুন কোনো প্রোডাক্ট যোগ করার জন্য (অপশনাল)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}