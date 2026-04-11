import { NextResponse } from "next/server";
import { runSeedBootstrap } from "@/lib/seedBootstrap";

export async function GET() {
  try {
    const summary = await runSeedBootstrap();
    return NextResponse.json({ ok: true, summary, message: "Bootstrap idempotent run." });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST() {
  try {
    const summary = await runSeedBootstrap();
    return NextResponse.json({ ok: true, summary }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
