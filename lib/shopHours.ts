/**
 * Operating hours in Asia/Dhaka.
 * Sat–Thu: 08:00–23:00 (last minute 22:59). Fri: 15:00–23:00.
 */
const TZ = "Asia/Dhaka";

type DhakaClock = { weekday: number; minutes: number };

/** 0=Sun … 6=Sat */
function getDhakaClock(d: Date): DhakaClock {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(d);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(
    parts.find((p) => p.type === "minute")?.value ?? "0",
    10
  );
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const key = wd.slice(0, 3) as keyof typeof map;
  return { weekday: map[key] ?? 0, minutes: hour * 60 + minute };
}

function openCloseMinutes(weekday: number): { open: number; close: number } {
  const isFri = weekday === 5;
  return {
    open: isFri ? 15 * 60 : 8 * 60,
    close: 23 * 60,
  };
}

export function isShopOpenAt(now = new Date()): boolean {
  const { weekday, minutes } = getDhakaClock(now);
  const { open, close } = openCloseMinutes(weekday);
  return minutes >= open && minutes < close;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** 24h clock, optional leading zero on hour */
const CLOCK = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function formatDhakaYMD(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Parse `date` (YYYY-MM-DD) + `time` (H:mm or HH:mm, 24h) as an instant in Asia/Dhaka.
 * Returns null if strings are malformed or the calendar date is invalid for that zone.
 */
export function parseBookingDateTime(dateStr: string, timeStr: string): Date | null {
  const dPart = dateStr.trim();
  const tPart = timeStr.trim();
  if (!ISO_DATE.test(dPart) || !CLOCK.test(tPart)) return null;
  const [, hh, mm] = tPart.match(CLOCK)!;
  const h = parseInt(hh, 10);
  const m = parseInt(mm, 10);
  const clock = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const instant = new Date(`${dPart}T${clock}:00+06:00`);
  if (Number.isNaN(instant.getTime())) return null;
  if (formatDhakaYMD(instant) !== dPart) return null;
  return instant;
}

/** Whether the requested reservation start falls inside that day's Dhaka opening window. */
export function isReservationDuringShopHours(dateStr: string, timeStr: string): boolean {
  const instant = parseBookingDateTime(dateStr, timeStr);
  if (!instant) return false;
  return isShopOpenAt(instant);
}

/**
 * Next instant when open state flips (open→close or close→open), 1-minute resolution.
 */
export function getNextShopBoundary(now = new Date()): {
  isOpen: boolean;
  boundary: Date;
} {
  const openNow = isShopOpenAt(now);
  for (let i = 1; i <= 48 * 60; i++) {
    const t = new Date(now.getTime() + i * 60_000);
    if (isShopOpenAt(t) !== openNow) {
      return { isOpen: openNow, boundary: t };
    }
  }
  return { isOpen: openNow, boundary: new Date(now.getTime() + 60_000) };
}

export function getShopHoursSnapshot(now = new Date()) {
  const isOpen = isShopOpenAt(now);
  const { boundary } = getNextShopBoundary(now);
  const msRemaining = Math.max(0, boundary.getTime() - now.getTime());
  return { isOpen, nextBoundary: boundary, msRemaining };
}

/**
 * Returns an array of "HH:mm" slot strings (every 30 min) that are valid
 * for the given YYYY-MM-DD date string according to shop operating hours.
 * Saturday–Thursday: 08:00–22:30 (last slot), Friday: 15:00–22:30.
 */
export function getTimeSlotsForDate(dateStr: string): string[] {
  // Determine weekday for the given date in Asia/Dhaka
  const instant = new Date(`${dateStr}T12:00:00+06:00`);
  if (Number.isNaN(instant.getTime())) return [];
  const { weekday } = getDhakaClock(instant);
  const { open, close } = openCloseMinutes(weekday);
  const slots: string[] = [];
  // Generate 30-minute slots from open to close-1 (last slot starts at close-30)
  for (let m = open; m < close; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}


