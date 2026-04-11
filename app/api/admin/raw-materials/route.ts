import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import RawMaterial from "@/models/RawMaterial";

export async function GET() {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const list = await RawMaterial.find({}).sort({ name: 1 }).lean();
    return NextResponse.json(list);
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
    const key = String(body?.key ?? "").trim();
    if (!key) {
      return NextResponse.json({ error: "key required" }, { status: 400 });
    }
    await connectToDatabase();
    const updated = await RawMaterial.findOneAndUpdate(
      { key },
      {
        $set: {
          ...(body.stockLevel != null
            ? { stockLevel: Math.max(0, Number(body.stockLevel)) }
            : {}),
          ...(body.unit != null ? { unit: String(body.unit).trim() } : {}),
          ...(body.name != null ? { name: String(body.name).trim() } : {}),
        },
      },
      { new: true, upsert: false }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Raw material not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
