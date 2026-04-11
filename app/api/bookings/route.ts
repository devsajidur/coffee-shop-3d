import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { isShopOpenAt } from "@/lib/shopHours";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeBookingId() {
  return `RSV-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    if (!isShopOpenAt()) {
      return NextResponse.json(
        {
          error:
            "Table booking is only available during operating hours (Sat–Thu 8:00 AM–11:00 PM, Fri 3:00 PM–11:00 PM Asia/Dhaka).",
        },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const customerName = String((body as { customerName?: unknown }).customerName ?? "").trim();
    const phone = String((body as { phone?: unknown }).phone ?? "").trim();
    const email = String((body as { email?: unknown }).email ?? "").trim();
    const date = String((body as { date?: unknown }).date ?? "").trim();
    const time = String((body as { time?: unknown }).time ?? "").trim();

    if (!customerName) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (phone.length < 6 && email.length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid phone number or email for verification." },
        { status: 400 }
      );
    }
    if (!date || !time) {
      return NextResponse.json({ error: "Date and time are required." }, { status: 400 });
    }

    const guests = String((body as { guests?: unknown }).guests ?? "Table booking").trim();

    let newBooking;
    for (let attempt = 0; attempt < 5; attempt++) {
      const bookingId = makeBookingId();
      try {
        newBooking = await Booking.create({
          customerName,
          phone,
          email,
          date,
          time,
          guests,
          bookingId,
        });
        break;
      } catch (err: unknown) {
        const code = (err as { code?: number })?.code;
        if (code === 11000) continue;
        throw err;
      }
    }

    if (!newBooking) {
      return NextResponse.json(
        { error: "Could not allocate a unique booking id. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Table booked successfully!", booking: newBooking },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Booking API Error:", message);

    return NextResponse.json(
      { error: "Failed to book table", details: message },
      { status: 500 }
    );
  }
}
