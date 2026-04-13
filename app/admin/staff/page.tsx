"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { adminJson } from "../adminFetch";

type StaffRow = {
  _id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
};

export default function AdminStaffPage() {
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const load = useCallback(async () => {
    const data = await adminJson<StaffRow[]>("/api/admin/staff");
    setRows(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    await adminJson("/api/admin/staff", {
      method: "POST",
      body: JSON.stringify({ name, role, phone }),
    });
    setName("");
    setRole("");
    setPhone("");
    load();
  };

  const toggle = async (row: StaffRow) => {
    await adminJson("/api/admin/staff", {
      method: "PATCH",
      body: JSON.stringify({ _id: row._id, active: !row.active }),
    });
    load();
  };

  return (
    <div className="space-y-8 font-['Hind_Siliguri']">
      <div>
        <h1 className="text-3xl font-black text-white">Staff</h1>
        <p className="mt-1 text-sm text-white/45">টিম মেম্বার যোগ ও স্ট্যাটাস টগল।</p>
      </div>

      <form
        onSubmit={add}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-[#0c0806] p-5"
      >
        <UserPlus className="h-5 w-5 text-[#c48c5a]" />
        <input
          placeholder="নাম"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-[140px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="রোল"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="min-w-[120px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="ফোন"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="min-w-[120px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white font-[family-name:var(--font-geist-sans)]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#c48c5a] px-5 py-2 text-xs font-bold uppercase text-black"
        >
          Add
        </button>
      </form>

      <div className="space-y-3">
        {rows.map((r) => (
          <motion.div
            key={r._id}
            layout
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#100a08] px-4 py-3"
          >
            <div>
              <p className="font-bold text-white">{r.name}</p>
              <p className="text-xs text-white/45">
                {r.role}{" "}
                {r.phone && (
                  <span className="font-[family-name:var(--font-geist-sans)] text-white/60">
                    · {r.phone}
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle(r)}
              className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase ${
                r.active
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {r.active ? "Active" : "Inactive"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
