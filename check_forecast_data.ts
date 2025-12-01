import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function checkForecastData() {
  const city = "Auckland - City";
  console.log(`Checking forecast data for city: ${city}`);

  try {
    /*
    // 1. Check count in properties_with_latest_status
    const { count, error: countError } = await supabase
      .from("properties_with_latest_status")
      .select("*", { count: "exact", head: true })
      .eq("city", city);

    if (countError) {
      console.error("Error checking count:", countError);
    } else {
      console.log(`Total rows in properties_with_latest_status for ${city}: ${count}`);
    }

    // 4. List distinct cities in properties_with_latest_status
    const { data: cities, error: citiesError } = await supabase
      .from("properties_with_latest_status")
      .select("city")
      .limit(100); 

    if (citiesError) {
        console.error("Error fetching cities:", citiesError);
    } else {
        const distinctCities = [...new Set(cities.map(c => c.city))];
        console.log("Available cities in view:", distinctCities);
    }
    */

    // 5. Check properties table for 'Auckland' using ilike
    const { data: aucklandProps, error: aucklandError } = await supabase
      .from("properties")
      .select("id, address, city, suburb")
      .eq("city", "Auckland - City")
      .limit(5);

    if (aucklandError) {
        console.error("Error fetching Auckland properties:", aucklandError);
    } else {
        console.log(`Found ${aucklandProps.length} rows in properties table for city like '%Auckland%'`);
        if (aucklandProps.length > 0) {
            console.log("Sample:", aucklandProps[0]);
        }
    }

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

checkForecastData();
