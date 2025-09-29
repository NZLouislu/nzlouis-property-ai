-- View for property forecast data
-- This view is used by the forecast API to fetch property information with latest status

CREATE OR REPLACE VIEW properties_with_latest_status AS
SELECT 
    p.*,
    ps.predicted_status,
    ps.confidence_score,
    ps.predicted_at
FROM properties p
LEFT JOIN property_status ps ON p.id = ps.property_id
WHERE ps.predicted_at = (
    SELECT MAX(predicted_at) 
    FROM property_status 
    WHERE property_id = p.id
)
OR ps.predicted_at IS NULL;