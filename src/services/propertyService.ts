import { Property } from "../components/properties.type";

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
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    console.log("Making request to:", `/api/property?${params.toString()}`);
    
    const response = await fetch(`/api/property?${params.toString()}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(`Failed to fetch properties: ${errorData.error}`);
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