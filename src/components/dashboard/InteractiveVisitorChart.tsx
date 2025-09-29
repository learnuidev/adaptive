import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Globe, Monitor, Smartphone, Chrome } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

const groupByOptions = [
  { id: "country", label: "Country", icon: Globe },
  { id: "region", label: "Region", icon: Globe },
  { id: "city", label: "City", icon: Globe },
  { id: "browser_name", label: "Browser", icon: Monitor },
  { id: "os_name", label: "OS", icon: Smartphone },
] as const;

const getLocationGrouping = () => ["country", "region", "city"];
const getDeviceGrouping = () => ["browser_name", "os_name"];

const getBrowserIcon = (browserName: string) => {
  const name = browserName?.toLowerCase();
  if (name?.includes("chrome")) return Chrome;
  return Monitor;
};

export function InteractiveVisitorChart({ credentialId }: InteractiveVisitorChartProps) {
  const [selectedGroupBy, setSelectedGroupBy] = useState<typeof groupByOptions[number]["id"]>("country");
  const [viewMode, setViewMode] = useState<"map" | "chart">("map");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: visitorData, isLoading } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: selectedGroupBy,
  });

  const chartConfig = {
    visitors: {
      label: "Visitors",
      color: "hsl(var(--primary))",
    },
  };

  const chartData = visitorData?.map((item) => ({
    name: item.name,
    visitors: parseInt(item.visitors),
  })) || [];

  const topItems = chartData.slice(0, 5);
  const isLocationTab = getLocationGrouping().includes(selectedGroupBy);

  return (
    <Card className="glass border-border/50 hover:shadow-medium transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 bg-primary-soft rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            Visitor Analytics
          </CardTitle>
          <Badge variant="secondary" className="bg-primary-soft text-primary">
            {chartData.reduce((sum, item) => sum + item.visitors, 0).toLocaleString()} total
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={isLocationTab ? "location" : "device"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="location" onClick={() => setSelectedGroupBy("country")}>
              Location
            </TabsTrigger>
            <TabsTrigger value="device" onClick={() => setSelectedGroupBy("browser_name")}>
              Technology
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {getLocationGrouping().map((groupBy) => (
                <Button
                  key={groupBy}
                  variant={selectedGroupBy === groupBy ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroupBy(groupBy as any)}
                  className="capitalize"
                >
                  {groupBy}
                </Button>
              ))}
            </div>

            {/* Map/Chart Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                Map
              </Button>
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("chart")}
              >
                Chart
              </Button>
            </div>

            {viewMode === "map" ? (
              <div className="space-y-4">
                {/* World Map Placeholder - Interactive regions */}
                <div className="relative bg-muted/20 rounded-lg p-8 min-h-[300px] flex items-center justify-center border border-border/50">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center border-2 border-primary/30">
                      <Globe className="w-16 h-16 text-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground">Interactive Map View</p>
                      <p className="text-sm text-muted-foreground">
                        Hover over regions to see visitor data
                      </p>
                    </div>
                  </div>
                  
                  {/* Sample interactive regions */}
                  <div className="absolute top-6 left-6 space-y-2">
                    {topItems.slice(0, 3).map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 hover:bg-card transition-colors cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full bg-primary"
                          style={{ opacity: Math.max(0.3, item.visitors / Math.max(...topItems.map(i => i.visitors))) }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.visitors.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topItems}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="visitors" 
                      fill="var(--color-visitors)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </TabsContent>

          <TabsContent value="device" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {getDeviceGrouping().map((groupBy) => (
                <Button
                  key={groupBy}
                  variant={selectedGroupBy === groupBy ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroupBy(groupBy as any)}
                  className="capitalize"
                >
                  {groupBy === "browser_name" ? "Browser" : "OS"}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              {topItems.map((item, index) => {
                const IconComponent = selectedGroupBy === "browser_name" 
                  ? getBrowserIcon(item.name) 
                  : Smartphone;
                const maxVisitors = Math.max(...topItems.map(i => i.visitors));
                const percentage = ((item.visitors / maxVisitors) * 100);
                
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-2 bg-primary-soft rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {((item.visitors / chartData.reduce((sum, i) => sum + i.visitors, 0)) * 100).toFixed(1)}%
                          </span>
                          <Badge variant="secondary">
                            {item.visitors.toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {!isLoading && chartData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No visitor data available for the selected period</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}