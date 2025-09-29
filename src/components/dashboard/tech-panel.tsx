import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { flags } from "@/lib/flags";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import {
  Chrome,
  ExpandIcon,
  Monitor,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function TechPanel({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<
    "map" | "country" | "region" | "city"
  >("map");
  const [techView, setTechView] = useState<
    "browser_name" | "os_name" | "device"
  >("browser_name");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: techData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: techView,
  });

  const getBrowserIcon = (name: string) => {
    if (name?.toLowerCase().includes("chrome")) return Chrome;
    return Monitor;
  };

  const getCountryFlag = (countryName: string) => {
    return flags[countryName] || "🌍";
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs value={techView} onValueChange={(v) => setTechView(v as any)}>
        <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0 h-12">
          <TabsTrigger
            value="browser_name"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Browser
          </TabsTrigger>
          <TabsTrigger
            value="os_name"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            OS
          </TabsTrigger>
          <TabsTrigger
            value="device"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Device
          </TabsTrigger>
        </TabsList>

        {/* Technology Content */}
        <TabsContent value="browser_name" className="mt-0 flex flex-col">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {techData?.slice(0, 8).map((item) => {
              const IconComponent = getBrowserIcon(item.name);
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/20 rounded">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {item.visitors}
                  </span>
                </div>
              );
            })}
            {(!techData || techData.length === 0) && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                No data available
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              size="sm"
            >
              <ExpandIcon className="w-4 h-4 mr-2" />
              <span className="uppercase">Details</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="os_name" className="mt-0 flex flex-col">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {techData?.slice(0, 8).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/20 rounded">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {item.visitors}
                </span>
              </div>
            ))}
            {(!techData || techData.length === 0) && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                No data available
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              DETAILS
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="device" className="mt-0 flex flex-col">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {techData?.slice(0, 8).map((item) => {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/20 rounded">
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {item.visitors}
                  </span>
                </div>
              );
            })}
            {(!techData || techData.length === 0) && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                No data available
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              DETAILS
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
