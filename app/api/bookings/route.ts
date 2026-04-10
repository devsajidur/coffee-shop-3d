import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(request: Request) {
  try {
    // ১. ডাটাবেস কানেক্ট করা
    await connectToDatabase();

    // ২. ফ্রন্টএন্ড থেকে আসা ডাটা পড়া
    const body = await request.json();

    // ৩. একটি ইউনিক বুকিং আইডি তৈরি করা (যেমন: RSV-1234)
    const bookingId = `RSV-${Math.floor(1000 + Math.random() * 9000)}`;

    // ৪. ডাটাবেসে সেভ করা
    const newBooking = await Booking.create({
      ...body,
      bookingId,
    });

    return NextResponse.json(
      { message: "Table booked successfully!", booking: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking API Error:", error);
    
    // এরর হলেও যেন JSON রিটার্ন করে, HTML নয়
    return NextResponse.json(
      { error: "Failed to book table", details: error.message },
      { status: 500 }
    );
  }
}