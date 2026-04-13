import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StoreSettings from "@/models/StoreSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const doc = await StoreSettings.findOne({ singletonKey: "blackstone" }).lean() as {
      autoPuzzleDiscountEnabled?: boolean;
      puzzleWinnerPercent?: number;
      deliveryRadiusKm?: number;
      isEmergencyClosed?: boolean;
      closedFrom?: Date | null;
      closedUntil?: Date | null;
      closureReason?: string;
    } | null;

    const now = new Date();
    let isSystemClosed = false;
    let closureReason = "";
    let closedUntil: string | null = null;

    if (doc) {
      if (doc.isEmergencyClosed) {
        isSystemClosed = true;
        closureReason = doc.closureReason || "Temporarily closed";
        closedUntil = doc.closedUntil ? doc.closedUntil.toISOString() : null;
      } else if (doc.closedFrom && doc.closedUntil) {
        const from = new Date(doc.closedFrom);
        const until = new Date(doc.closedUntil);
        if (now >= from && now <= until) {
          isSystemClosed = true;
          closureReason = doc.closureReason || "Temporarily closed";
          closedUntil = until.toISOString();
        }
      }
    }

    return NextResponse.json({
      autoPuzzleDiscountEnabled: doc?.autoPuzzleDiscountEnabled ?? false,
      puzzleWinnerPercent: doc?.puzzleWinnerPercent ?? 10,
      deliveryRadiusKm: doc?.deliveryRadiusKm ?? 3,
      isSystemClosed,
      closureReason,
      closedUntil,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("GET /api/settings/public:", message);
    return NextResponse.json({
      autoPuzzleDiscountEnabled: false,
      puzzleWinnerPercent: 10,
      deliveryRadiusKm: 3,
      isSystemClosed: false,
      closureReason: "",
      closedUntil: null,
    });
  }
}
