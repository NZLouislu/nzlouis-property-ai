import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPropertiesByCity } from "../services/propertyService";
import { Property } from "../components/properties.type";

export function usePropertiesData(city: string, suburbs?: string[]) {
  const pageSize = 9;
  return useInfiniteQuery<Property[], Error>({
    queryKey: ["properties", city, suburbs],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // 过滤掉空字符串的郊区
        const filteredSuburbs = suburbs?.filter((suburb) => suburb !== "");
        return await fetchPropertiesByCity(
          city,
          pageParam as number,
          pageSize,
          filteredSuburbs || null
        );
      } catch (error) {
        console.error("Error fetching properties:", error);
        // 返回空数组而不是抛出错误
        return [];
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length === pageSize ? allPages.length : undefined,
    // 添加错误处理配置
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}
