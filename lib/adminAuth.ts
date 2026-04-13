import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseAllowedAdminEmails } from "@/lib/adminAllowlist";

export function getAdminUnauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Validates NextAuth session and allowlisted admin email. */
export async function assertAdminSession(): Promise<NextResponse | null> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return getAdminUnauthorizedResponse();
  }
  const allowed = parseAllowedAdminEmails();
  if (!allowed.length) {
    return NextResponse.json(
      { error: "Set ADMIN_ALLOWED_EMAIL (or ADMIN_ALLOWED_EMAILS) on the server." },
      { status: 500 }
    );
  }
  if (!allowed.includes(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
