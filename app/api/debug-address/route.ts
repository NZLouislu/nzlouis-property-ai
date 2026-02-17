import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("Debug Address API route called (Database Disabled)");

  return NextResponse.json({
    tableName: "disabled",
    count: 0,
    results: []
  });
}

