import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GetTotalVisitorsByResponse,
  useGetTotalVisitorsByQuery,
} from "@/modules/analytics/use-get-total-visitors-by-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import {
  Chrome,
  Monitor,
  RefreshCw,
  Smartphone,
  TargetIcon,
} from "lucide-react";
import { useState } from "react";

import {
  DetailsButton,
  TabContent,
  TechList,
} from "./interactive-visitor-chart.components";
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";

interface InteractiveVisitorChartProps {
  websiteId: string;
}

export function GoalsPanel({ websiteId }: InteractiveVisitorChartProps) {
  const [techView, setTechView] = useState<"goals">("goals");
  const { selectedPeriod, customDateRange } = useFilterPeriodStore();

  const getIcon = (name: string) => {
    if (name?.toLowerCase().includes("target")) return TargetIcon;
    return Monitor;
  };

  const { data: summary } = useGetSummaryQuery({
    websiteId: websiteId,
    period: selectedPeriod,
    customDateRange: selectedPeriod === "custom" ? customDateRange : undefined,
  });

  const goalsIntoVisitors: any = summary?.goalsCount?.map((gc) => {
    return {
      name: gc.goal,
      visitors: Number(gc.count) || 0,
    };
  });

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs value={techView} onValueChange={(v) => setTechView(v as any)}>
        <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0 h-12">
          <TabsTrigger
            value="goals"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Goals
          </TabsTrigger>
          <TabsTrigger
            value="journeys"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Journeys
          </TabsTrigger>
          <TabsTrigger
            value="funnels"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Funnels
          </TabsTrigger>
        </TabsList>

        <TabContent value="goals">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
        <TabContent value="journeys">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
        <TabContent value="funnels">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
      </Tabs>
    </Card>
  );
}
