/** Start of the current calendar day in Asia/Dhaka (UTC+6, no DST). */
export function startOfTodayDhaka(now = new Date()): Date {
  const s = now.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
  return new Date(`${s}T00:00:00+06:00`);
}
