import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import InventoryItem from "@/models/InventoryItem";

export async function GET(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const items = await InventoryItem.find({}).sort({ name: 1 }).lean();
    return NextResponse.json(items);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    const body = await request.json();
    await connectToDatabase();
    const doc = await InventoryItem.create({
      name: body.name,
      sku: String(body.sku).toUpperCase(),
      unit: body.unit || "kg",
      currentStock: Number(body.currentStock) || 0,
      capacity: Number(body.capacity) || 100,
    });
    return NextResponse.json(doc, { status: 201 });
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
    const id = body?._id ?? body?.id;
    if (!id) {
      return NextResponse.json({ error: "_id required" }, { status: 400 });
    }
    await connectToDatabase();
    const updated = await InventoryItem.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(body.name != null ? { name: body.name } : {}),
          ...(body.currentStock != null
            ? { currentStock: Number(body.currentStock) }
            : {}),
          ...(body.capacity != null ? { capacity: Number(body.capacity) } : {}),
          ...(body.unit != null ? { unit: body.unit } : {}),
        },
      },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
