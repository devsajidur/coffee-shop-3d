/**
 * Next.js 16+: `middleware.ts` is deprecated in favor of `proxy.ts` for this stack.
 * @see https://authjs.dev/getting-started/installation?framework=next.js
 *
 * Keeps Auth.js session fresh and enforces admin routes via `callbacks.authorized` in auth.ts.
 */
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
