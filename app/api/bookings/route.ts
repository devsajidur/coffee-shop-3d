import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import StoreSettings from "@/models/StoreSettings";
import {
  isReservationDuringShopHours,
  parseBookingDateTime,
} from "@/lib/shopHours";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TZ = "Asia/Dhaka";
const NAME_RE = /^[\p{L}\p{M}\s'.-]+$/u;

function makeBookingId() {
  return `RSV-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isDuplicateKeyError(err: unknown): boolean {
  let cur: unknown = err;
  for (let i = 0; i < 4 && cur && typeof cur === "object"; i++) {
    const code = (cur as { code?: number }).code;
    if (code === 11000) return true;
    cur = (cur as { cause?: unknown }).cause;
  }
  return false;
}

/** Returns today's date string (YYYY-MM-DD) in Asia/Dhaka timezone. */
function getTodayDhaka(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Checks whether the shop is currently under an emergency or scheduled closure.
 * Returns a closure info object if closed, or null if the shop is operating normally.
 */
async function getShopClosureStatus(): Promise<{
  closed: boolean;
  reason: string;
  until: Date | null;
} | null> {
  const doc = await StoreSettings.findOne({ singletonKey: "blackstone" }).lean() as {
    isEmergencyClosed?: boolean;
    closedFrom?: Date | null;
    closedUntil?: Date | null;
    closureReason?: string;
  } | null;

  if (!doc) return null;

  const now = new Date();
  const reason = doc.closureReason || "Temporarily closed";

  // Hard emergency toggle
  if (doc.isEmergencyClosed) {
    return { closed: true, reason, until: doc.closedUntil ?? null };
  }

  // Scheduled window
  if (doc.closedFrom && doc.closedUntil) {
    const from = new Date(doc.closedFrom);
    const until = new Date(doc.closedUntil);
    if (now >= from && now <= until) {
      return { closed: true, reason, until };
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // ── 1. Shop closure check (emergency or scheduled) ──────────────────────
    const closure = await getShopClosureStatus();
    if (closure?.closed) {
      const untilStr = closure.until
        ? closure.until.toLocaleString("en-GB", {
            timeZone: TZ,
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "further notice";
      return NextResponse.json(
        {
          error: `We are temporarily closed until ${untilStr}. Reason: ${closure.reason}`,
          emergencyClosed: true,
        },
        { status: 503 }
      );
    }

    // ── 2. Parse & validate request body ────────────────────────────────────
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const customerName = String((body as { customerName?: unknown }).customerName ?? "").trim();
    const phone = String((body as { phone?: unknown }).phone ?? "").trim();
    const email = String((body as { email?: unknown }).email ?? "").trim();
    const date = String((body as { date?: unknown }).date ?? "").trim();
    const time = String((body as { time?: unknown }).time ?? "").trim();

    if (customerName.length < 2 || customerName.length > 80) {
      return NextResponse.json(
        { error: "Name must be between 2 and 80 characters." },
        { status: 400 }
      );
    }
    if (!NAME_RE.test(customerName)) {
      return NextResponse.json(
        { error: "Name may only include letters, spaces, apostrophes, periods, and hyphens." },
        { status: 400 }
      );
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

    // ── 3. Past-date validation (Asia/Dhaka) ────────────────────────────────
    const todayDhaka = getTodayDhaka();
    if (date < todayDhaka) {
      return NextResponse.json(
        { error: "You cannot book a table for a past date." },
        { status: 400 }
      );
    }

    // ── 4. Parse the booking datetime ───────────────────────────────────────
    const slot = parseBookingDateTime(date, time);
    if (!slot) {
      return NextResponse.json(
        {
          error:
            "Invalid date or time. Use date YYYY-MM-DD and 24-hour time HH:mm (Asia/Dhaka).",
        },
        { status: 400 }
      );
    }

    // For same-day bookings, ensure the slot is not already in the past
    const now = Date.now();
    if (slot.getTime() < now - 120_000) {
      return NextResponse.json(
        { error: "Reservation time must be in the future." },
        { status: 400 }
      );
    }

    // ── 5. Shop-hours validation for the chosen slot ─────────────────────────
    if (!isReservationDuringShopHours(date, time)) {
      return NextResponse.json(
        {
          error:
            "Reservations are only allowed during operating hours (Sat–Thu 8:00 AM–11:00 PM, Fri 3:00 PM–11:00 PM Asia/Dhaka) for the chosen day.",
        },
        { status: 403 }
      );
    }

    // ── 6. Create booking ────────────────────────────────────────────────────
    const guests = String((body as { guests?: unknown }).guests ?? "Table booking").trim();

    let newBooking;
    const maxAttempts = 12;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
        if (isDuplicateKeyError(err)) continue;
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
