import { NextResponse } from "next/server";

export async function GET() {
  console.log("Database Analysis API route called (Database Disabled)");

  // Default mock response when database is disabled
  return NextResponse.json({
    message: "Database analysis stats (Database Disabled)",
    auckland_properties: 0,
    wellington_properties: 0,
    auckland_forecast_total: 0,
    wellington_forecast_total: 0,
    auckland_forecast_90_percent: 0,
    auckland_forecast_80_percent: 0,
    auckland_forecast_60_percent: 0,
    wellington_forecast_90_percent: 0,
    wellington_forecast_80_percent: 0,
    wellington_forecast_60_percent: 0
  });
}

