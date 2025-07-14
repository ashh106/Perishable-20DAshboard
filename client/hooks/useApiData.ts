import { useState, useEffect } from "react";
import { apiCall } from "./useAuth";

// Generic hook for API data fetching with caching
export const useApiData = <T>(
  endpoint: string,
  dependencies: any[] = [],
  options: { enabled?: boolean; refetchInterval?: number } = {},
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { enabled = true, refetchInterval } = options;

  const fetchData = async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(endpoint);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, enabled]);

  return { data, loading, error, refetch: fetchData };
};

// Specific hooks for dashboard features
export const useInventoryData = (storeId: string) => {
  return useApiData<any[]>(`stores/${storeId}/inventory`, [storeId], {
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useExpiringItems = (storeId: string, daysThreshold = 5) => {
  return useApiData<any[]>(
    `stores/${storeId}/expiring?daysThreshold=${daysThreshold}`,
    [storeId, daysThreshold],
    { refetchInterval: 15000 }, // Refresh every 15 seconds for critical items
  );
};

export const useKPIData = (storeId: string) => {
  return useApiData<any>(`stores/${storeId}/kpis`, [storeId], {
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useDemandForecast = (storeId: string) => {
  return useApiData<any>(`stores/${storeId}/forecast`, [storeId]);
};

export const useMarkdownRecommendations = (storeId: string) => {
  return useApiData<any>(`stores/${storeId}/markdown-recommendations`, [
    storeId,
  ]);
};

export const useFeedbackAnalytics = (storeId: string) => {
  return useApiData<any>(`stores/${storeId}/feedback-analytics`, [storeId]);
};

export const useSalesAnalytics = (storeId: string, period = "7d") => {
  return useApiData<any>(`stores/${storeId}/sales-analytics?period=${period}`, [
    storeId,
    period,
  ]);
};

export const useStoreComparison = () => {
  return useApiData<any[]>("stores/comparison", []);
};

// Mutation hooks for data updates
export const useInventoryMutations = () => {
  const [loading, setLoading] = useState(false);

  const updateItem = async (itemId: string, updates: any) => {
    setLoading(true);
    try {
      await apiCall(`inventory/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      return true;
    } catch (error) {
      console.error("Failed to update item:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (storeId: string, item: any) => {
    setLoading(true);
    try {
      await apiCall(`stores/${storeId}/inventory`, {
        method: "POST",
        body: JSON.stringify(item),
      });
      return true;
    } catch (error) {
      console.error("Failed to add item:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateItem, addItem, loading };
};

export const useFeedbackMutations = () => {
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (storeId: string, feedback: any) => {
    setLoading(true);
    try {
      const result = await apiCall(`stores/${storeId}/feedback`, {
        method: "POST",
        body: JSON.stringify(feedback),
      });
      return result;
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitFeedback, loading };
};

export const useOrderMutations = () => {
  const [loading, setLoading] = useState(false);

  const syncOrder = async (storeId: string, orderData: any) => {
    setLoading(true);
    try {
      const result = await apiCall(`stores/${storeId}/sync-order`, {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      return result;
    } catch (error) {
      console.error("Failed to sync order:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { syncOrder, loading };
};

// Custom hook for optimized polling
export const usePolling = (
  callback: () => void,
  interval: number,
  enabled = true,
) => {
  useEffect(() => {
    if (enabled) {
      const id = setInterval(callback, interval);
      return () => clearInterval(id);
    }
  }, [callback, interval, enabled]);
};

// Hook for caching and background sync
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnFocus?: boolean;
  } = {},
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnFocus = true,
  } = options;

  const getCacheKey = (key: string) => `cache_${key}`;
  const getTimestampKey = (key: string) => `timestamp_${key}`;

  const fetchData = async (force = false) => {
    const cached = localStorage.getItem(getCacheKey(key));
    const timestamp = localStorage.getItem(getTimestampKey(key));

    // Check if cache is still valid
    if (
      !force &&
      cached &&
      timestamp &&
      Date.now() - parseInt(timestamp) < staleTime
    ) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);

      // Cache the result
      localStorage.setItem(getCacheKey(key), JSON.stringify(result));
      localStorage.setItem(getTimestampKey(key), Date.now().toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Cleanup expired cache entries
    const cleanup = () => {
      const timestamp = localStorage.getItem(getTimestampKey(key));
      if (timestamp && Date.now() - parseInt(timestamp) > cacheTime) {
        localStorage.removeItem(getCacheKey(key));
        localStorage.removeItem(getTimestampKey(key));
      }
    };

    const cleanupInterval = setInterval(cleanup, cacheTime);
    return () => clearInterval(cleanupInterval);
  }, [key]);

  useEffect(() => {
    if (refetchOnFocus) {
      const handleFocus = () => fetchData();
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [refetchOnFocus]);

  return { data, loading, error, refetch: () => fetchData(true) };
};
