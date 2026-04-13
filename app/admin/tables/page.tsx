"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Printer, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { adminJson } from "../adminFetch";
import { FLOOR_TABLE_COUNT } from "@/lib/tableFloor";

type Cell = { tableNumber: string; occupied: boolean };

export default function AdminTablesPage() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [tableInput, setTableInput] = useState("1");
  const [dataUrl, setDataUrl] = useState("");
  const [origin, setOrigin] = useState("");

  const load = useCallback(async () => {
    const res = await adminJson<{ cells: Cell[] }>("/api/admin/tables");
    setCells(res.cells);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    setOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  const menuUrl =
    origin && tableInput.trim()
      ? `${origin}/menu?table=${encodeURIComponent(tableInput.trim())}`
      : "";

  useEffect(() => {
    if (!menuUrl) {
      setDataUrl("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(menuUrl, { margin: 2, width: 280, color: { dark: "#1a100cff" } }).then(
      (url) => {
        if (!cancelled) setDataUrl(url);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [menuUrl]);

  const printQr = () => {
    if (!dataUrl || !menuUrl) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Table ${tableInput}</title></head><body style="text-align:center;font-family:sans-serif;padding:24px;">
      <h2>Blackstone — Table ${tableInput}</h2>
      <img src="${dataUrl}" alt="QR" style="max-width:280px"/>
      <p style="font-size:12px;word-break:break-all;margin-top:16px">${menuUrl}</p>
      <script>window.onload=function(){window.print();}</script>
    </body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-10 font-['Hind_Siliguri']">
      <div>
        <h1 className="text-3xl font-black text-white">Digital floor</h1>
        <p className="mt-1 text-sm text-white/45">
          সবুজ = খালি, লাল = অ্যাক্টিভ অর্ডার (Served বাদ)।
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#c48c5a]">
          Table grid ({FLOOR_TABLE_COUNT})
        </h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {cells.map((c) => (
            <motion.div
              key={c.tableNumber}
              layout
              className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-black font-[family-name:var(--font-geist-sans)] tabular-nums ${
                c.occupied
                  ? "border-red-500/50 bg-red-950/40 text-red-200"
                  : "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
              }`}
            >
              {c.tableNumber}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0c0806] p-6">
        <div className="flex flex-wrap items-center gap-3">
          <QrCode className="h-6 w-6 text-[#c48c5a]" />
          <h2 className="text-lg font-bold text-white">QR engine</h2>
        </div>
        <p className="mt-2 text-xs text-white/45">
          টেবিল নম্বর দিন — URL:{" "}
          <span className="font-mono text-[#c48c5a]/90">/menu?table=N</span>
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <label className="text-xs text-white/50">
            Table #
            <input
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              className="mt-1 block w-32 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-[family-name:var(--font-geist-sans)] text-white"
            />
          </label>
          <button
            type="button"
            onClick={printQr}
            disabled={!dataUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c48c5a] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#e8c39e] disabled:opacity-40"
          >
            <Printer className="h-4 w-4" />
            Print QR
          </button>
        </div>
        {menuUrl && (
          <p className="mt-4 break-all text-[11px] text-white/40 font-mono">{menuUrl}</p>
        )}
        {dataUrl && (
          <div className="mt-6 inline-block rounded-2xl border border-white/10 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="QR preview" className="h-56 w-56" />
          </div>
        )}
      </section>
    </div>
  );
}
