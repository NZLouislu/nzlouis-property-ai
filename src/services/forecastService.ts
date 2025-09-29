import { Property } from "../components/properties.type";

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

    const response = await fetch(`/api/forecast?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch forecast properties: ${errorData.error}`
      );
    }

    const data = await response.json();
    console.log("Fetched forecast properties count:", data?.length || 0);
    return data as Property[];
  } catch (error) {
    console.error("Error in fetchForecastPropertiesByCity:", error);
    throw error;
  }
}
