import { Property } from "../components/properties.type";

export async function fetchPropertiesByCity(
  city: string,
  page: number = 0,
  pageSize: number = 9,
  suburbs: string[] | null = null
): Promise<Property[]> {
  try {
    // Don't fetch if city is not provided
    if (!city) {
      return [];
    }

    const params = new URLSearchParams();
    params.append("city", city);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    if (suburbs && suburbs.length > 0) {
      params.append("suburbs", suburbs.join(","));
    }

    console.log("Fetching properties for city:", city);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`/api/property?${params.toString()}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch properties: ${errorData.error}`);
    }

    const data = await response.json();
    console.log("Fetched properties count:", data?.length || 0);
    return data as Property[];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - the server took too long to respond');
    }
    console.error("Error in fetchPropertiesByCity:", error);
    throw error;
  }
}