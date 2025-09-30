import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchForecastPropertiesByCity } from "../services/forecastService";
import { Property } from "../components/properties.type";

export function useForecastData(city: string, suburbs?: string[]) {
  const pageSize = 9;
  return useInfiniteQuery<Property[], Error>({
    queryKey: ["forecast", city, suburbs, 'v3'], // Add version to force cache refresh
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const filteredSuburbs = suburbs?.filter((suburb) => suburb !== "");
        return await fetchForecastPropertiesByCity(
          city,
          pageParam as number,
          pageSize,
          filteredSuburbs || null
        );
      } catch (error) {
        console.error("Error fetching forecast properties:", error);
        return [];
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length === pageSize ? allPages.length : undefined,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}