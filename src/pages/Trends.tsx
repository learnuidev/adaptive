import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { TrendBuilderForm } from "@/components/trends/TrendBuilderForm";
import { TrendResultsChart } from "@/components/trends/TrendResultsChart";
import { TopTrendsTable } from "@/components/trends/TopTrendsTable";
import { useGenerateCustomTrendQuery } from "@/modules/trends/use-generate-custom-trend-query";
import { useTopMetadataTrendsQuery } from "@/modules/trends/use-top-metadata-trends-query";
import { TrendBuilderForm as TrendBuilderFormType } from "@/modules/trends/trends.types";
import { useToast } from "@/hooks/use-toast";

const Trends = () => {
  const [trendConfig, setTrendConfig] = useState<TrendBuilderFormType | null>(null);
  const { toast } = useToast();

  const customTrendQuery = useGenerateCustomTrendQuery(
    trendConfig!,
    !!trendConfig
  );

  const topTrendsQuery = useTopMetadataTrendsQuery(
    {
      metadataField: trendConfig?.metadataField || "",
      topN: 10,
      timeRange: trendConfig?.timeRange || "7d",
    },
    !!trendConfig?.metadataField
  );

  const handleFormSubmit = (data: TrendBuilderFormType) => {
    setTrendConfig(data);
    toast({
      title: "Trend Analysis Started",
      description: `Analyzing trends for ${data.metadataField} over ${data.timeRange}`,
    });
  };

  const isLoading = customTrendQuery.isLoading || topTrendsQuery.isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trends</h1>
        <p className="text-muted-foreground">
          Discover trending patterns and insights in your data
        </p>
      </div>

      <div className="grid gap-6">
        <TrendBuilderForm 
          onSubmit={handleFormSubmit} 
          isLoading={isLoading}
        />

        {trendConfig && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendResultsChart 
                data={customTrendQuery.data || []} 
                config={trendConfig}
              />
              <TopTrendsTable 
                data={topTrendsQuery.data || []} 
                metadataField={trendConfig.metadataField}
                isLoading={topTrendsQuery.isLoading}
              />
            </div>
          </>
        )}

        {(customTrendQuery.error || topTrendsQuery.error) && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h3 className="font-semibold text-destructive">Error Loading Trends</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {customTrendQuery.error?.message || topTrendsQuery.error?.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;