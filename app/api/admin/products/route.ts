import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import Product from "@/models/Product";

function makeProductId(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const safe = base.length > 0 ? base : "item";
  return `${safe}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePrice(price: unknown): string {
  if (typeof price === "number" && Number.isFinite(price)) {
    return `$${price.toFixed(2)}`;
  }
  const s = String(price ?? "").trim();
  if (!s) return "$0.00";
  return s.startsWith("$") ? s : `$${Number(s).toFixed(2)}`;
}

export async function GET() {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const list = await Product.find({}).sort({ createdAt: -1 }).lean();
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
    const name = String(body?.name ?? "").trim();
    const desc = String(body?.desc ?? "").trim();
    const type = String(body?.type ?? "").trim();
    const image = String(body?.image ?? "").trim();
    if (!name || !desc || !type || !image) {
      return NextResponse.json(
        { error: "name, desc, type, and image are required" },
        { status: 400 }
      );
    }
    if (image.length > 1_500_000) {
      return NextResponse.json({ error: "Image payload too large" }, { status: 400 });
    }
    await connectToDatabase();
    const id = makeProductId(name);
    const doc = await Product.create({
      id,
      name,
      desc,
      type,
      image,
      price: normalizePrice(body?.price),
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
    const id = body?.id;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await connectToDatabase();
    const $set: Record<string, unknown> = {};
    if (body.price != null) $set.price = normalizePrice(body.price);
    if (body.name != null) $set.name = String(body.name).trim();
    if (body.desc != null) $set.desc = String(body.desc).trim();
    if (body.type != null) $set.type = String(body.type).trim();
    if (body.image != null) {
      const img = String(body.image).trim();
      if (img.length > 1_500_000) {
        return NextResponse.json({ error: "Image payload too large" }, { status: 400 });
      }
      $set.image = img;
    }
    if (Object.keys($set).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }
    const updated = await Product.findOneAndUpdate(
      { id },
      { $set },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id query required" }, { status: 400 });
    }
    await connectToDatabase();
    const deleted = await Product.findOneAndDelete({ id }).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
