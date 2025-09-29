import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPropertiesByCity } from "../services/propertyService";
import { Property } from "../components/properties.type";
import { Region } from "../components/properties.type";
import { useState, useEffect } from "react";

export function usePropertiesData(city: string, suburbs?: string[]) {
  const pageSize = 9;
  return useInfiniteQuery<Property[], Error>({
    queryKey: ["properties", city, suburbs],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        if (!city) {
          return [];
        }
        
        const filteredSuburbs = suburbs?.filter((suburb) => suburb !== "");
        return await fetchPropertiesByCity(
          city,
          pageParam as number,
          pageSize,
          filteredSuburbs || null
        );
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        return [];
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length === pageSize ? allPages.length : undefined,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!city,
    refetchOnWindowFocus: false,
  });
}

export const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/regions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error('Failed to load regions:', error);
        setError('Failed to load regions');
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  return { regions, loading, error };
};