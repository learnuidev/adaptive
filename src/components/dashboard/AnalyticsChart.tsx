import { Card } from "@/components/ui/card";
import { FilterPeriod } from "@/modules/analytics/analytics.types";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  Tooltip,
  TooltipProps,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-lg border border-border/50 shadow-lg min-w-[200px]">
        <p className="font-semibold text-foreground mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[hsl(200,84%,39%)]" />
              <span className="text-sm text-muted-foreground">Visitors</span>
            </div>
            <span className="font-medium text-foreground">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[hsl(40,50%,60%)]" />
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

function formatPeriodSubtitle(period: FilterPeriod): string {
  switch (period) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "day":
      return "Day";
    case "week":
      return "This week";
    case "month":
      return "This month";
    case "year":
      return "This year";
    case "last24h":
      return "Last 24 hours";
    case "last7d":
      return "Last 7 days";
    case "last30d":
      return "Last 30 days";
    case "last12m":
      return "Last 12 months";
    case "wtd":
      return "Week to date";
    case "mtd":
      return "Month to date";
    case "ytd":
      return "Year to date";
    case "all":
      return "All time";
    case "custom":
      return "Custom range";
    default:
      return "";
  }
}
interface AnalyticsChartProps {
  title: string;
  colorPalette: "green" | "orange" | "blue";
  selectedPeriod: FilterPeriod;
  data: Array<{ name: string; value: number; [key: string]: any }>;
  previousData?: Array<{ name: string; value: number; [key: string]: any }>;
  secondaryData?: Array<{ name: string; value: number; [key: string]: any }>;
  height?: number;
  color?: string;
  type?: "line" | "area" | "composed";
  chartKey: string;
  secondaryLabel?: string;
}

export function AnalyticsChart({
  title,
  selectedPeriod,
  previousData,
  colorPalette,
  chartKey,
  data,
  secondaryData,
  height = 300,
  type = "area",
  secondaryLabel,
}: AnalyticsChartProps) {
  const subtitle = formatPeriodSubtitle(selectedPeriod);

  const colorPaletteMap = {
    green: "hsl(160, 84%, 39%)",
    orange: "hsl(40, 50%, 60%)",
    blue: "hsl(200, 84%, 39%)",
  };

  const color = colorPaletteMap[colorPalette];

  const previousDataColor = "hsl(40, 50%, 60%)";

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "composed" ? (
            <ComposedChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} />
              <Bar
                yAxisId="right"
                dataKey="secondaryValue"
                fill="hsl(40, 50%, 60%)"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
                onMouseEnter={(data, index) => {
                  // Dim other bars
                  const bars = document.querySelectorAll('.recharts-bar-rectangle');
                  bars.forEach((bar, i) => {
                    if (i !== index) {
                      (bar as HTMLElement).style.opacity = '0.3';
                    } else {
                      (bar as HTMLElement).style.filter = 'drop-shadow(0 0 8px hsl(40, 50%, 60%))';
                      (bar as HTMLElement).style.opacity = '1';
                    }
                  });
                }}
                onMouseLeave={() => {
                  // Reset all bars
                  const bars = document.querySelectorAll('.recharts-bar-rectangle');
                  bars.forEach((bar) => {
                    (bar as HTMLElement).style.opacity = '0.8';
                    (bar as HTMLElement).style.filter = 'none';
                  });
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: color,
                  filter: 'drop-shadow(0 0 6px hsl(200, 84%, 39%))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
                strokeDasharray=""
                onMouseEnter={() => {
                  // Add glow to line
                  const lines = document.querySelectorAll('.recharts-line-curve');
                  lines.forEach((line) => {
                    (line as HTMLElement).style.filter = 'drop-shadow(0 0 4px hsl(200, 84%, 39%))';
                  });
                }}
                onMouseLeave={() => {
                  // Remove glow from line
                  const lines = document.querySelectorAll('.recharts-line-curve');
                  lines.forEach((line) => {
                    (line as HTMLElement).style.filter = 'none';
                  });
                }}
              />
            </ComposedChart>
          ) : type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={chartKey} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              {previousData && (
                <Line
                  type="monotone"
                  dataKey="value"
                  data={previousData}
                  stroke={previousDataColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fillOpacity={1}
                fill={`url(#${chartKey})`}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              {previousData && (
                <Line
                  type="monotone"
                  dataKey="value"
                  data={previousData}
                  stroke={previousDataColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
