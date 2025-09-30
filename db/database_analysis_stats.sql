CREATE TABLE database_analysis_stats (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auckland_properties INTEGER,
  wellington_properties INTEGER,
  auckland_forecast_total INTEGER,
  wellington_forecast_total INTEGER,
  auckland_forecast_90_percent INTEGER,
  auckland_forecast_80_percent INTEGER,
  auckland_forecast_60_percent INTEGER,
  wellington_forecast_90_percent INTEGER,
  wellington_forecast_80_percent INTEGER,
  wellington_forecast_60_percent INTEGER
);

CREATE INDEX idx_database_analysis_stats_created_at ON database_analysis_stats(created_at);