import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import redis from "@/src/services/redisClient";

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

  // Create cache key
  const cacheKey = `forecast:${city}:${page}:${pageSize}:${suburbs.sort().join(",")}`;
  
  try {
    // Try to get data from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached data for key:", cacheKey);
      return NextResponse.json(cachedData);
    }
  } catch (cacheError) {
    console.error("Cache read error:", cacheError);
  }

  try {
    let query = supabase
      .from("properties_with_latest_status")
      .select("*")
      .eq("city", city)
      .order("confidence_score", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    // Apply filter only when suburbs is not empty and does not contain empty string
    // Filter out any empty strings in the suburbs array
    const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
    
    if (filteredSuburbs.length > 0) {
      query = query.in("suburb", filteredSuburbs);
    }

    // Log the approximate SQL query for debugging
    let sqlQuery = `SELECT * FROM properties_with_latest_status WHERE city = '${city}'`;
    
    if (filteredSuburbs.length > 0) {
      const suburbsList = filteredSuburbs.map(s => `'${s}'`).join(', ');
      sqlQuery += ` AND suburb IN (${suburbsList})`;
    }
    
    sqlQuery += ` ORDER BY confidence_score DESC LIMIT ${pageSize} OFFSET ${page * pageSize}`;
    
    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: `Failed to fetch forecast properties: ${error.message}` },
        { status: 500 }
      );
    }

    // Cache the data for 24 hours
    try {
      await redis.setex(cacheKey, 24 * 60 * 60, data);
    } catch (cacheError) {
      console.error("Cache write error:", cacheError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in fetchForecastProperties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}