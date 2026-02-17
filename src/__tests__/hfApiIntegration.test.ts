/**
 * HF FastAPI Integration Tests
 * These tests verify that the modified services can correctly call HF FastAPI
 */

import { Property } from "../components/properties.type";

// Mock fetch globally
global.fetch = jest.fn();

// Mock the API configuration
jest.mock("../config/api", () => {
  const originalModule = jest.requireActual("../config/api");
  return {
    ...originalModule,
    API_BASE_URL: "",
    API_ENDPOINTS: {
      property: "/api/property",
      propertyAutocomplete: "/api/property/autocomplete",
      forecast: "/api/forecast",
      forecastAutocomplete: "/api/forecast/autocomplete",
      regions: "/api/regions",
      health: "/health",
    },
    API_CONFIG: {
      timeout: 15000,
      retries: 2,
    },
  };
});

describe("HF FastAPI Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("propertyService", () => {
    it("should call API endpoint with correct parameters", async () => {
      const { fetchPropertiesByCity } = require("../services/propertyService");

      const mockProperties: Property[] = [
        {
          id: "1",
          address: "123 Main St",
          suburb: "Auckland Central",
          city: "Auckland",
          property_url: "https://example.com/1",
        } as Property,
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperties,
      });

      const result = await fetchPropertiesByCity("Auckland", 0, 9);

      expect(result).toEqual(mockProperties);
      expect(global.fetch).toHaveBeenCalled();
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("/api/property");
      expect(calledUrl).toContain("city=Auckland");
    });

    it("should include all query parameters correctly", async () => {
      const { fetchPropertiesByCity } = require("../services/propertyService");

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetchPropertiesByCity(
        "Auckland",
        2,
        10,
        ["Auckland Central", "Parnell"],
        "Queen St",
        false
      );

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("city=Auckland");
      expect(calledUrl).toContain("page=2");
      expect(calledUrl).toContain("pageSize=10");
      expect(calledUrl).toContain("suburbs=Auckland+Central%2CParnell");
      expect(calledUrl).toContain("search=Queen+St");
    });

    it("should handle property ID query", async () => {
      const { fetchPropertiesByCity } = require("../services/propertyService");

      const mockProperty: Property[] = [
        {
          id: "test-id-123",
          address: "123 Test St",
          suburb: "Test Suburb",
          city: "Auckland",
          property_url: "https://example.com/1",
        } as Property,
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperty,
      });

      await fetchPropertiesByCity("Auckland", 0, 9, null, undefined, undefined, "test-id-123");

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("id=test-id-123");
      expect(calledUrl).not.toContain("city=");
    });

    it("should handle API errors correctly", async () => {
      const { fetchPropertiesByCity } = require("../services/propertyService");

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ error: "Database timeout" }),
        json: async () => ({ error: "Database timeout" }),
      });

      await expect(fetchPropertiesByCity("Auckland", 0, 9)).rejects.toThrow(
        "Failed to fetch properties: Database timeout"
      );
    });

    it("should return empty array when no city or id provided", async () => {
      const { fetchPropertiesByCity } = require("../services/propertyService");

      const result = await fetchPropertiesByCity("", 0, 9);

      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should include search with exact flag", async () => {
      const { fetchPropertiesByCity } = require("../services/propertyService");

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetchPropertiesByCity("Auckland", 0, 9, null, "123 Queen St", true);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("search=123+Queen+St");
      expect(calledUrl).toContain("exact=true");
    });
  });

  describe("forecastService", () => {
    it("should call forecast API endpoint", async () => {
      const { fetchForecastPropertiesByCity } = require("../services/forecastService");

      const mockProperties: Property[] = [
        {
          id: "1",
          address: "123 Main St",
          suburb: "Auckland Central",
          city: "Auckland",
          property_url: "https://example.com/1",
          confidence_score: 0.85,
          predicted_status: "likely_to_sell",
        } as Property,
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperties,
      });

      const result = await fetchForecastPropertiesByCity("Auckland", 0, 9);

      expect(result).toEqual(mockProperties);
      expect(global.fetch).toHaveBeenCalled();
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("/api/forecast");
      expect(calledUrl).toContain("city=Auckland");
    });

    it("should include suburbs parameter", async () => {
      const { fetchForecastPropertiesByCity } = require("../services/forecastService");

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetchForecastPropertiesByCity("Auckland", 1, 20, [
        "Auckland Central",
        "Parnell",
      ]);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("city=Auckland");
      expect(calledUrl).toContain("page=1");
      expect(calledUrl).toContain("pageSize=20");
      expect(calledUrl).toContain("suburbs=Auckland+Central%2CParnell");
    });

    it("should handle forecast API errors", async () => {
      const { fetchForecastPropertiesByCity } = require("../services/forecastService");

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => JSON.stringify({ error: "No forecast data available" }),
        json: async () => ({ error: "No forecast data available" }),
      });

      await expect(
        fetchForecastPropertiesByCity("Auckland", 0, 9)
      ).rejects.toThrow("Failed to fetch forecast properties: No forecast data available");
    });
  });

  describe("API Configuration", () => {
    it("should have correct API endpoints defined", () => {
      const { API_ENDPOINTS } = require("../config/api");

      // Check that all endpoints are defined
      expect(API_ENDPOINTS.property).toBeDefined();
      expect(API_ENDPOINTS.propertyAutocomplete).toBeDefined();
      expect(API_ENDPOINTS.forecast).toBeDefined();
      expect(API_ENDPOINTS.forecastAutocomplete).toBeDefined();
      expect(API_ENDPOINTS.regions).toBeDefined();
      expect(API_ENDPOINTS.health).toBeDefined();
    });

    it("should have correct API config values", () => {
      const { API_CONFIG } = require("../config/api");

      expect(API_CONFIG.timeout).toBe(15000);
      expect(API_CONFIG.retries).toBe(2);
    });
  });
});

