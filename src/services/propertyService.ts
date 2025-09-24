import { Property } from "../components/properties.type";

export async function fetchPropertiesByCity(
  city: string,
  page: number = 0,
  pageSize: number = 9,
  suburbs: string[] | null = null
): Promise<Property[]> {
  try {
    // 构建查询参数
    const params = new URLSearchParams();
    params.append("city", city);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    if (suburbs && suburbs.length > 0) {
      params.append("suburbs", suburbs.join(","));
    }

    console.log("Fetching properties for city:", city);

    // 调用我们的 API 路由而不是直接调用 Supabase
    const response = await fetch(`/api/properties?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch properties: ${errorData.error}`);
    }

    const data = await response.json();
    console.log("Fetched properties count:", data?.length || 0);
    return data as Property[];
  } catch (error) {
    console.error("Error in fetchPropertiesByCity:", error);
    throw error;
  }
}
