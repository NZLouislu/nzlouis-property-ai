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
    return ["properties", normalizedCity, suburbKey, "fixed-v1"];
  }, [city, normalizedSuburbs]);
  
  console.log("usePropertiesData called with:", { city, suburbs, normalizedSuburbs, queryKey });
  
  const queryInfo = useInfiniteQuery<Property[], Error>({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0, signal }) => {
      try {
        console.log("queryFn called with:", { pageParam, city, normalizedSuburbs });
        
        if (!city) {
          console.log("No city provided, returning empty array");
          return [];
        }
        
        const result = await fetchPropertiesByCity(
          city,
          pageParam as number,
          pageSize,
          normalizedSuburbs
        );
        
        console.log("fetchPropertiesByCity result:", { 
          pageParam, 
          resultLength: result.length,
          shouldHaveNextPage: result.length === pageSize
        });
        
        return result;
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      console.log("getNextPageParam called with:", { 
        lastPageLength: lastPage?.length, 
        allPagesLength: allPages.length,
        pageSize
      });
      
      // 关键修复：只要最后一页的数据量等于pageSize，就认为还有下一页
      if (lastPage && lastPage.length === pageSize) {
        console.log("Has next page, returning:", allPages.length);
        return allPages.length;
      }
      
      console.log("No next page");
      return undefined;
    },
    retry: (failureCount, error) => {
      console.log("Retry logic:", { failureCount, errorMessage: error.message });
      if (error.message.includes('timeout') || error.message.includes('network')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!city,
    refetchOnWindowFocus: false,
  });
  
  // 添加额外的日志来追踪查询状态
  console.log("Query info:", {
    isLoading: queryInfo.isLoading,
    isFetching: queryInfo.isFetching,
    isFetchingNextPage: queryInfo.isFetchingNextPage,
    hasNextPage: queryInfo.hasNextPage,
    dataPagesCount: queryInfo.data?.pages.length
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