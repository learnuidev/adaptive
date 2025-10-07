import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Monitor, TargetIcon } from "lucide-react";
import { useState } from "react";

import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import {
  DetailsButton,
  TabContent,
  TechList,
} from "./interactive-visitor-chart.components";

interface InteractiveVisitorChartProps {
  websiteId: string;
}

export function UsersPanel({ websiteId }: InteractiveVisitorChartProps) {
  const [techView, setTechView] = useState<string>("users");
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
            value="users"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="cohorts"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Cohorts
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Insights
          </TabsTrigger>
        </TabsList>

        <TabContent value="users">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
        <TabContent value="cohorts">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
        <TabContent value="trends">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
        <TabContent value="insights">
          <div className="min-h-[420px]">
            <TechList data={goalsIntoVisitors || []} icon={getIcon("target")} />
          </div>
          <DetailsButton />
        </TabContent>
      </Tabs>
    </Card>
  );
}
