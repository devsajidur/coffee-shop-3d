"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Pencil, Trash2, Power, Calendar } from "lucide-react";
import { adminJson } from "../adminFetch";

type Inv = {
  _id: string;
  name: string;
  sku: string;
  unit: string;
  currentStock: number;
  capacity: number;
};

type RawMat = {
  _id: string;
  key: string;
  name: string;
  stockLevel: number;
  unit: string;
};

type Product = {
  _id: string;
  id: string;
  name: string;
  desc: string;
  type: string;
  price: string;
  image: string;
};

type Settings = {
  deliveryRadiusKm?: number;
  isEmergencyClosed?: boolean;
  closedFrom?: string | null;
  closedUntil?: string | null;
  closureReason?: string;
};

/** Convert a UTC ISO string to a local-datetime-input value (YYYY-MM-DDTHH:mm) */
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    // Format as YYYY-MM-DDTHH:mm in Asia/Dhaka
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .format(d)
      .replace(" ", "T");
  } catch {
    return "";
  }
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<Inv[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMat[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryKm, setDeliveryKm] = useState("3");
  const [err, setErr] = useState("");

  // ── Store Status state ────────────────────────────────────────────────────
  const [isEmergencyClosed, setIsEmergencyClosed] = useState(false);
  const [closedFrom, setClosedFrom] = useState("");
  const [closedUntil, setClosedUntil] = useState("");
  const [closureReason, setClosureReason] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    desc: "",
    type: "Hot Coffee",
    price: "",
    image: "",
  });

  const load = useCallback(async () => {
    try {
      const [inv, raw, prod, settings] = await Promise.all([
        adminJson<Inv[]>("/api/admin/inventory"),
        adminJson<RawMat[]>("/api/admin/raw-materials"),
        adminJson<Product[]>("/api/admin/products"),
        adminJson<Settings>("/api/admin/settings"),
      ]);
      setInventory(inv);
      setRawMaterials(raw);
      setProducts(prod);
      if (settings?.deliveryRadiusKm != null) {
        setDeliveryKm(String(settings.deliveryRadiusKm));
      }
      setIsEmergencyClosed(Boolean(settings?.isEmergencyClosed));
      setClosedFrom(isoToLocalInput(settings?.closedFrom));
      setClosedUntil(isoToLocalInput(settings?.closedUntil));
      setClosureReason(settings?.closureReason ?? "");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Load failed");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveStock = async (row: Inv, val: string) => {
    const n = Number(val);
    if (Number.isNaN(n)) return;
    await adminJson("/api/admin/inventory", {
      method: "PATCH",
      body: JSON.stringify({ _id: row._id, currentStock: n }),
    });
    load();
  };

  const saveRaw = async (row: RawMat, val: string) => {
    const n = Number(val);
    if (Number.isNaN(n)) return;
    await adminJson("/api/admin/raw-materials", {
      method: "PATCH",
      body: JSON.stringify({ key: row.key, stockLevel: n }),
    });
    load();
  };

  const saveDeliveryRadius = async () => {
    const n = Number(deliveryKm);
    if (Number.isNaN(n)) return;
    await adminJson("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify({ deliveryRadiusKm: n }),
    });
    load();
  };

  /** Save all store-status fields in one PATCH */
  const saveStoreStatus = async () => {
    setStatusSaving(true);
    setStatusMsg("");
    try {
      // Convert local datetime-input values (Asia/Dhaka) to UTC ISO strings
      const toUtcIso = (localVal: string): string | null => {
        if (!localVal) return null;
        // datetime-local gives "YYYY-MM-DDTHH:mm" — treat as Dhaka time (+06:00)
        return new Date(`${localVal}:00+06:00`).toISOString();
      };

      await adminJson("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({
          isEmergencyClosed,
          closedFrom: toUtcIso(closedFrom),
          closedUntil: toUtcIso(closedUntil),
          closureReason: closureReason.trim(),
        }),
      });
      setStatusMsg("Store status saved successfully.");
      load();
    } catch (e: unknown) {
      setStatusMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setStatusSaving(false);
    }
  };

  const savePrice = async (id: string, val: string) => {
    const n = parseFloat(val.replace("$", ""));
    if (Number.isNaN(n)) return;
    await adminJson("/api/admin/products", {
      method: "PATCH",
      body: JSON.stringify({ id, price: n }),
    });
    load();
  };

  const saveProductField = async (
    id: string,
    patch: Partial<Pick<Product, "name" | "desc" | "type" | "image">>
  ) => {
    await adminJson("/api/admin/products", {
      method: "PATCH",
      body: JSON.stringify({ id, ...patch }),
    });
    load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(`Delete product ${id}?`)) return;
    await adminJson(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    load();
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.image.trim()) {
      setErr("Name and image are required.");
      return;
    }
    setErr("");
    try {
      await adminJson("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          name: newProduct.name.trim(),
          desc: newProduct.desc.trim() || newProduct.name.trim(),
          type: newProduct.type.trim() || "Other",
          price: newProduct.price || "0",
          image: newProduct.image.trim(),
        }),
      });
      setNewProduct({
        name: "",
        desc: "",
        type: "Hot Coffee",
        price: "",
        image: "",
      });
      load();
    } catch (er: unknown) {
      setErr(er instanceof Error ? er.message : "Create failed");
    }
  };

  return (
    <div className="space-y-10 font-['Hind_Siliguri']">
      <div>
        <h1 className="text-3xl font-black text-white">Inventory &amp; Menu</h1>
        <p className="mt-1 text-sm text-white/45">
          MongoDB-backed menu CRUD, raw materials, delivery radius, and kitchen stock.
        </p>
      </div>
      {err && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {err}
        </p>
      )}

      {/* ── Store Settings (delivery radius) ─────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-[#100a08] p-6">
        <h2 className="mb-3 text-lg font-bold text-[#c48c5a]">Store settings</h2>
        <p className="mb-4 text-xs text-white/40">
          Delivery geofence (km) is read by the public site from MongoDB — no redeploy needed.
        </p>
        <label className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          Delivery radius (km)
          <input
            type="number"
            step="0.1"
            min={0.5}
            max={50}
            value={deliveryKm}
            onChange={(e) => setDeliveryKm(e.target.value)}
            className="w-28 rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-[family-name:var(--font-geist-sans)] text-white"
          />
          <button
            type="button"
            onClick={() => void saveDeliveryRadius()}
            className="rounded-lg bg-[#c48c5a] px-4 py-1.5 text-xs font-bold uppercase text-black"
          >
            Save
          </button>
        </label>
      </section>

      {/* ── Store Status (Emergency / Scheduled Closure) ──────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-[#100a08] p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Power className="h-5 w-5 text-[#c48c5a]" />
          <h2 className="text-lg font-bold text-[#c48c5a]">Store Status</h2>
        </div>
        <p className="text-xs text-white/40 -mt-2">
          Toggle emergency closure or schedule a date range. When active, all ordering and
          booking is disabled and customers see a professional closure message.
        </p>

        {/* Emergency toggle */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-white">Emergency Close</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              Immediately disables all ordering &amp; booking system-wide.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEmergencyClosed((v) => !v)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              isEmergencyClosed ? "bg-red-500" : "bg-white/20"
            }`}
            aria-pressed={isEmergencyClosed}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                isEmergencyClosed ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {isEmergencyClosed && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
            ⚠️ Emergency closure is <strong>ON</strong>. The entire system is currently
            disabled for customers.
          </div>
        )}

        {/* Scheduled closure date range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white/70">
            <Calendar className="h-4 w-4" />
            Scheduled Closure Window (Asia/Dhaka)
          </div>
          <p className="text-[10px] text-white/35">
            The shop will automatically show as closed between these dates/times even if the
            emergency toggle is off.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-[10px] uppercase text-white/40">
              Closed From
              <input
                type="datetime-local"
                value={closedFrom}
                onChange={(e) => setClosedFrom(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 font-[family-name:var(--font-geist-sans)] text-sm text-white"
                style={{ colorScheme: "dark" }}
              />
            </label>
            <label className="text-[10px] uppercase text-white/40">
              Closed Until
              <input
                type="datetime-local"
                value={closedUntil}
                onChange={(e) => setClosedUntil(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 font-[family-name:var(--font-geist-sans)] text-sm text-white"
                style={{ colorScheme: "dark" }}
              />
            </label>
          </div>
          <label className="block text-[10px] uppercase text-white/40">
            Closure Reason (shown to customers)
            <input
              type="text"
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
              placeholder="e.g. Public holiday, maintenance, private event…"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>

        {statusMsg && (
          <p
            className={`text-xs ${
              statusMsg.includes("success") ? "text-green-400" : "text-red-300"
            }`}
          >
            {statusMsg}
          </p>
        )}

        <button
          type="button"
          onClick={() => void saveStoreStatus()}
          disabled={statusSaving}
          className="rounded-xl bg-[#c48c5a] px-6 py-2.5 text-xs font-bold uppercase text-black disabled:opacity-50"
        >
          {statusSaving ? "Saving…" : "Save Store Status"}
        </button>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[#c48c5a]">
          Supply chain — Beans / Milk / Sugar
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {rawMaterials.map((row) => (
            <div
              key={row._id}
              className="rounded-2xl border border-white/10 bg-[#100a08] p-5"
            >
              <p className="font-bold text-white">{row.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/35">
                {row.key} · {row.unit}
              </p>
              <p className="mt-3 font-[family-name:var(--font-geist-sans)] text-2xl font-black tabular-nums text-[#c48c5a]">
                {row.stockLevel}
              </p>
              <label className="mt-3 flex items-center gap-2 text-xs text-white/50">
                Update
                <input
                  type="number"
                  min={0}
                  defaultValue={row.stockLevel}
                  className="w-28 rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-[family-name:var(--font-geist-sans)] text-white"
                  onBlur={(e) => saveRaw(row, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[#c48c5a]">Add new product</h2>
        <form
          onSubmit={createProduct}
          className="grid gap-4 rounded-2xl border border-white/10 bg-[#100a08] p-6 md:grid-cols-2"
        >
          <input
            placeholder="Title"
            value={newProduct.name}
            onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Type"
            value={newProduct.type}
            onChange={(e) => setNewProduct((p) => ({ ...p, type: e.target.value }))}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
          <input
            placeholder="Price (e.g. 4.50 or $4.50)"
            value={newProduct.price}
            onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white font-[family-name:var(--font-geist-sans)]"
          />
          <textarea
            placeholder="Description"
            value={newProduct.desc}
            onChange={(e) => setNewProduct((p) => ({ ...p, desc: e.target.value }))}
            className="md:col-span-2 min-h-[72px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
          <textarea
            placeholder="Image URL or paste Base64 data URI"
            value={newProduct.image}
            onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))}
            className="md:col-span-2 min-h-[80px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white font-mono"
          />
          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-[#c48c5a] py-3 text-xs font-bold uppercase text-black"
          >
            Create in MongoDB
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[#c48c5a]">Menu products (CRUD)</h2>
        <div className="space-y-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border border-white/10 bg-[#100a08] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/35 font-mono">
                    {p.id}
                  </p>
                  <input
                    defaultValue={p.name}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== p.name) void saveProductField(p.id, { name: v });
                    }}
                    className="mt-1 w-full max-w-md rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-bold text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void deleteProduct(p.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-[10px] uppercase text-white/40">
                  Type
                  <input
                    defaultValue={p.type}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== p.type) void saveProductField(p.id, { type: v });
                    }}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-sm text-white"
                  />
                </label>
                <label className="text-[10px] uppercase text-white/40 flex items-end gap-2">
                  <span className="flex items-center gap-1">
                    <Pencil className="h-3 w-3" />
                    Price
                  </span>
                  <input
                    type="text"
                    defaultValue={p.price}
                    onBlur={(e) => savePrice(p.id, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-[family-name:var(--font-geist-sans)] text-[#c48c5a]"
                  />
                </label>
              </div>
              <textarea
                defaultValue={p.desc}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== p.desc) void saveProductField(p.id, { desc: v });
                }}
                className="min-h-[56px] w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs text-white"
              />
              <textarea
                defaultValue={p.image}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== p.image) void saveProductField(p.id, { image: v });
                }}
                className="min-h-[48px] w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-white font-mono"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[#c48c5a]">Kitchen &amp; packaging stock</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {inventory.map((row) => {
            const ratio = row.capacity ? row.currentStock / row.capacity : 1;
            const critical = ratio < 0.1;
            return (
              <motion.div
                key={row._id}
                animate={
                  critical
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(239,68,68,0.4)",
                          "0 0 24px 2px rgba(239,68,68,0.25)",
                          "0 0 0 0 rgba(239,68,68,0.4)",
                        ],
                      }
                    : {}
                }
                transition={
                  critical ? { repeat: Infinity, duration: 2 } : undefined
                }
                className={`rounded-2xl border p-5 ${
                  critical
                    ? "border-red-500/60 bg-red-950/20"
                    : "border-white/10 bg-[#100a08]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">{row.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/35">
                      {row.sku}
                    </p>
                  </div>
                  {critical && (
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
                  )}
                </div>
                <p className="mt-3 font-[family-name:var(--font-geist-sans)] text-2xl font-black tabular-nums text-[#c48c5a]">
                  {row.currentStock}
                  <span className="text-sm font-medium text-white/40">
                    {" "}
                    / {row.capacity} {row.unit}
                  </span>
                </p>
                <label className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  Update stock
                  <input
                    type="number"
                    defaultValue={row.currentStock}
                    className="w-28 rounded-lg border border-white/10 bg-black/30 px-2 py-1 font-[family-name:var(--font-geist-sans)] text-white"
                    onBlur={(e) => saveStock(row, e.target.value)}
                  />
                </label>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
