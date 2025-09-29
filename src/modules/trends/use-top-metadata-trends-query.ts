import { useQuery } from "@tanstack/react-query";
import { TimeRange, TopMetadataTrendData } from "./trends.types";

interface UseTopMetadataTrendsParams {
  metadataField: string;
  topN?: number;
  timeRange?: TimeRange;
}

// Mock function - replace with actual API call
const getTopMetadataTrends = async (params: UseTopMetadataTrendsParams): Promise<TopMetadataTrendData[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  return Array.from({ length: params.topN || 10 }, (_, i) => ({
    metadata_value: `${params.metadataField}_value_${i + 1}`,
    event_count: Math.floor(Math.random() * 1000) + 100,
    unique_users: Math.floor(Math.random() * 500) + 50,
  }));
};

export const useTopMetadataTrendsQuery = (params: UseTopMetadataTrendsParams, enabled = false) => {
  return useQuery({
    queryKey: ["top-metadata-trends", params],
    queryFn: () => getTopMetadataTrends(params),
    enabled: enabled && !!params.metadataField,
    staleTime: 5 * 60 * 1000,
  });
};