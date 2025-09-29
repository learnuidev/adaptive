import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Chrome, Monitor, Smartphone, RefreshCw } from "lucide-react";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function InteractiveVisitorChart({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<"map" | "country" | "region" | "city">("map");
  const [techView, setTechView] = useState<"browser_name" | "os_name">("browser_name");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: locationData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: locationView === "map" ? "country" : locationView,
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

  const getCountryFlag = (countryName: string) => {
    const flags: Record<string, string> = {
      "Canada": "🇨🇦",
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      "Germany": "🇩🇪",
      "France": "🇫🇷",
      "Japan": "🇯🇵",
      "Australia": "🇦🇺",
      "Brazil": "🇧🇷",
      "India": "🇮🇳",
      "China": "🇨🇳",
    };
    return flags[countryName] || "🌍";
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 glass overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
          {/* Left Panel - Location */}
          <div className="bg-card/50 border-r border-border/50 backdrop-blur-sm">
            {/* Location Tabs */}
            <div className="flex border-b border-border/50">
              <div className="flex">
                <Button
                  variant={locationView === "map" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("map")}
                >
                  Map
                </Button>
              </div>
              <div className="w-px bg-border/50 mx-2" />
              <div className="flex">
                <Button
                  variant={locationView === "country" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("country")}
                >
                  Country
                </Button>
                <Button
                  variant={locationView === "region" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("region")}
                >
                  Region
                </Button>
                <Button
                  variant={locationView === "city" ? "secondary" : "ghost"}
                  className="rounded-none h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("city")}
                >
                  City
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="h-[548px] relative">
              {locationView === "map" ? (
                <div className="h-full bg-muted/10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-16 h-16 text-primary">
                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Interactive World Map</p>
                      <p className="text-sm text-muted-foreground">Geographic visitor distribution</p>
                    </div>
                    {locationData && locationData.length > 0 && (
                      <div className="space-y-2 max-w-sm">
                        {locationData.slice(0, 3).map((item, index) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between p-2 bg-card/50 rounded text-sm"
                          >
                            <span className="font-medium">{item.name}</span>
                            <span className="text-primary">{item.visitors}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {locationData?.slice(0, 8).map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {locationView === "country" ? getCountryFlag(item.name) : "📍"}
                          </span>
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">
                          {item.visitors}
                        </span>
                      </div>
                    ))}
                    
                    {(!locationData || locationData.length === 0) && (
                      <div className="text-center text-muted-foreground text-sm mt-8">
                        No data available
                      </div>
                    )}
                  </div>
                  
                  {/* Details Button */}
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
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Technology */}
          <div className="bg-card/50 backdrop-blur-sm">
            {/* Technology Tabs */}
            <div className="flex border-b border-border/50">
              <div className="flex">
                <Button
                  variant={techView === "browser_name" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm flex-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setTechView("browser_name")}
                >
                  Browser
                </Button>
                <Button
                  variant={techView === "os_name" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm flex-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setTechView("os_name")}
                >
                  OS
                </Button>
              </div>
              <div className="w-px bg-border/50 mx-2" />
              <div className="flex">
                <Button
                  variant="ghost"
                  className="rounded-none h-12 text-sm flex-1 text-muted-foreground/50"
                  disabled
                >
                  Device
                </Button>
              </div>
            </div>

            {/* Technology Content */}
            <div className="h-[548px] flex flex-col">
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {techData?.slice(0, 8).map((item, index) => {
                  const IconComponent = techView === "browser_name" ? getBrowserIcon(item.name) : Smartphone;
                  
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/20 rounded">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
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
              
              {/* Details Button */}
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}