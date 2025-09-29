import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GetTotalVisitorsByResponse,
  useGetTotalVisitorsByQuery,
} from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Chrome, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { useState } from "react";

import {
  DetailsButton,
  TabContent,
  TechList,
} from "./interactive-visitor-chart.components";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function TechPanel({ credentialId }: InteractiveVisitorChartProps) {
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

        <TabContent value="browser_name">
          <div className="min-h-[420px]">
            <TechList
              data={techData}
              icon={getBrowserIcon(techData?.[0]?.name)}
            />
          </div>
          <DetailsButton />
        </TabContent>

        <TabContent value="os_name">
          <div className="min-h-[420px]">
            <TechList data={techData} icon={Smartphone} />
          </div>
          <DetailsButton />
        </TabContent>

        <TabContent value="device">
          <div className="min-h-[420px]">
            <TechList data={techData} icon={Smartphone} />
          </div>
          <DetailsButton />
        </TabContent>
      </Tabs>
    </Card>
  );
}
