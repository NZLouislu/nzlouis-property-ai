import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DatabaseAnalysisData {
  aucklandProperties: number;
  wellingtonProperties: number;
  aucklandForecast: number;
  wellingtonForecast: number;
  message: string;
}

interface DatabaseAnalysisState {
  data: DatabaseAnalysisData | null;
  loading: boolean;
  error: string | null;
  lastFetch: string | null; // ISO date string
  fetchData: () => Promise<void>;
  clearCache: () => void;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useDatabaseAnalysisStore = create<DatabaseAnalysisState>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      error: null,
      lastFetch: null,

      fetchData: async () => {
        const now = new Date().toISOString();
        const lastFetch = get().lastFetch;

        // Check if we need to fetch new data (cache for 24 hours)
        if (lastFetch) {
          const lastFetchTime = new Date(lastFetch).getTime();
          const nowTime = new Date(now).getTime();
          if (nowTime - lastFetchTime < CACHE_DURATION) {
            // Data is still fresh, no need to fetch
            return;
          }
        }

        set({ loading: true, error: null });

        try {
          const response = await fetch('/api/database-analysis');

          if (!response.ok) {
            throw new Error('Failed to fetch database analysis data');
          }

          const result: DatabaseAnalysisData = await response.json();
          set({
            data: result,
            loading: false,
            error: null,
            lastFetch: now
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'An unknown error occurred',
            loading: false
          });
        }
      },

      clearCache: () => {
        set({
          data: null,
          lastFetch: null,
          error: null
        });
      }
    }),
    {
      name: 'database-analysis-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        lastFetch: state.lastFetch
      })
    }
  )
);