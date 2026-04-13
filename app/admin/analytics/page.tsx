"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { adminJson } from "../adminFetch";

type Daily = { _id: string; revenue: number; orders: number };
type Top = { _id: string; qty: number; revenue: number };
type Peak = { _id: number; count: number };
type Summary = { revenue: number; orders: number };

export default function AdminAnalyticsPage() {
  const [daily, setDaily] = useState<Daily[]>([]);
  const [top, setTop] = useState<Top[]>([]);
  const [peak, setPeak] = useState<Peak[]>([]);
  const [summary, setSummary] = useState<{
    today: Summary;
    last7Days: Summary;
    last30Days: Summary;
  } | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await adminJson<{
          dailyRevenue: Daily[];
          topItems: Top[];
          peakHours: Peak[];
          revenueSummary: {
            today: Summary;
            last7Days: Summary;
            last30Days: Summary;
          };
        }>("/api/admin/analytics");
        setDaily(data.dailyRevenue || []);
        setTop(data.topItems || []);
        setPeak(data.peakHours || []);
        setSummary(data.revenueSummary ?? null);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Failed");
      }
    })();
  }, []);

  const fmt = (s: Summary | undefined) => ({
    revenue: Number(s?.revenue ?? 0).toFixed(2),
    orders: s?.orders ?? 0,
  });

  return (
    <div className="space-y-10 font-['Hind_Siliguri']">
      <div>
        <h1 className="text-3xl font-black text-white">Analytics</h1>
        <p className="mt-1 text-sm text-white/45">
          Revenue windows use Asia/Dhaka for &quot;today&quot;; 7d and 30d are rolling.
        </p>
      </div>
      {err && (
        <p className="text-sm text-red-300 border border-red-500/30 rounded-lg px-4 py-2">
          {err}
        </p>
      )}

      {summary && (
        <section className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["Today", summary.today],
              ["Last 7 days", summary.last7Days],
              ["Last 30 days", summary.last30Days],
            ] as const
          ).map(([label, s]) => {
            const v = fmt(s);
            return (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-[#0c0806] p-5 font-[family-name:var(--font-geist-sans)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c48c5a]">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-white">
                  ${v.revenue}
                </p>
                <p className="mt-1 text-xs text-white/40">{v.orders} orders</p>
              </div>
            );
          })}
        </section>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c48c5a]">
          Daily revenue
        </h2>
        <div className="h-72 w-full font-[family-name:var(--font-geist-sans)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c48c5a" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#c48c5a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="_id" stroke="#888" tick={{ fontSize: 10 }} />
              <YAxis stroke="#888" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#1a100c",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c48c5a"
                fillOpacity={1}
                fill="url(#rev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c48c5a]">
            Top 5 selling items
          </h2>
          <div className="h-72 font-[family-name:var(--font-geist-sans)]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#888" />
                <YAxis
                  type="category"
                  dataKey="_id"
                  width={100}
                  stroke="#888"
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a100c",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="qty" fill="#c48c5a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c48c5a]">
            Peak traffic hours
          </h2>
          <div className="h-72 font-[family-name:var(--font-geist-sans)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peak}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="_id"
                  stroke="#888"
                  tick={{ fontSize: 10 }}
                  label={{ value: "Hour", fill: "#666", fontSize: 10 }}
                />
                <YAxis stroke="#888" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a100c",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7cb8ff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#7cb8ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
