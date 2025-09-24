import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase client (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "9");
  const suburbs = searchParams.get("suburbs")?.split(",") || [];

  try {
    console.log("Fetching properties for city:", city);

    let query = supabase
      .from("properties_with_latest_status")
      .select("*")
      .eq("city", city)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    // Apply filter only when suburbs is not empty and does not contain empty string
    if (suburbs.length > 0 && suburbs[0] !== "") {
      query = query.in("suburb", suburbs);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: `Failed to fetch properties: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Fetched properties count:", data?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in fetchPropertiesByCity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
