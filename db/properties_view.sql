-- Create optimized properties view for common query patterns
-- This view includes commonly used fields and creates indexes for city and suburb fields

CREATE OR REPLACE VIEW properties_view AS
SELECT 
  id,
  address,
  suburb,
  city,
  postcode,
  year_built,
  bedrooms,
  bathrooms,
  car_spaces,
  floor_size,
  land_area,
  last_sold_price,
  last_sold_date,
  capital_value,
  land_value,
  improvement_value,
  has_rental_history,
  is_currently_rented,
  status,
  property_history,
  normalized_address,
  property_url,
  created_at,
  region,
  cover_image_url
FROM properties
ORDER BY id;

-- Create indexes for commonly queried fields
-- Note: Indexes cannot be created directly on views, they must be created on the base table
-- These indexes should be created on the properties table

/*
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_suburb ON properties(suburb);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
*/