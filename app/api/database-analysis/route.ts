import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase client (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET() {
  try {
    console.log("Starting database analysis");
    
    // 1. 简单测试 - 获取表数量
    const { count, error: countError } = await supabase
      .from('properties_with_latest_status')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting properties:', countError);
      return NextResponse.json({ error: 'Failed to count properties', details: countError.message }, { status: 500 });
    }

    console.log("Properties count:", count);
    
    // 2. 获取一些数据样本 (使用正确的字段)
    const { data: sampleData, error: sampleError } = await supabase
      .from('properties_with_latest_status')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('Error fetching sample data:', sampleError);
      return NextResponse.json({ error: 'Failed to fetch sample data', details: sampleError.message }, { status: 500 });
    }

    console.log("Sample data fetched successfully");
    
    // 3. 计算大字段占用情况
    let historySize = 0;
    let imageUrlCount = 0;
    
    sampleData.forEach((property: any) => {
      if (property.property_history) {
        historySize += property.property_history.length;
      }
      if (property.cover_image_url) {
        imageUrlCount++;
      }
    });

    // Return collected data
    return NextResponse.json({
      message: "Database analysis completed successfully",
      propertyCount: count,
      sampleData: sampleData.length,
      historySize: historySize,
      imageUrlCount: imageUrlCount
    });

  } catch (error: any) {
    console.error('Error in database analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}