import { Property } from "../components/properties.type";
import { API_ENDPOINTS } from "../config/api";

export async function fetchForecastPropertiesByCity(
  city: string,
  page: number = 0,
  pageSize: number = 9,
  suburbs: string[] | null = null
): Promise<Property[]> {
  try {
    const params = new URLSearchParams();
    params.append("city", city);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    if (suburbs && suburbs.length > 0) {
      params.append("suburbs", suburbs.join(","));
    }

    console.log("Fetching forecast properties for city:", city);

    const apiUrl = `${API_ENDPOINTS.forecast}?${params.toString()}`;
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Try to parse JSON error, but handle non-JSON responses
      let errorMessage = `Server error (${response.status})`;
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        if (typeof errorData === 'object' && errorData !== null) {
          errorMessage = errorData.error || errorData.detail || errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = String(errorData);
        }
      } catch (jsonError) {
        // Response is not JSON, use text instead
        errorMessage = errorText || `HTTP ${response.status} ${response.statusText}`;
        console.error("Non-JSON error response:", errorText);
      }
      
      throw new Error(`Failed to fetch forecast properties: ${errorMessage}`);
    }

    const data = await response.json();
    console.log("Fetched forecast properties count:", data?.length || 0);
    return data as Property[];
  } catch (error) {
    console.error("Error in fetchForecastPropertiesByCity:", error);
    throw error;
  }
}
