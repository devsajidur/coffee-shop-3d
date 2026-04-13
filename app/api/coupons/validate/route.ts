import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

type Legacy = { ok: boolean; discount: number; message: string };

function legacyValidate(
  code: string,
  subTotal: number
): Legacy | null {
  if (code === "COFFEE20") {
    if (subTotal >= 30) {
      return {
        ok: true,
        discount: subTotal * 0.2,
        message: "20% Discount Applied!",
      };
    }
    return {
      ok: false,
      discount: 0,
      message: `Add $${(30 - subTotal).toFixed(2)} more to use this code.`,
    };
  }
  if (code === "FLAT5") {
    if (subTotal >= 20) {
      return { ok: true, discount: 5, message: "$5 Flat Discount Applied!" };
    }
    return {
      ok: false,
      discount: 0,
      message: "Minimum order $20 required for this code.",
    };
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = String(body?.code ?? "").toUpperCase().trim();
    const subTotal = Number(body?.subTotal) || 0;
    if (!raw) {
      return NextResponse.json(
        { ok: false, discount: 0, message: "Enter a code." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const dbCoupon = await Coupon.findOne({ code: raw }).lean();

    if (dbCoupon) {
      if (!dbCoupon.active) {
        return NextResponse.json({
          ok: false,
          discount: 0,
          message: "This promo code is inactive.",
        });
      }
      if (dbCoupon.expiresAt && new Date(dbCoupon.expiresAt) < new Date()) {
        return NextResponse.json({
          ok: false,
          discount: 0,
          message: "This promo code has expired.",
        });
      }
      if (subTotal < (dbCoupon.minSpend || 0)) {
        return NextResponse.json({
          ok: false,
          discount: 0,
          message: `Minimum spend $${Number(dbCoupon.minSpend).toFixed(2)} required.`,
        });
      }
      let discount = 0;
      if (dbCoupon.type === "percent") {
        discount = subTotal * (Number(dbCoupon.value) / 100);
      } else {
        discount = Math.min(Number(dbCoupon.value), subTotal);
      }
      return NextResponse.json({
        ok: true,
        discount,
        message: "Promo applied!",
        code: raw,
        source: "db",
      });
    }

    const leg = legacyValidate(raw, subTotal);
    if (leg) {
      return NextResponse.json({
        ok: leg.ok,
        discount: leg.discount,
        message: leg.message,
        code: raw,
        source: "legacy",
      });
    }

    return NextResponse.json({
      ok: false,
      discount: 0,
      message: "Invalid or expired coupon code.",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, discount: 0, message: msg }, { status: 500 });
  }
}
