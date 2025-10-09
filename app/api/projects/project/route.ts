import { NextResponse } from "next/server";
import { syncProjectItemsToMarkdown } from "../project-to-md";

export async function POST() {
  try {
    await syncProjectItemsToMarkdown();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}