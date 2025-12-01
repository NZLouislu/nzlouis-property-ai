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
    // 检查 properties 表是否存在
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
      `) // 只选择前端列表页需要的字段，移除不必要的字段以优化性能
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

    // Execute query
    const { data, error } = await query;
    console.log("Query result:", { dataLength: data?.length, error });

    if (error) {
      console.error("Supabase query error:", error);
      
      // 特殊处理数据库超时错误
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