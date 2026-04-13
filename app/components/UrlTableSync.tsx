"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function UrlTableSync() {
  const searchParams = useSearchParams();
  const { setTableId } = useCart();

  useEffect(() => {
    const raw = searchParams.get("table");
    const t = raw?.trim();
    setTableId(t && t.length > 0 ? t : null);
  }, [searchParams, setTableId]);

  return null;
}
