import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendTypeSelector } from "@/components/trends/TrendTypeSelector";
import { AnalyticsTrendForm } from "@/components/trends/forms/AnalyticsTrendForm";
import { TopValuesForm } from "@/components/trends/forms/TopValuesForm";
import { TimelineForm } from "@/components/trends/forms/TimelineForm";
import { TrendCard } from "@/components/trends/TrendCard";
import { useAnalyzeMetadataTrendsQuery } from "@/modules/trends/use-analyze-metadata-trends-query";
import { useTopMetadataValuesQuery } from "@/modules/trends/use-top-metadata-values-query";
import { useMetadataTimelineQuery } from "@/modules/trends/use-metadata-timeline-query";
import { 
  TrendVariant, 
  TrendItem, 
  AnalyticsMetadataTrendForm,
  TopMetadataValuesForm,
  MetadataTimelineForm 
} from "@/modules/trends/trends.types";
import { useToast } from "@/hooks/use-toast";

type ViewState = "list" | "selector" | "form";

const Trends = () => {
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedType, setSelectedType] = useState<TrendVariant | null>(null);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const { toast } = useToast();

  // Query hooks (we'll manage them dynamically)
  const [activeQueries, setActiveQueries] = useState<Map<string, any>>(new Map());

  const generateTrendId = () => `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleTypeSelect = (type: TrendVariant) => {
    setSelectedType(type);
    setViewState("form");
  };

  const handleAnalyticsSubmit = (data: AnalyticsMetadataTrendForm) => {
    const id = generateTrendId();
    const newTrend: TrendItem = {
      id,
      type: "analytics",
      title: `Analytics: ${data.metadataField}`,
      config: data,
      isLoading: true,
    };

    setTrends(prev => [...prev, newTrend]);
    setViewState("list");

    // Execute query (mock - in real app this would be handled by React Query)
    setTimeout(() => {
      setTrends(prev => prev.map(trend => 
        trend.id === id 
          ? { ...trend, isLoading: false, data: generateMockAnalyticsData(data) }
          : trend
      ));
    }, 1500);

    toast({
      title: "Trend Created",
      description: `Analytics trend for ${data.metadataField} has been created`,
    });
  };

  const handleTopValuesSubmit = (data: TopMetadataValuesForm) => {
    const id = generateTrendId();
    const newTrend: TrendItem = {
      id,
      type: "top-values",
      title: `Top ${data.topN}: ${data.metadataField}`,
      config: data,
      isLoading: true,
    };

    setTrends(prev => [...prev, newTrend]);
    setViewState("list");

    // Execute query (mock)
    setTimeout(() => {
      setTrends(prev => prev.map(trend => 
        trend.id === id 
          ? { ...trend, isLoading: false, data: generateMockTopValuesData(data) }
          : trend
      ));
    }, 1000);

    toast({
      title: "Trend Created",
      description: `Top ${data.topN} values for ${data.metadataField} has been created`,
    });
  };

  const handleTimelineSubmit = (data: MetadataTimelineForm) => {
    const id = generateTrendId();
    const newTrend: TrendItem = {
      id,
      type: "timeline",
      title: `Timeline: ${data.metadataValue}`,
      config: data,
      isLoading: true,
    };

    setTrends(prev => [...prev, newTrend]);
    setViewState("list");

    // Execute query (mock)
    setTimeout(() => {
      setTrends(prev => prev.map(trend => 
        trend.id === id 
          ? { ...trend, isLoading: false, data: generateMockTimelineData(data) }
          : trend
      ));
    }, 1200);

    toast({
      title: "Trend Created",
      description: `Timeline for ${data.metadataValue} has been created`,
    });
  };

  const handleRefresh = (id: string) => {
    setTrends(prev => prev.map(trend => 
      trend.id === id ? { ...trend, isLoading: true } : trend
    ));

    setTimeout(() => {
      setTrends(prev => prev.map(trend => {
        if (trend.id === id) {
          let newData;
          if (trend.type === "analytics") {
            newData = generateMockAnalyticsData(trend.config as AnalyticsMetadataTrendForm);
          } else if (trend.type === "top-values") {
            newData = generateMockTopValuesData(trend.config as TopMetadataValuesForm);
          } else {
            newData = generateMockTimelineData(trend.config as MetadataTimelineForm);
          }
          return { ...trend, isLoading: false, data: newData };
        }
        return trend;
      }));
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setTrends(prev => prev.filter(trend => trend.id !== id));
    toast({
      title: "Trend Deleted",
      description: "The trend has been removed",
    });
  };

  const handleCancel = () => {
    setViewState("list");
    setSelectedType(null);
  };

  // Mock data generators
  const generateMockAnalyticsData = (config: AnalyticsMetadataTrendForm) => {
    const data = [];
    const days = config.timeRange === "1d" ? 1 : config.timeRange === "7d" ? 7 : config.timeRange === "30d" ? 30 : 90;
    
    for (let i = 0; i < Math.min(days, 20); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        time_period: date.toISOString().split('T')[0],
        metadata_value: `${config.metadataField}_value_${i % 3}`,
        trend_value: Math.floor(Math.random() * 100) + 10,
      });
    }
    return data;
  };

  const generateMockTopValuesData = (config: TopMetadataValuesForm) => {
    return Array.from({ length: config.topN }, (_, i) => ({
      metadata_value: `${config.metadataField}_value_${i + 1}`,
      event_count: Math.floor(Math.random() * 1000) + 100,
      unique_users: Math.floor(Math.random() * 500) + 50,
    }));
  };

  const generateMockTimelineData = (config: MetadataTimelineForm) => {
    const data = [];
    const days = config.timeRange === "1d" ? 1 : config.timeRange === "7d" ? 7 : config.timeRange === "30d" ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        time_period: date.toISOString().split('T')[0],
        event_count: Math.floor(Math.random() * 200) + 50,
        daily_users: Math.floor(Math.random() * 100) + 20,
      });
    }
    return data.reverse();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trends</h1>
        <p className="text-muted-foreground">
          Discover trending patterns and insights in your data
        </p>
      </div>

      {viewState === "list" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Trends</h2>
            <Button onClick={() => setViewState("selector")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Trend
            </Button>
          </div>

          {trends.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No trends created yet</p>
              <Button onClick={() => setViewState("selector")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Trend
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {trends.map((trend) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  onRefresh={handleRefresh}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {viewState === "selector" && (
        <TrendTypeSelector 
          onSelect={handleTypeSelect}
          onCancel={handleCancel}
        />
      )}

      {viewState === "form" && selectedType === "analytics" && (
        <AnalyticsTrendForm 
          onSubmit={handleAnalyticsSubmit}
          onCancel={handleCancel}
        />
      )}

      {viewState === "form" && selectedType === "top-values" && (
        <TopValuesForm 
          onSubmit={handleTopValuesSubmit}
          onCancel={handleCancel}
        />
      )}

      {viewState === "form" && selectedType === "timeline" && (
        <TimelineForm 
          onSubmit={handleTimelineSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Trends;