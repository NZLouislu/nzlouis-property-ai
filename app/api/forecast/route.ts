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
    let query = supabase
      .from("properties_with_latest_status")
      .select(`
        property_url,
        last_sold_price,
        address,
        suburb,
        city,
        bedrooms,
        bathrooms,
        car_spaces,
        land_area,
        last_sold_date,
        cover_image_url,
        confidence_score,
        predicted_status
      `)
      .eq("city", city)
      .order("confidence_score", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    // Filter out any empty strings in the suburbs array
    const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
    
    if (filteredSuburbs.length > 0) {
      query = query.in("suburb", filteredSuburbs);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: `Failed to fetch forecast properties: ${error.message}` },
        { status: 500 }
      );
    }
    
    let finalData = data;

    // Fallback to 'properties' table if no data found in view
    if (!data || data.length === 0) {
      console.log(`[INFO] No forecast data for ${city}, falling back to properties table`);
      
      let fallbackQuery = supabase
        .from("properties")
        .select(`
          property_url,
          last_sold_price,
          address,
          suburb,
          city,
          bedrooms,
          bathrooms,
          car_spaces,
          land_area,
          last_sold_date,
          cover_image_url
        `)
        .eq("city", city)
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (filteredSuburbs.length > 0) {
        fallbackQuery = fallbackQuery.in("suburb", filteredSuburbs);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;

      if (fallbackError) {
        console.error("Fallback query error:", fallbackError);
        // Don't fail, just return empty list
      } else {
        finalData = fallbackData?.map(item => ({
          ...item,
          confidence_score: 0,
          predicted_status: 'Unknown'
        })) || [];
      }
    }
    
    console.log(`[DEBUG] Forecast query result: ${finalData?.length} rows found for city=${city}`);
    
    // Map data to include 'id' (using property_url as fallback) and 'region' (empty string)
    const mappedData = finalData?.map(item => ({
      ...item,
      id: item.property_url, // Use property_url as unique ID since 'id' column is missing
      region: '', // Region column is missing in view
      predicted_price: 0 // predicted_price is missing
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Error in fetchForecastProperties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}