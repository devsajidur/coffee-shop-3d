"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { Lock } from "lucide-react";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const err = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/orders");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/40 text-sm font-['Hind_Siliguri']">
        সেশন চেক…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#120c09] p-10 shadow-2xl"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c48c5a]/15">
          <Lock className="h-7 w-7 text-[#c48c5a]" />
        </div>
        <h1 className="text-center font-black text-2xl text-white font-['Hind_Siliguri']">
          Blackstone Admin
        </h1>
        <p className="mt-2 text-center text-xs text-white/45">
          Sign in with the allowlisted Google account. Set{" "}
          <span className="font-mono text-white/70">AUTH_GOOGLE_ID</span>,{" "}
          <span className="font-mono text-white/70">AUTH_GOOGLE_SECRET</span>,{" "}
          <span className="font-mono text-white/70">AUTH_SECRET</span>, and{" "}
          <span className="font-mono text-white/70">ADMIN_ALLOWED_EMAIL</span> in{" "}
          <span className="font-mono">.env.local</span>.
        </p>
        {err && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200">
            Access denied — only the configured owner email may use this dashboard.
          </p>
        )}
        <button
          type="button"
          onClick={() =>
            signIn("google", { callbackUrl: "/admin/orders" })
          }
          className="mt-8 w-full rounded-xl bg-white py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#110804] hover:bg-white/90"
        >
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white/40 text-sm font-['Hind_Siliguri']">
          …
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
