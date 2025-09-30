import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function updateDatabaseAnalysisStats() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Starting database analysis stats update...');
    
    // Test connection with a simple, fast query
    const { data: testResult, error: testError } = await supabase
      .from('properties_view')
      .select('id')
      .limit(1);
      
    if (testError) {
      console.error('Failed to connect to database or access properties_view:', testError);
      throw testError;
    }
    
    console.log(`Database connection successful. Sample data:`, testResult);

    let aucklandProperties = 0;
    let wellingtonProperties = 0;

    // Get Auckland properties count using optimized query with index
    console.log('Fetching Auckland properties count...');
    const { count: aucklandCount, error: aucklandError } = await supabase
      .from('properties_view')
      .select('*', { count: 'exact' })
      .eq('region', 'Auckland');
      
    if (aucklandError) {
      console.error('Error fetching Auckland properties count:', aucklandError);
      // Try with a timeout-friendly approach
      console.log('Retrying with estimated count...');
      const { count: aucklandEstimate, error: aucklandEstimateError } = await supabase
        .from('properties_view')
        .select('*', { count: 'estimated' })
        .eq('region', 'Auckland');
        
      if (aucklandEstimateError) {
        console.error('Error fetching Auckland properties estimate:', aucklandEstimateError);
        throw aucklandEstimateError;
      }
      
      aucklandProperties = aucklandEstimate || 0;
      console.log(`Auckland properties estimate: ${aucklandProperties}`);
    } else {
      aucklandProperties = aucklandCount || 0;
      console.log(`Auckland properties count: ${aucklandProperties}`);
    }

    // Get Wellington properties count using optimized query with index
    console.log('Fetching Wellington properties count...');
    const { count: wellingtonCount, error: wellingtonError } = await supabase
      .from('properties_view')
      .select('*', { count: 'exact' })
      .eq('region', 'Wellington');
      
    if (wellingtonError) {
      console.error('Error fetching Wellington properties count:', wellingtonError);
      // Try with a timeout-friendly approach
      console.log('Retrying with estimated count...');
      const { count: wellingtonEstimate, error: wellingtonEstimateError } = await supabase
        .from('properties_view')
        .select('*', { count: 'estimated' })
        .eq('region', 'Wellington');
        
      if (wellingtonEstimateError) {
        console.error('Error fetching Wellington properties estimate:', wellingtonEstimateError);
        throw wellingtonEstimateError;
      }
      
      wellingtonProperties = wellingtonEstimate || 0;
      console.log(`Wellington properties estimate: ${wellingtonProperties}`);
    } else {
      wellingtonProperties = wellingtonCount || 0;
      console.log(`Wellington properties count: ${wellingtonProperties}`);
    }

    // Use properties counts for forecast as fallback
    const aucklandForecastTotal = aucklandProperties;
    const wellingtonForecastTotal = wellingtonProperties;

    // Prepare stats data
    const statsData = {
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

    console.log('Stats data to insert:', statsData);

    // Insert stats into database
    const { error: insertError } = await supabase
      .from('database_analysis_stats')
      .insert(statsData);
      
    if (insertError) {
      console.error('Error inserting stats into database:', insertError);
      throw insertError;
    }
    
    console.log('Database analysis stats updated successfully');
    console.log(`Auckland properties: ${aucklandProperties}`);
    console.log(`Wellington properties: ${wellingtonProperties}`);
  } catch (error) {
    console.error('Database analysis stats update failed:', error);
    process.exit(1);
  }
}

updateDatabaseAnalysisStats().catch(console.error);