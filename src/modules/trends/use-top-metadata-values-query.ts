import { useQuery } from "@tanstack/react-query";
import { TopMetadataValuesForm, TopMetadataTrendData } from "./trends.types";

// Mock function - replace with actual API call
const getTopMetadataValues = async (params: TopMetadataValuesForm): Promise<TopMetadataTrendData[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  return Array.from({ length: params.topN }, (_, i) => ({
    metadata_value: `${params.metadataField}_value_${i + 1}`,
    event_count: Math.floor(Math.random() * 1000) + 100,
    unique_users: Math.floor(Math.random() * 500) + 50,
  }));
};

export const useTopMetadataValuesQuery = (params: TopMetadataValuesForm, enabled = false) => {
  return useQuery({
    queryKey: ["top-metadata-values", params],
    queryFn: () => getTopMetadataValues(params),
    enabled: enabled && !!params.metadataField,
    staleTime: 5 * 60 * 1000,
  });
};