import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    // ডাটাবেস কানেকশন চেক
    await connectToDatabase();

    // সব প্রোডাক্ট খুঁজে বের করা
    const products = await Product.find({}).sort({ createdAt: -1 });

    // যদি ডাটাবেস খালি থাকে তবুও একটি খালি অ্যারে পাঠানো যাতে এরর না হয়
    return NextResponse.json(products || [], { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Fetch Error:", error);
    // এরর হলেও JSON ফরম্যাটে এরর পাঠানো যাতে ফ্রন্টএন্ড ক্রাশ না করে
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message }, 
      { status: 500 }
    );
  }
}