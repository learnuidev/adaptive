import { useQuery } from "@tanstack/react-query";
import { MetadataTimelineForm, MetadataValueTrendData } from "./trends.types";

// Mock function - replace with actual API call
const getMetadataTimeline = async (params: MetadataTimelineForm): Promise<MetadataValueTrendData[]> => {
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Mock data
  const mockData: MetadataValueTrendData[] = [];
  const days = params.timeRange === "1d" ? 1 : params.timeRange === "7d" ? 7 : params.timeRange === "30d" ? 30 : 90;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    mockData.push({
      time_period: date.toISOString().split('T')[0],
      event_count: Math.floor(Math.random() * 200) + 50,
      daily_users: Math.floor(Math.random() * 100) + 20,
    });
  }
  
  return mockData.reverse(); // chronological order
};

export const useMetadataTimelineQuery = (params: MetadataTimelineForm, enabled = false) => {
  return useQuery({
    queryKey: ["metadata-timeline", params],
    queryFn: () => getMetadataTimeline(params),
    enabled: enabled && !!params.metadataField && !!params.metadataValue,
    staleTime: 5 * 60 * 1000,
  });
};