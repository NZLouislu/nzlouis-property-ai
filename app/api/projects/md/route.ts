import { NextResponse } from "next/server";
import { syncMarkdownFilesToProject } from "../md-to-project";

export async function POST() {
  try {
    await syncMarkdownFilesToProject();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}