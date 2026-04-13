import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import Order, { KITCHEN_STATUSES, type KitchenStatus } from "@/models/Order";

export async function GET(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json(orders);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    const body = await request.json();
    const orderId = String(body?.orderId ?? "");
    const kitchenStatus = body?.kitchenStatus as KitchenStatus | undefined;
    if (!orderId || !kitchenStatus) {
      return NextResponse.json(
        { error: "orderId and kitchenStatus required" },
        { status: 400 }
      );
    }
    if (!KITCHEN_STATUSES.includes(kitchenStatus)) {
      return NextResponse.json({ error: "Invalid kitchenStatus" }, { status: 400 });
    }
    await connectToDatabase();
    const updated = await Order.findOneAndUpdate(
      { orderId },
      { $set: { kitchenStatus } },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
