import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { isShopOpenAt } from "@/lib/shopHours";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    console.log("Received Order Data:", body);

    if (!isShopOpenAt()) {
      return NextResponse.json(
        { error: "Shop is closed. Ordering is not available right now." },
        { status: 403 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty!" }, { status: 400 });
    }

    const tableNumber = String(body.tableNumber ?? "").trim();
    if (!tableNumber) {
      return NextResponse.json(
        { error: "Table ID is required (scan the table QR or open the menu link)." },
        { status: 400 }
      );
    }

    const adults = Math.max(1, Math.floor(Number(body.adults) || 0));
    const children = Math.max(0, Math.floor(Number(body.children) || 0));

    const orderId = `BK-${Date.now()}`;

    const newOrder = await Order.create({
      orderId,
      customerName: body.customerName,
      email: body.email || "guest@blackstone.com",
      phone: body.phone,
      address: body.address,
      tableNumber,
      adults,
      children,
      peopleCount: adults + children,
      items: body.items,
      subTotal: body.subTotal,
      discount: body.discount ?? 0,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod || "cod",
      status: "Pending",
      kitchenStatus: "Pending",
    });

    console.log("Order Saved Successfully:", newOrder.orderId);

    return NextResponse.json(
      { message: "Order placed successfully!", order: newOrder },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("CRITICAL ORDER ERROR:", message);

    return NextResponse.json(
      { error: "Server Error: Could not save order", details: message },
      { status: 500 }
    );
  }
}
