"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MenuRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get("table");
    const q = table?.trim()
      ? `?table=${encodeURIComponent(table.trim())}`
      : "";
    router.replace(`/${q}#menu`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#110804] text-[#c48c5a] font-['Hind_Siliguri']">
      <p className="animate-pulse text-sm uppercase tracking-[0.3em]">
        মেনুতে নিয়ে যাওয়া হচ্ছে…
      </p>
    </div>
  );
}

export default function MenuDeepLinkPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#110804] text-[#c48c5a]">
          …
        </div>
      }
    >
      <MenuRedirectInner />
    </Suspense>
  );
}
