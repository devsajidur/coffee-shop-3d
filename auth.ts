import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { parseAllowedAdminEmails } from "@/lib/adminAllowlist";

const googleClientId = process.env.AUTH_GOOGLE_ID ?? "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    /**
     * Used by `proxy.ts` (Next.js 16+). `/admin` = login (public). `/admin/*` requires a session.
     */
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
      if (pathname === "/admin") return true;
      if (pathname.startsWith("/admin/")) {
        return !!auth?.user;
      }
      return true;
    },
    async signIn({ profile }) {
      const email = profile?.email?.toLowerCase?.();
      if (!email) return false;
      const allowed = parseAllowedAdminEmails();
      if (!allowed.length) return false;
      return allowed.includes(email);
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
});
