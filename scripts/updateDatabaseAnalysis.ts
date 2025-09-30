import { createClient } from '@supabase/supabase-js';

async function updateDatabaseAnalysisStats() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  try {
    console.log('Starting database analysis stats update...');
    
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
    const aucklandForecastTotal = aucklandProperties || 0;
    const wellingtonForecastTotal = wellingtonProperties || 0;

    // Insert stats into database
    const { error: insertError } = await supabase
      .from('database_analysis_stats')
      .insert({
        auckland_properties: aucklandProperties || 0,
        wellington_properties: wellingtonProperties || 0,
        auckland_forecast_total: aucklandForecastTotal,
        wellington_forecast_total: wellingtonForecastTotal,
        auckland_forecast_90_percent: Math.round(aucklandForecastTotal * 0.9),
        auckland_forecast_80_percent: Math.round(aucklandForecastTotal * 0.8),
        auckland_forecast_60_percent: Math.round(aucklandForecastTotal * 0.6),
        wellington_forecast_90_percent: Math.round(wellingtonForecastTotal * 0.9),
        wellington_forecast_80_percent: Math.round(wellingtonForecastTotal * 0.8),
        wellington_forecast_60_percent: Math.round(wellingtonForecastTotal * 0.6)
      });
      
    if (insertError) throw insertError;
    
    console.log('Database analysis stats updated successfully');
  } catch (error) {
    console.error('Database analysis stats update failed:', error);
    process.exit(1);
  }
}

updateDatabaseAnalysisStats().catch(console.error);