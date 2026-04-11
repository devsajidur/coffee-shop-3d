import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { isShopOpenAt } from "@/lib/shopHours";

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

    const body = await request.json();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    if (phone.length < 6 && email.length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid phone number or email for verification." },
        { status: 400 }
      );
    }

    const bookingId = `RSV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await Booking.create({
      customerName: body.customerName,
      phone,
      email,
      date: body.date,
      time: body.time,
      guests: body.guests ?? "Table booking",
      bookingId,
    });

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
