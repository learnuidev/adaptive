import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Chrome, Monitor, Smartphone } from "lucide-react";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function InteractiveVisitorChart({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<"country" | "region" | "city">("country");
  const [techView, setTechView] = useState<"browser_name" | "os_name">("browser_name");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: locationData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: locationView,
  });

  const { data: techData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: techView,
  });

  const getBrowserIcon = (name: string) => {
    if (name?.toLowerCase().includes("chrome")) return Chrome;
    return Monitor;
  };

  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
          {/* Left Panel - Map & Location */}
          <div className="bg-muted/20 border-r border-border/50">
            {/* Location Tabs */}
            <div className="flex border-b border-border/50">
              <Button
                variant={locationView === "country" ? "default" : "ghost"}
                className="rounded-none border-r border-border/50 h-12 text-sm"
                onClick={() => setLocationView("country")}
              >
                Map
              </Button>
              <Button
                variant={locationView === "country" ? "secondary" : "ghost"}
                className="rounded-none border-r border-border/50 h-12 text-sm"
                onClick={() => setLocationView("country")}
              >
                Country
              </Button>
              <Button
                variant={locationView === "region" ? "secondary" : "ghost"}
                className="rounded-none border-r border-border/50 h-12 text-sm"
                onClick={() => setLocationView("region")}
              >
                Region
              </Button>
              <Button
                variant={locationView === "city" ? "secondary" : "ghost"}
                className="rounded-none h-12 text-sm"
                onClick={() => setLocationView("city")}
              >
                City
              </Button>
            </div>

            {/* Map View */}
            <div className="relative h-[452px] bg-slate-900 flex items-center justify-center">
              {/* World Map SVG Outline */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full absolute inset-0"
                style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))" }}
              >
                {/* North America - highlighted region */}
                <path
                  d="M150 150 L300 120 L350 180 L300 250 L200 280 L120 220 Z"
                  fill="rgb(59, 130, 246)"
                  fillOpacity="0.8"
                  stroke="rgb(147, 197, 253)"
                  strokeWidth="1"
                  className="hover:fill-opacity-100 transition-all cursor-pointer"
                />
                
                {/* Europe */}
                <path
                  d="M400 140 L480 130 L520 160 L480 200 L420 190 Z"
                  fill="rgb(30, 41, 59)"
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  className="hover:fill-blue-500 hover:fill-opacity-60 transition-all cursor-pointer"
                />
                
                {/* Asia */}
                <path
                  d="M520 120 L700 110 L750 180 L680 220 L550 200 Z"
                  fill="rgb(30, 41, 59)"
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  className="hover:fill-blue-500 hover:fill-opacity-60 transition-all cursor-pointer"
                />
                
                {/* Africa */}
                <path
                  d="M400 220 L480 210 L520 280 L480 350 L420 340 Z"
                  fill="rgb(30, 41, 59)"
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  className="hover:fill-blue-500 hover:fill-opacity-60 transition-all cursor-pointer"
                />
                
                {/* South America */}
                <path
                  d="M250 300 L320 290 L340 380 L280 420 L220 400 Z"
                  fill="rgb(30, 41, 59)"
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  className="hover:fill-blue-500 hover:fill-opacity-60 transition-all cursor-pointer"
                />
                
                {/* Australia */}
                <path
                  d="M650 320 L720 310 L740 350 L700 370 L660 360 Z"
                  fill="rgb(30, 41, 59)"
                  stroke="rgb(51, 65, 85)"
                  strokeWidth="1"
                  className="hover:fill-blue-500 hover:fill-opacity-60 transition-all cursor-pointer"
                />
              </svg>
              
              {/* Visitor Data Overlay */}
              <div className="absolute top-4 left-4 space-y-2">
                {locationData?.slice(0, 3).map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded px-3 py-2 text-white"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-blue-300">{item.visitors}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Technology */}
          <div className="bg-card">
            {/* Technology Tabs */}
            <div className="flex border-b border-border/50">
              <Button
                variant={techView === "browser_name" ? "secondary" : "ghost"}
                className="rounded-none border-r border-border/50 h-12 text-sm flex-1"
                onClick={() => setTechView("browser_name")}
              >
                Browser
              </Button>
              <Button
                variant={techView === "os_name" ? "secondary" : "ghost"}
                className="rounded-none border-r border-border/50 h-12 text-sm flex-1"
                onClick={() => setTechView("os_name")}
              >
                OS
              </Button>
              <Button
                variant="ghost"
                className="rounded-none h-12 text-sm flex-1"
                disabled
              >
                Device
              </Button>
            </div>

            {/* Technology List */}
            <div className="p-4 space-y-3 h-[452px] overflow-y-auto">
              {techData?.slice(0, 10).map((item, index) => {
                const IconComponent = techView === "browser_name" ? getBrowserIcon(item.name) : Smartphone;
                
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-500/20 rounded">
                        <IconComponent className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium">{item.name}</span>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}