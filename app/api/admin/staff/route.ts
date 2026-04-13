import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import Staff from "@/models/Staff";

export async function GET(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const list = await Staff.find({}).sort({ name: 1 }).lean();
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
    const doc = await Staff.create({
      name: body.name,
      role: body.role,
      phone: body.phone || "",
      active: body.active !== false,
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
    const id = body?._id;
    if (!id) return NextResponse.json({ error: "_id required" }, { status: 400 });
    await connectToDatabase();
    const updated = await Staff.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(body.name != null ? { name: body.name } : {}),
          ...(body.role != null ? { role: body.role } : {}),
          ...(body.phone != null ? { phone: body.phone } : {}),
          ...(body.active != null ? { active: Boolean(body.active) } : {}),
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
