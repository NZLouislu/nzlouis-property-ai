import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "9"), 50);
  const suburbs = searchParams.get("suburbs")?.split(",") || [];

  console.log("API route called with:", { city, page, pageSize, suburbs });

  if (!city) {
    console.log("No city provided, returning empty array");
    return NextResponse.json([]);
  }

  try {
    // Build base query
    let query = supabase
      .from("properties_view")
      .select(`
        id,
        property_url,
        last_sold_price,
        address,
        suburb,
        city,
        postcode,
        year_built,
        bedrooms,
        bathrooms,
        car_spaces,
        floor_size,
        land_area,
        last_sold_date,
        capital_value,
        land_value,
        improvement_value,
        has_rental_history,
        is_currently_rented,
        status,
        property_history,
        normalized_address,
        created_at,
        region,
        cover_image_url
      `, { count: 'exact' }) // 添加 count: 'exact' 来获取准确的总数
      .eq("city", city)
      .order("id");

    // Apply suburb filter if provided
    const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
    console.log("Filtered suburbs:", filteredSuburbs);
    
    if (filteredSuburbs.length > 0) {
      query = query.in("suburb", filteredSuburbs);
    }

    // Apply pagination using range
    const start = page * pageSize;
    const end = start + pageSize - 1;
    console.log("Pagination range:", { start, end });
    query = query.range(start, end);

    // Execute query with timeout
    const { data, error, count } = await query;
    console.log("Query result:", { dataLength: data?.length, error, count });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: `Failed to fetch properties: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in fetchPropertiesByCity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}