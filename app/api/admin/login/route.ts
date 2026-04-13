import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body?.password ?? "");
    const adminPassword = process.env.ADMIN_PASSWORD;
    const apiKey = process.env.ADMIN_API_KEY;
    if (!adminPassword || !apiKey) {
      return NextResponse.json(
        {
          error:
            "Set ADMIN_PASSWORD and ADMIN_API_KEY in your environment to use the admin panel.",
        },
        { status: 500 }
      );
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ token: apiKey });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
