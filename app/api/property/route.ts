import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "9"), 50);
  const suburbs = searchParams.get("suburbs")?.split(",") || [];
  const search = searchParams.get("search");
  const exact = searchParams.get("exact") === "true";
  const propertyId = searchParams.get("id");

  console.log("API route called (Database Disabled):", { city, page, pageSize, suburbs, search, exact, propertyId });

  // Database is currently restricted/disabled
  return NextResponse.json([]);
}
