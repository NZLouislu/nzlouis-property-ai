import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase client (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function calculateStats() {
  try {
    // Get Auckland properties count
    const { count: aucklandProperties, error: aucklandError } = await supabase
      .from('properties_view')
      .select('*', { count: 'exact' })
      .eq('region', 'Auckland')
      .limit(0);
      
    if (aucklandError) throw aucklandError;

    // Get Wellington properties count
    const { count: wellingtonProperties, error: wellingtonError } = await supabase
      .from('properties_view')
      .select('*', { count: 'exact' })
      .eq('region', 'Wellington')
      .limit(0);
      
    if (wellingtonError) throw wellingtonError;

    // Use properties counts for forecast as fallback
    const aucklandForecastTotal = aucklandProperties;
    const wellingtonForecastTotal = wellingtonProperties;

    // Calculate confidence levels
    const stats = {
      auckland_properties: aucklandProperties,
      wellington_properties: wellingtonProperties,
      auckland_forecast_total: aucklandForecastTotal,
      wellington_forecast_total: wellingtonForecastTotal,
      auckland_forecast_90_percent: Math.round(aucklandForecastTotal * 0.9),
      auckland_forecast_80_percent: Math.round(aucklandForecastTotal * 0.8),
      auckland_forecast_60_percent: Math.round(aucklandForecastTotal * 0.6),
      wellington_forecast_90_percent: Math.round(wellingtonForecastTotal * 0.9),
      wellington_forecast_80_percent: Math.round(wellingtonForecastTotal * 0.8),
      wellington_forecast_60_percent: Math.round(wellingtonForecastTotal * 0.6)
    };

    // Insert stats into database
    const { error: insertError } = await supabase
      .from('database_analysis_stats')
      .insert(stats);
      
    if (insertError) throw insertError;

    return stats;
  } catch (error) {
    console.error('Error calculating stats:', error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log("Fetching database analysis stats");

    // Check if we have any stats in the database
    const { data: existingStats, error: fetchError } = await supabase
      .from('database_analysis_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If no stats exist, calculate and insert them
    if (fetchError || !existingStats) {
      console.log("No existing stats found, calculating new stats");
      const newStats = await calculateStats();
      
      return NextResponse.json({
        message: "Database analysis stats calculated and fetched successfully",
        ...newStats
      });
    }

    // Return existing stats
    return NextResponse.json({
      message: "Database analysis stats fetched successfully",
      ...existingStats
    });
  } catch (error: any) {
    console.error('Database analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}