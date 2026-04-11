import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { isShopOpenAt } from "@/lib/shopHours";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    if (!isShopOpenAt()) {
      return NextResponse.json(
        { error: "Shop is closed. Table booking is not available right now." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const bookingId = `RSV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await Booking.create({
      ...body,
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
