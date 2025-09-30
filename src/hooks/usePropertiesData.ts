import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPropertiesByCity, PropertyResponse } from "../services/propertyService";
import { Property } from "../components/properties.type";
import { Region } from "../components/properties.type";
import { useState, useEffect } from "react";

export function usePropertiesData(city: string, suburbs?: string[]) {
  const pageSize = 9;
  const filteredSuburbs = suburbs?.filter((suburb) => suburb !== "") || [];
  
  return useInfiniteQuery<PropertyResponse, Error>({
    queryKey: ["properties", city, filteredSuburbs.sort().join(","), 'v4'], // v4 for new response format
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        if (!city) {
          return { data: [], hasMore: false, total: 0, page: 0, pageSize };
        }
        
        const result = await fetchPropertiesByCity(
          city,
          pageParam as number,
          pageSize,
          filteredSuburbs.length > 0 ? filteredSuburbs : null
        );
        
        return result;
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // Use the hasMore flag from the API response
      if (lastPage && lastPage.hasMore) {
        return allPages.length; // Return the next page number
      }
      return undefined; // No more pages
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // Reduced to 2 minutes for better data freshness
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    enabled: !!city,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Force refetch on component mount to ensure fresh pagination state
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