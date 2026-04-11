/** Emails allowed to sign into the admin dashboard (lowercase). */
export function parseAllowedAdminEmails(): string[] {
  const out = new Set<string>();
  const single = process.env.ADMIN_ALLOWED_EMAIL?.trim().toLowerCase();
  if (single) out.add(single);
  const list = process.env.ADMIN_ALLOWED_EMAILS ?? "";
  for (const part of list.split(/[,;\s]+/)) {
    const e = part.trim().toLowerCase();
    if (e) out.add(e);
  }
  return [...out];
}
