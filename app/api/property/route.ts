import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import redis from "@/src/services/redisClient";

// Supabase client (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// 添加清除缓存的函数用于测试
async function clearPropertyCache(pattern?: string) {
  try {
    if (!pattern) {
      // 默认清除所有 properties 相关的缓存
      pattern = "properties:*";
    }
    
    // 对于开发和测试环境，提供一个简单的方法来清除所有缓存
    if (pattern === "properties:*" || pattern === "*") {
      await redis.flushall();
      return { success: true, message: "All Redis cache cleared" };
    }
    
    // 注意：Upstash Redis 不支持 KEYS 命令，所以我们不能直接删除匹配模式的所有键
    // 在实际应用中，你可能需要维护一个键名列表或者使用其他策略
    
    return { success: true, message: `Cache clearing for pattern '${pattern}' would require a more sophisticated key management system` };
  } catch (error) {
    console.error("Error clearing cache:", error);
    return { success: false, error: "Failed to clear cache" };
  }
}

// 添加 POST 方法用于处理缓存清除请求
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, pattern } = body;
    
    if (action === "clear-cache") {
      const result = await clearPropertyCache(pattern);
      return NextResponse.json(result);
    }
    
    // 添加一个专门用于清除所有缓存的 action
    if (action === "flush-all-cache") {
      try {
        await redis.flushall();
        return NextResponse.json({ success: true, message: "All cache cleared successfully" });
      } catch (error) {
        console.error("Error flushing cache:", error);
        return NextResponse.json({ success: false, error: "Failed to clear cache" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "9"), 50);
  const suburbs = searchParams.get("suburbs")?.split(",") || [];

  // Return empty array if no city is specified
  if (!city) {
    return NextResponse.json({ data: [], hasMore: false, total: 0 });
  }

  // Filter out empty suburbs
  const filteredSuburbs = suburbs.filter((suburb) => suburb.trim() !== "");
  
  // Create cache key - properly handle empty suburbs case
  const suburbsPart = filteredSuburbs.length > 0 
    ? filteredSuburbs.sort().join(",") 
    : "all";

  const CACHE_VERSION = "v4";
  const cacheKey = `properties:${CACHE_VERSION}:${city}:${page}:${pageSize}:${suburbsPart}`;
  
  try {
    // Try to get data from cache
    const cachedData = await redis.get(cacheKey);
    // Only accept cache if it matches new response shape
    if (
      cachedData &&
      typeof cachedData === "object" &&
      "data" in (cachedData as any) &&
      "hasMore" in (cachedData as any) &&
      "total" in (cachedData as any) &&
      "page" in (cachedData as any) &&
      "pageSize" in (cachedData as any)
    ) {
      console.log("Returning cached data for key:", cacheKey);
      return NextResponse.json(cachedData as any);
    }
    if (cachedData) {
      console.warn("Cached data shape outdated, ignoring and refetching:", cacheKey);
    }
  } catch (cacheError) {
    console.error("Cache read error:", cacheError);
  }

  try {
    console.log("Fetching properties for city:", city, "page:", page, "suburbs:", filteredSuburbs);

    const maxRecords = 500;
    const start = page * pageSize;
    const end = Math.min(start + pageSize - 1, start + maxRecords - 1);

    // Build base query for data
    let dataQuery = supabase
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

    // Build count query
    let countQuery = supabase
      .from("properties_view")
      .select("id", { count: "exact", head: true })
      .eq("city", city);
    
    // Apply suburb filter to both queries
    if (filteredSuburbs.length > 0) {
      dataQuery = dataQuery.in("suburb", filteredSuburbs);
      countQuery = countQuery.in("suburb", filteredSuburbs);
    }

    // Execute both queries
    const [dataResult, countResult] = await Promise.all([
      dataQuery,
      countQuery
    ]);
    
    const { data, error } = dataResult;
    const { count, error: countError } = countResult;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: `Failed to fetch properties: ${error.message}` },
        { status: 500 }
      );
    }

    if (countError) {
      console.error("Supabase count error:", countError);
    }

    // 修复 count 为 null 的情况
    // 如果 count 为 null，我们使用一种更保守的方法来确定是否有更多数据
    const total = count !== null ? count : 0;
    // 如果我们获取到了最大数量的数据，则认为可能还有更多数据
    const hasMore = count !== null 
      ? (start + pageSize) < total
      : data && data.length === pageSize;

    console.log(`Raw data length: ${data ? data.length : 0}, total count: ${total}, hasMore: ${hasMore}`);
    if (data && data.length > 0) {
      console.log("Sample property:", JSON.stringify(data[0], null, 2));
    }
  
    const response = {
      data: data || [],
      hasMore,
      total,
      page,
      pageSize
    };

    // Cache the response for 1 hour to balance freshness and performance
    try {
      await redis.setex(cacheKey, 60 * 60, response);
    } catch (cacheError) {
      console.error("Cache write error:", cacheError);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in fetchPropertiesByCity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
