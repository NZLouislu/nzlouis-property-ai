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
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "9"), 50); // 限制最大页面大小为50
  const suburbs = searchParams.get("suburbs")?.split(",") || [];

  // Return empty array if no city is specified
  if (!city) {
    return NextResponse.json([]);
  }

  try {
    console.log("Fetching properties for city:", city);

    // 限制最大记录数以防止超时
    const maxRecords = 500; // 减少最大记录数
    const start = page * pageSize;
    const end = Math.min(start + pageSize - 1, start + maxRecords - 1);

    // 使用优化的视图查询
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
        last_sold_price,
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
      `)
      .eq("city", city)
      .order("id") // 添加排序确保结果一致性
      .range(start, end);

    // Apply filter only when suburbs is not empty and does not contain empty string
    // Filter out any empty strings in the suburbs array
    const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
    
    if (filteredSuburbs.length > 0) {
      query = query.in("suburb", filteredSuburbs);
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