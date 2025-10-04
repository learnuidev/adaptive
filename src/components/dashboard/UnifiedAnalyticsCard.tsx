import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FilterPeriod } from "@/modules/analytics/analytics.types";
import { Button } from "@/components/ui/button";
import { StickyNote, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { ChartNoteDialog } from "./ChartNoteDialog";
import { useChartNotesStore } from "@/stores/chart-notes-store";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  chartKey: string;
  onAddNote?: (dataPoint: string, label: string) => void;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  chartKey,
  onAddNote,
}: CustomTooltipProps) => {
  const { getNoteForPoint } = useChartNotesStore();
  const existingNote = getNoteForPoint(chartKey, label || "");

  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-lg border border-border/50 shadow-lg min-w-[200px]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="font-semibold text-foreground">{label}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote?.(label || "", label || "");
            }}
          >
            {existingNote ? (
              <MessageSquare className="h-4 w-4 text-primary fill-primary/20" />
            ) : (
              <StickyNote className="h-4 w-4 text-muted-foreground hover:text-primary" />
            )}
          </Button>
        </div>
        
        {existingNote && (
          <div className="mb-3 p-2 rounded bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {existingNote.note}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[hsl(40,50%,60%)]" />
              <span className="text-sm text-muted-foreground">Visitors</span>
            </div>
            <span className="font-medium text-foreground">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[hsl(200,84%,39%)]" />
                <span className="text-sm text-muted-foreground">Page Views</span>
              </div>
              <span className="font-medium text-foreground">
                {payload[1]?.value?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

interface MetricData {
  label: string;
  value: string | number;
  change: number;
  enabled: boolean;
}

interface UnifiedAnalyticsCardProps {
  metrics: MetricData[];
  data: Array<{ name: string; value: number; secondaryValue?: number }>;
  selectedPeriod: FilterPeriod;
  chartKey: string;
  height?: number;
  onToggleMetric?: (index: number) => void;
}

export function UnifiedAnalyticsCard({
  metrics,
  data,
  chartKey,
  height = 400,
  onToggleMetric,
}: UnifiedAnalyticsCardProps) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ dataPoint: string; label: string }>({ 
    dataPoint: "", 
    label: "" 
  });

  const handleAddNote = (dataPoint: string, label: string) => {
    setSelectedDataPoint({ dataPoint, label });
    setNoteDialogOpen(true);
  };

  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return value.toString();
    }
    return value;
  };

  return (
    <>
      <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6 pb-6 border-b border-border/30">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={metric.enabled}
                  onCheckedChange={() => onToggleMetric?.(index)}
                  className="h-3 w-3"
                />
                <label className="text-xs text-muted-foreground uppercase tracking-wide">
                  {metric.label}
                </label>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatValue(metric.value)}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric.change >= 0 ? 'text-primary' : 'text-destructive'
              }`}>
                {metric.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(metric.change).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                domain={[0, 'auto']}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <Tooltip 
                content={<CustomTooltip chartKey={chartKey} onAddNote={handleAddNote} />} 
                cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} 
              />
              <Bar
                yAxisId="left"
                dataKey="value"
                fill="hsl(40, 50%, 60%)"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="secondaryValue"
                stroke="hsl(200, 84%, 39%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: "hsl(200, 84%, 39%)",
                  filter: 'drop-shadow(0 0 6px hsl(200, 84%, 39%))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <ChartNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        chartKey={chartKey}
        dataPoint={selectedDataPoint.dataPoint}
        dataPointLabel={selectedDataPoint.label}
      />
    </>
  );
}
