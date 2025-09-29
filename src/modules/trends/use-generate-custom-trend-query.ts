import { useQuery } from "@tanstack/react-query";
import { TrendBuilderForm, TrendData } from "./trends.types";

// Mock function - replace with actual API call
const generateCustomTrend = async (params: TrendBuilderForm): Promise<TrendData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data based on parameters
  const mockData: TrendData[] = [];
  const days = params.timeRange === "1d" ? 1 : params.timeRange === "7d" ? 7 : params.timeRange === "30d" ? 30 : 90;
  
  for (let i = 0; i < Math.min(days, 10); i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    mockData.push({
      time_period: date.toISOString().split('T')[0],
      metadata_value: `value_${i % 3}`,
      trend_value: Math.floor(Math.random() * 100) + 10,
    });
  }
  
  return mockData;
};

export const useGenerateCustomTrendQuery = (params: TrendBuilderForm, enabled = false) => {
  return useQuery({
    queryKey: ["custom-trend", params],
    queryFn: () => generateCustomTrend(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};