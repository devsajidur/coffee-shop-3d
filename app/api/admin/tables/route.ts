import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import Order from "@/models/Order";
import { FLOOR_TABLE_COUNT } from "@/lib/tableFloor";

export async function GET(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const active = await Order.find({
      kitchenStatus: { $nin: ["Served"] },
    })
      .select("tableNumber kitchenStatus orderId createdAt")
      .lean();

    const occupied = new Set<string>();
    for (const o of active) {
      const t = String(o.tableNumber ?? "").trim();
      if (t) occupied.add(t);
    }

    const cells = Array.from({ length: FLOOR_TABLE_COUNT }, (_, i) => {
      const num = String(i + 1);
      return {
        tableNumber: num,
        occupied: occupied.has(num),
      };
    });

    return NextResponse.json({ cells, floorTableCount: FLOOR_TABLE_COUNT });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
