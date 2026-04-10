import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const data = await Product.find({}); 
    return NextResponse.json({ total: data.length, products: data });
  } catch (error) {
    return NextResponse.json({ error: "Check failed" });
  }
}