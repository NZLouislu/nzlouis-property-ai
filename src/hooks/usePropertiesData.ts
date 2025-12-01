import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPropertiesByCity } from "../services/propertyService";
import { Property } from "../components/properties.type";
import { Region } from "../components/properties.type";
import { useState, useEffect, useMemo } from "react";

export function usePropertiesData(city: string, suburbs?: string[]) {
  const pageSize = 9;
  
  const normalizedSuburbs = useMemo(() => {
    if (!suburbs || suburbs.length === 0) {
      return null;
    }
    return suburbs.filter(s => s.trim() !== '').sort();
  }, [suburbs]);
  
  const queryKey = useMemo(() => {
    const normalizedCity = city || "";
    const suburbKey = normalizedSuburbs ? normalizedSuburbs.join(',') : 'all';
    return ["properties", normalizedCity, suburbKey, "fixed-v3"];
  }, [city, normalizedSuburbs]);
  
  const queryInfo = useInfiniteQuery<Property[], Error>({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0, signal }) => {
      try {
        if (!city) {
          return [];
        }
        
        const result = await fetchPropertiesByCity(
          city,
          pageParam as number,
          pageSize,
          normalizedSuburbs
        );
        
        return result;
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has pageSize items, assume there is a next page
      if (lastPage && lastPage.length === pageSize) {
        return allPages.length;
      }
      
      return undefined;
    },
    retry: (failureCount, error) => {
      // Reduce retry attempts for database timeout errors
      if (error.message.includes('statement timeout') || error.message.includes('canceling statement')) {
        return failureCount < 1; // Retry only once
      }
      if (error.message.includes('timeout') || error.message.includes('network')) {
        return failureCount < 2;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!city,
    refetchOnWindowFocus: false,
  });
  
  return queryInfo;
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