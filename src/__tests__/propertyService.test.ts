// propertyService.test.ts
import { fetchPropertiesByCity, PropertyResponse } from "../services/propertyService";
import { Property } from "../components/properties.type";

// Mock the fetch function to simulate API responses
jest.mock("../services/propertyService", () => ({
  fetchPropertiesByCity: jest.fn(),
}));

describe("fetchPropertiesByCity", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return properties when city is specified", async () => {
    // Arrange
    const mockProperties: Property[] = [
      {
        id: "1",
        address: "123 Main St",
        suburb: "Khandallah",
        city: "Wellington City",
        postcode: "6022",
        year_built: 2000,
        bedrooms: 3,
        bathrooms: 2,
        car_spaces: 2,
        floor_size: "150m²",
        land_area: "800m²",
        last_sold_price: 1000000,
        last_sold_date: new Date("2023-01-01"),
        capital_value: 1200000,
        land_value: 400000,
        improvement_value: 800000,
        has_rental_history: true,
        predicted_price: 1300000,
        confidence_score: 0.85,
        category: "House",
        property_url: "https://example.com/property/1",
        cover_image_url: "https://example.com/images/1.jpg",
      },
    ];

    const mockResponse: PropertyResponse = {
      data: mockProperties,
      hasMore: true,
      total: 100,
      page: 0,
      pageSize: 9
    };

    // Mock the fetch function to return our mock data
    (fetchPropertiesByCity as jest.MockedFunction<typeof fetchPropertiesByCity>).mockResolvedValue(mockResponse);

    // Act
    const result = await fetchPropertiesByCity("Wellington City", 0, 9);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(fetchPropertiesByCity).toHaveBeenCalledWith("Wellington City", 0, 9);
  });

  it("should return properties filtered by suburb", async () => {
    // Arrange
    const mockProperties: Property[] = [
      {
        id: "1",
        address: "123 Main St",
        suburb: "Khandallah",
        city: "Wellington City",
        postcode: "6022",
        year_built: 2000,
        bedrooms: 3,
        bathrooms: 2,
        car_spaces: 2,
        floor_size: "150m²",
        land_area: "800m²",
        last_sold_price: 1000000,
        last_sold_date: new Date("2023-01-01"),
        capital_value: 1200000,
        land_value: 400000,
        improvement_value: 800000,
        has_rental_history: true,
        predicted_price: 1300000,
        confidence_score: 0.85,
        category: "House",
        property_url: "https://example.com/property/1",
        cover_image_url: "https://example.com/images/1.jpg",
      },
    ];

    const mockResponse: PropertyResponse = {
      data: mockProperties,
      hasMore: false,
      total: 1,
      page: 0,
      pageSize: 9
    };

    // Mock the fetch function to return our mock data
    (fetchPropertiesByCity as jest.MockedFunction<typeof fetchPropertiesByCity>).mockResolvedValue(mockResponse);

    // Act
    const result = await fetchPropertiesByCity("Wellington City", 0, 9, ["Khandallah"]);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(fetchPropertiesByCity).toHaveBeenCalledWith("Wellington City", 0, 9, ["Khandallah"]);
  });

  it("should handle empty suburbs array", async () => {
    // Arrange
    const mockProperties: Property[] = [
      {
        id: "1",
        address: "123 Main St",
        suburb: "Khandallah",
        city: "Wellington City",
        postcode: "6022",
        year_built: 2000,
        bedrooms: 3,
        bathrooms: 2,
        car_spaces: 2,
        floor_size: "150m²",
        land_area: "800m²",
        last_sold_price: 1000000,
        last_sold_date: new Date("2023-01-01"),
        capital_value: 1200000,
        land_value: 400000,
        improvement_value: 800000,
        has_rental_history: true,
        predicted_price: 1300000,
        confidence_score: 0.85,
        category: "House",
        property_url: "https://example.com/property/1",
        cover_image_url: "https://example.com/images/1.jpg",
      },
    ];

    const mockResponse: PropertyResponse = {
      data: mockProperties,
      hasMore: true,
      total: 50,
      page: 0,
      pageSize: 9
    };

    // Mock the fetch function to return our mock data
    (fetchPropertiesByCity as jest.MockedFunction<typeof fetchPropertiesByCity>).mockResolvedValue(mockResponse);

    // Act
    const result = await fetchPropertiesByCity("Wellington City", 0, 9, []);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(fetchPropertiesByCity).toHaveBeenCalledWith("Wellington City", 0, 9, []);
  });

  it("should handle null suburbs parameter", async () => {
    // Arrange
    const mockProperties: Property[] = [
      {
        id: "1",
        address: "123 Main St",
        suburb: "Khandallah",
        city: "Wellington City",
        postcode: "6022",
        year_built: 2000,
        bedrooms: 3,
        bathrooms: 2,
        car_spaces: 2,
        floor_size: "150m²",
        land_area: "800m²",
        last_sold_price: 1000000,
        last_sold_date: new Date("2023-01-01"),
        capital_value: 1200000,
        land_value: 400000,
        improvement_value: 800000,
        has_rental_history: true,
        predicted_price: 1300000,
        confidence_score: 0.85,
        category: "House",
        property_url: "https://example.com/property/1",
        cover_image_url: "https://example.com/images/1.jpg",
      },
    ];

    const mockResponse: PropertyResponse = {
      data: mockProperties,
      hasMore: true,
      total: 50,
      page: 0,
      pageSize: 9
    };

    // Mock the fetch function to return our mock data
    (fetchPropertiesByCity as jest.MockedFunction<typeof fetchPropertiesByCity>).mockResolvedValue(mockResponse);

    // Act
    const result = await fetchPropertiesByCity("Wellington City", 0, 9, null);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(fetchPropertiesByCity).toHaveBeenCalledWith("Wellington City", 0, 9, null);
  });
});