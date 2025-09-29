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
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "9"), 50);
  const suburbs = searchParams.get("suburbs")?.split(",") || [];

  // Return empty array if no city is specified
  if (!city) {
    return NextResponse.json([]);
  }

  try {
    console.log("Fetching properties for city:", city);

    const maxRecords = 500;
    const start = page * pageSize;
    const end = Math.min(start + pageSize - 1, start + maxRecords - 1);

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
      .order("id")
      .range(start, end);

    // Apply filter only when suburbs is not empty and does not contain empty string
    // Filter out any empty strings in the suburbs array
    const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
    
    if (filteredSuburbs.length > 0) {
      query = query.in("suburb", filteredSuburbs);
    }

    // Log the approximate SQL query for debugging
    let sqlQuery = `SELECT id, property_url, last_sold_price, address, suburb, city, postcode, year_built, bedrooms, bathrooms, car_spaces, floor_size, land_area, last_sold_price, last_sold_date, capital_value, land_value, improvement_value, has_rental_history, is_currently_rented, status, property_history, normalized_address, created_at, region, cover_image_url FROM properties_view WHERE city = '${city}'`;
    
    if (filteredSuburbs.length > 0) {
      const suburbsList = filteredSuburbs.map(s => `'${s}'`).join(', ');
      sqlQuery += ` AND suburb IN (${suburbsList})`;
    }
    
    sqlQuery += ` ORDER BY id LIMIT ${end - start + 1} OFFSET ${start}`;
    
    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: `Failed to fetch properties: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in fetchPropertiesByCity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}