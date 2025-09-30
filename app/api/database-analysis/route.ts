import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase client (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET() {
  try {
    console.log("Fetching latest database analysis stats");

    // Get the latest record from the stats table (highest ID)
    const { data, error } = await supabase
      .from('database_analysis_stats')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching database analysis stats:', error);
      return NextResponse.json({ error: 'Failed to fetch database analysis stats' }, { status: 500 });
    }

    if (!data) {
      console.log("No stats data found in database");
      return NextResponse.json({ error: 'No statistics data available' }, { status: 404 });
    }

    // Return the collected data
    return NextResponse.json({
      message: "Database analysis stats fetched successfully",
      ...data
    });
  } catch (error: any) {
    console.error('Database analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
