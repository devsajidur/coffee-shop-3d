import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { assertAdminSession } from "@/lib/adminAuth";
import Order from "@/models/Order";
import { startOfTodayDhaka } from "@/lib/dhakaDay";

export async function GET() {
  const denied = await assertAdminSession();
  if (denied) return denied;
  try {
    await connectToDatabase();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const startToday = startOfTodayDhaka();
    const endToday = new Date(startToday.getTime() + 86_400_000);
    const weekAgo = new Date(Date.now() - 7 * 86_400_000);
    const monthAgo = new Date(Date.now() - 30 * 86_400_000);

    const sumWindow = (from: Date, to?: Date) =>
      Order.aggregate([
        {
          $match: {
            createdAt: to ? { $gte: from, $lt: to } : { $gte: from },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
      ]);

    const [todayAgg, weekAgg, monthAgg] = await Promise.all([
      sumWindow(startToday, endToday),
      sumWindow(weekAgo),
      sumWindow(monthAgo),
    ]);

    const pick = (a: { revenue?: number; orders?: number }[]) => ({
      revenue: Number(a[0]?.revenue ?? 0),
      orders: Number(a[0]?.orders ?? 0),
    });

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Dhaka",
            },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topItems = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          qty: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
    ]);

    const peakHours = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $hour: { date: "$createdAt", timezone: "Asia/Dhaka" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      dailyRevenue,
      topItems,
      peakHours,
      revenueSummary: {
        today: pick(todayAgg),
        last7Days: pick(weekAgg),
        last30Days: pick(monthAgg),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
