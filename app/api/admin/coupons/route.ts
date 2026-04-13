import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import Coupon from "@/models/Coupon";

export async function GET(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const list = await Coupon.find({}).sort({ code: 1 }).lean();
    return NextResponse.json(list);
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
    const doc = await Coupon.create({
      code: String(body.code).toUpperCase().trim(),
      type: body.type === "fixed" ? "fixed" : "percent",
      value: Number(body.value),
      minSpend: Number(body.minSpend) || 0,
      active: body.active !== false,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
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
    const code = String(body?.code ?? "").toUpperCase().trim();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    await connectToDatabase();
    const updated = await Coupon.findOneAndUpdate(
      { code },
      {
        $set: {
          ...(body.type != null
            ? { type: body.type === "fixed" ? "fixed" : "percent" }
            : {}),
          ...(body.value != null ? { value: Number(body.value) } : {}),
          ...(body.minSpend != null ? { minSpend: Number(body.minSpend) } : {}),
          ...(body.active != null ? { active: Boolean(body.active) } : {}),
          ...(body.expiresAt !== undefined
            ? {
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
              }
            : {}),
        },
      },
      { new: true }
    ).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
