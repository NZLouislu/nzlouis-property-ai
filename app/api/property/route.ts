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
  const search = searchParams.get("search");
  const exact = searchParams.get("exact") === "true";
  const propertyId = searchParams.get("id");

  console.log("API route called with:", { city, page, pageSize, suburbs, search, exact, propertyId });

  // If searching by ID, we don't need city
  if (!propertyId && !exact && !city) {
    console.log("No city/ID provided and not exact search, returning empty array");
    return NextResponse.json([]);
  }

  try {
    const { error: tableCheckError } = await supabase.from('properties').select('id').limit(1);
    const tableName = tableCheckError ? 'properties_view' : 'properties';
    console.log(`Using table: ${tableName}`);

    // Build base query
    let query = supabase
      .from(tableName)
      .select(`
        id,
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
        region,
        cover_image_url
      `);

    // Priority 1: Search by ID (fastest and most reliable)
    if (propertyId) {
      console.log("🔍 Searching by property ID:", propertyId, "type:", typeof propertyId);
      // ID might be string (UUID) or number - don't use parseInt
      query = query.eq("id", propertyId);
    } else {
      // Priority 2: Apply city filter only if NOT doing exact address search
      if (!exact && city) {
        query = query.eq("city", city);
      }

      // Apply suburb filter if provided (and not doing exact search)
      if (!exact) {
        const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
        console.log("Filtered suburbs:", filteredSuburbs);
        
        if (filteredSuburbs.length > 0) {
          query = query.in("suburb", filteredSuburbs);
        }
      }

      // Apply search filter if provided
      if (search) {
        if (exact) {
          // For exact search, use the street address (part before first comma)
          const streetAddress = search.split(',')[0].trim();
          console.log("Using prefix match for exact search with:", streetAddress);
          query = query.ilike('address', `${streetAddress}%`).limit(1);
        } else {
          // Optimize: If search starts with a number, use prefix match
          if (/^\d/.test(search)) {
            query = query.ilike('address', `${search}%`);
          } else {
            query = query.ilike('address', `%${search}%`);
          }
        }
      }

      // Order by ID only if not doing exact search or ID search
      if (!exact && !propertyId) {
        query = query.order("id");
      }

      // Apply pagination using range
      const start = page * pageSize;
      const end = start + pageSize - 1;
      console.log("Pagination range:", { start, end });
      query = query.range(start, end);
    }

    // Execute query
    const { data, error } = await query;
    console.log("Query result:", { dataLength: data?.length, error, firstResult: data?.[0] });

    if (error) {
      console.error("Supabase query error:", error);
      
      if (error.code === '57014' || error.message.includes('statement timeout')) {
        return NextResponse.json(
          { 
            error: `Database query timeout. The dataset for "${city}" is very large. Please try:\n1. Select specific suburbs to narrow down the search\n2. The system will load a maximum of 2 pages (18 properties) to prevent timeouts`,
            code: 'TIMEOUT',
            suggestion: 'Use suburb filters to reduce data size'
          },
          { status: 500 }
        );
      }
      
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