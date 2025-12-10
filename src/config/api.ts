/**
 * API Configuration
 * Configure API base URL to support both HF FastAPI and local Next.js API
 */

// Get HF API URL from environment variable, use empty string (local API) if not set
export const API_BASE_URL = process.env.NEXT_PUBLIC_HF_API_URL || '';

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
  return API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
}

// Check if using HF API
export function isUsingHfApi(): boolean {
  return Boolean(API_BASE_URL);
}

// API configuration
export const API_CONFIG = {
  timeout: 15000, // 15 seconds timeout
  retries: 2, // Number of retries
} as const;
