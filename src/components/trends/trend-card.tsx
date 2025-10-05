import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { BarChart3, List, Clock, Trash2, RefreshCw } from "lucide-react";
import { TrendItem, TrendVariant } from "@/modules/trends/trends.types";

interface TrendCardProps {
  trend: TrendItem;
  onRefresh: (id: string) => void;
  onDelete: (id: string) => void;
}

const getTrendIcon = (type: TrendVariant) => {
  switch (type) {
    case "analytics": return BarChart3;
    case "top-values": return List;
    case "timeline": return Clock;
    default: return BarChart3;
  }
};

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

export const TrendCard = ({ trend, onRefresh, onDelete }: TrendCardProps) => {
  const Icon = getTrendIcon(trend.type);

  const renderChart = () => {
    if (trend.isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (trend.error) {
      return (
        <div className="flex items-center justify-center h-64 text-destructive">
          Error loading trend data
        </div>
      );
    }

    if (!trend.data || trend.data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available
        </div>
      );
    }

    if (trend.type === "top-values") {
      const data = trend.data as any[];
      return (
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="metadata_value" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="event_count" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }

    if (trend.type === "timeline") {
      const data = trend.data as any[];
      return (
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time_period" 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="event_count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Events"
              />
              <Line 
                type="monotone" 
                dataKey="daily_users" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }

    // Analytics trend (default)
    const data = trend.data as any[];
    const chartData = data.reduce((acc, item) => {
      const existingItem = acc.find(x => x.time_period === item.time_period);
      if (existingItem) {
        existingItem[item.metadata_value] = item.trend_value;
      } else {
        acc.push({
          time_period: item.time_period,
          [item.metadata_value]: item.trend_value,
        });
      }
      return acc;
    }, [] as any[]);

    const metadataValues = [...new Set(data.map(item => item.metadata_value))];
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))",
      "hsl(var(--muted))",
      "hsl(var(--destructive))",
    ];

    return (
      <ChartContainer config={chartConfig} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time_period" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {metadataValues.slice(0, 5).map((value, index) => (
              <Line
                key={value}
                type="monotone"
                dataKey={value}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={value}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <div>
              <CardTitle className="text-base">{trend.title}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {trend.type === "analytics" && `Analytics for ${(trend.config as any).metadataField}`}
                {trend.type === "top-values" && `Top ${(trend.config as any).topN} values for ${(trend.config as any).metadataField}`}
                {trend.type === "timeline" && `Timeline for ${(trend.config as any).metadataField}: ${(trend.config as any).metadataValue}`}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRefresh(trend.id)}
              disabled={trend.isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${trend.isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(trend.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};