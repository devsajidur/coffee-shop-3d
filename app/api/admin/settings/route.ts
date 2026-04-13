import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import StoreSettings from "@/models/StoreSettings";

export async function GET(request: Request) {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    let doc = await StoreSettings.findOne({ singletonKey: "blackstone" }).lean();
    if (!doc) {
      const created = await StoreSettings.create({
        singletonKey: "blackstone",
        autoPuzzleDiscountEnabled: false,
        puzzleWinnerPercent: 10,
        deliveryRadiusKm: 3,
        isEmergencyClosed: false,
        closedFrom: null,
        closedUntil: null,
        closureReason: "",
      });
      doc = created.toObject();
    }
    return NextResponse.json(doc);
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
    await connectToDatabase();

    // Build the $set patch — only include fields that were explicitly sent
    const patch: Record<string, unknown> = {};

    if (body.autoPuzzleDiscountEnabled != null) {
      patch.autoPuzzleDiscountEnabled = Boolean(body.autoPuzzleDiscountEnabled);
    }
    if (body.puzzleWinnerPercent != null) {
      patch.puzzleWinnerPercent = Number(body.puzzleWinnerPercent);
    }
    if (body.deliveryRadiusKm != null) {
      patch.deliveryRadiusKm = Math.min(
        50,
        Math.max(0.5, Number(body.deliveryRadiusKm) || 3)
      );
    }

    // ── Emergency / Scheduled Closure fields ──────────────────────────────
    if (body.isEmergencyClosed != null) {
      patch.isEmergencyClosed = Boolean(body.isEmergencyClosed);
    }
    if ("closedFrom" in body) {
      patch.closedFrom = body.closedFrom ? new Date(body.closedFrom) : null;
    }
    if ("closedUntil" in body) {
      patch.closedUntil = body.closedUntil ? new Date(body.closedUntil) : null;
    }
    if ("closureReason" in body) {
      patch.closureReason = String(body.closureReason ?? "").trim();
    }

    const updated = await StoreSettings.findOneAndUpdate(
      { singletonKey: "blackstone" },
      { $set: patch },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
