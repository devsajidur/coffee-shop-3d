import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    // ডাটাবেস কানেক্ট করা
    await connectToDatabase();

    // ফ্রন্টএন্ড থেকে আসা ডাটা পড়া
    const body = await request.json();

    // ডাটা ভ্যালিডেশন চেক (টার্মিনালে দেখার জন্য)
    console.log("Received Order Data:", body);

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty!" }, { status: 400 });
    }

    // ইউনিক অর্ডার আইডি জেনারেট করা
    const orderId = `BK-${Date.now()}`;

    // ডাটাবেসে অর্ডার সেভ করা
    const newOrder = await Order.create({
      orderId,
      customerName: body.customerName,
      email: body.email || "guest@blackstone.com",
      phone: body.phone,
      address: body.address,
      items: body.items,
      subTotal: body.subTotal,
      discount: body.discount,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod || "cod",
      status: "Pending"
    });

    console.log("Order Saved Successfully:", newOrder.orderId);

    return NextResponse.json(
      { message: "Order placed successfully!", order: newOrder },
      { status: 201 }
    );

  } catch (error: any) {
    // এররটি টার্মিনালে প্রিন্ট করা যাতে আপনি দেখতে পারেন
    console.error("CRITICAL ORDER ERROR:", error.message);
    
    return NextResponse.json(
      { error: "Server Error: Could not save order", details: error.message },
      { status: 500 }
    );
  }
}