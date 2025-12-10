import { Property } from "../components/properties.type";
import { API_ENDPOINTS, API_CONFIG } from "../config/api";

export async function fetchPropertiesByCity(
  city: string,
  page: number = 0,
  pageSize: number = 9,
  suburbs: string[] | null = null,
  searchQuery?: string,
  isExactSearch?: boolean,
  propertyId?: string
): Promise<Property[]> {
  try {
    console.log("fetchPropertiesByCity called with:", { city, page, pageSize, suburbs, searchQuery, isExactSearch, propertyId });
    
    if (!city && !propertyId) {
      return [];
    }

    const params = new URLSearchParams();
    
    if (propertyId) {
      params.append("id", propertyId);
    } else {
      params.append("city", city);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      if (suburbs && suburbs.length > 0) {
        params.append("suburbs", suburbs.join(","));
      }

      if (searchQuery) {
        params.append("search", searchQuery);
        if (isExactSearch) {
          params.append("exact", "true");
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const apiUrl = `${API_ENDPOINTS.property}?${params.toString()}`;
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to parse JSON error, but handle non-JSON responses
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.detail || JSON.stringify(errorData);
      } catch (jsonError) {
        // Response is not JSON, get text instead
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status} ${response.statusText}`;
        console.error("Non-JSON error response:", errorText);
      }
      
      console.error("Server error response:", errorMessage);
      throw new Error(`Failed to fetch properties: ${errorMessage}`);
    }

    const data = await response.json();
    console.log("Received response with", data.length, "properties");
    return data as Property[];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("Request timeout");
      throw new Error('Request timeout - the server took too long to respond');
    }
    console.error("Error in fetchPropertiesByCity:", error);
    throw error;
  }
}