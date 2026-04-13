"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import { adminJson } from "../adminFetch";

type CouponRow = {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSpend: number;
  active: boolean;
};

type Settings = {
  autoPuzzleDiscountEnabled: boolean;
  puzzleWinnerPercent: number;
};

export default function AdminCouponsPage() {
  const [rows, setRows] = useState<CouponRow[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("10");
  const [minSpend, setMinSpend] = useState("0");

  const load = useCallback(async () => {
    const [c, s] = await Promise.all([
      adminJson<CouponRow[]>("/api/admin/coupons"),
      adminJson<Settings>("/api/admin/settings"),
    ]);
    setRows(c);
    setSettings({
      autoPuzzleDiscountEnabled: Boolean(s.autoPuzzleDiscountEnabled),
      puzzleWinnerPercent: Number(s.puzzleWinnerPercent) || 10,
    });
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminJson("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify({
        code,
        type,
        value: Number(value),
        minSpend: Number(minSpend),
      }),
    });
    setCode("");
    setValue("10");
    setMinSpend("0");
    load();
  };

  const toggleCoupon = async (row: CouponRow) => {
    await adminJson("/api/admin/coupons", {
      method: "PATCH",
      body: JSON.stringify({ code: row.code, active: !row.active }),
    });
    load();
  };

  const savePuzzle = async (patch: Partial<Settings>) => {
    await adminJson("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    load();
  };

  return (
    <div className="space-y-10 font-['Hind_Siliguri']">
      <div>
        <h1 className="text-3xl font-black text-white">Coupons & growth</h1>
        <p className="mt-1 text-sm text-white/45">
          প্রোমো কোড তৈরি করুন। পাজল উইনারদের জন্য অটো ডিসকাউন্ট চালু/বন্ধ।
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
        <div className="flex items-center gap-2 text-[#c48c5a]">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">Puzzle auto-discount</h2>
        </div>
        <p className="mt-2 text-xs text-white/45">
          স্টোরফ্রন্টে{" "}
          <code className="rounded bg-black/40 px-1 font-mono text-[10px]">
            localStorage.blackstone_puzzle_winner = &apos;1&apos;
          </code>{" "}
          থাকলে এবং এখানে চালু থাকলে ছাড় প্রয়োগ হবে।
        </p>
        {settings && (
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() =>
                savePuzzle({
                  autoPuzzleDiscountEnabled: !settings.autoPuzzleDiscountEnabled,
                })
              }
              className="flex items-center gap-2 text-sm font-bold text-white"
            >
              {settings.autoPuzzleDiscountEnabled ? (
                <ToggleRight className="h-10 w-10 text-emerald-400" />
              ) : (
                <ToggleLeft className="h-10 w-10 text-white/30" />
              )}
              {settings.autoPuzzleDiscountEnabled ? "Enabled" : "Disabled"}
            </button>
            <label className="text-xs text-white/50">
              Percent off subtotal
              <input
                type="number"
                className="mt-1 block w-24 rounded-lg border border-white/10 bg-black/40 px-2 py-1 font-[family-name:var(--font-geist-sans)] text-white"
                defaultValue={settings.puzzleWinnerPercent}
                onBlur={(e) =>
                  savePuzzle({ puzzleWinnerPercent: Number(e.target.value) || 10 })
                }
              />
            </label>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
        <h2 className="text-lg font-bold text-[#c48c5a]">New promo code</h2>
        <form onSubmit={createCoupon} className="mt-4 flex flex-wrap gap-3">
          <input
            placeholder="CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "percent" | "fixed")}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
          >
            <option value="percent">Percent</option>
            <option value="fixed">Fixed $</option>
          </select>
          <input
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-[family-name:var(--font-geist-sans)] text-sm text-white"
          />
          <input
            placeholder="Min spend"
            value={minSpend}
            onChange={(e) => setMinSpend(e.target.value)}
            className="w-28 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-[family-name:var(--font-geist-sans)] text-sm text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#c48c5a] px-5 py-2 text-xs font-bold uppercase text-black"
          >
            Create
          </button>
        </form>
      </section>

      <div className="space-y-2">
        {rows.map((r) => (
          <motion.div
            key={r._id}
            layout
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#100a08] px-4 py-3"
          >
            <div>
              <p className="font-mono font-bold text-[#c48c5a]">{r.code}</p>
              <p className="text-xs text-white/45 font-[family-name:var(--font-geist-sans)]">
                {r.type === "percent" ? `${r.value}%` : `$${r.value}`} · min $
                {r.minSpend}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleCoupon(r)}
              className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase ${
                r.active ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/40"
              }`}
            >
              {r.active ? "Active" : "Off"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
