/**
 * API Configuration
 * FORCED MODE: Using Hugging Face FastAPI as the primary backend.
 * This aligns with the "Separation of Concerns" architecture.
 */

// Default to the production HF Space URL if env var is not set
const DEFAULT_HF_URL = 'https://nzlouislu-nzlouis-property-api.hf.space';

// Export the Base URL - ensuring it's never empty
export const API_BASE_URL = process.env.NEXT_PUBLIC_HF_API_URL || DEFAULT_HF_URL;

// API endpoints
export const API_ENDPOINTS = {
  property: `${API_BASE_URL}/api/property`,
  propertyAutocomplete: `${API_BASE_URL}/api/property/autocomplete`,
  forecast: `${API_BASE_URL}/api/forecast`,
  forecastAutocomplete: `${API_BASE_URL}/api/forecast/autocomplete`,
  regions: `${API_BASE_URL}/api/regions`,
  health: `${API_BASE_URL}/health`,
} as const;

// Get complete API URL
export function getApiUrl(endpoint: string): string {
  // Since we are enforcing HF API, we can simply join them if needed, 
  // but API_ENDPOINTS should be preferred.
  if (endpoint.startsWith('http')) return endpoint;
  return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

// Check if using HF API - Always true now
export function isUsingHfApi(): boolean {
  return true;
}

// API configuration
export const API_CONFIG = {
  timeout: 30000, // Increased timeout to 30s for AI/Data operations
  retries: 2, 
} as const;
