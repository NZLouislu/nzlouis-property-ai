-- Add indexes to optimize address autocomplete queries
-- This will significantly improve performance for ILIKE queries

-- Enable pg_trgm extension for fuzzy text search (trigram matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on address field for fast ILIKE queries
-- This index supports both prefix matching (address ILIKE 'query%') 
-- and contains matching (address ILIKE '%query%')
CREATE INDEX IF NOT EXISTS idx_properties_address_gin 
ON properties USING GIN (address gin_trgm_ops);

-- Create index on city for filtering (improves performance when city is specified)
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties (city);

-- Create composite index for address + city queries
CREATE INDEX IF NOT EXISTS idx_properties_address_city 
ON properties (city, address);

-- Note: properties_view is a view, not a table, so it cannot have indexes.
-- However, it will automatically benefit from indexes on the underlying properties table.

-- Verify indexes were created
SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'properties' 
    AND indexname LIKE 'idx_%'
ORDER BY indexname;
