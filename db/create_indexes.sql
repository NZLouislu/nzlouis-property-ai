-- Create indexes on properties table to improve query performance
-- These indexes should be executed manually in the Supabase database

CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_suburb ON properties(suburb);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);

-- Composite indexes for common combination queries
CREATE INDEX IF NOT EXISTS idx_properties_city_suburb ON properties(city, suburb);
CREATE INDEX IF NOT EXISTS idx_properties_region_city ON properties(region, city);