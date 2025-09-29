import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { TrendData, TrendBuilderForm } from "@/modules/trends/trends.types";
import { BarChart3, TrendingUp } from "lucide-react";

interface TrendResultsChartProps {
  data: TrendData[];
  config: TrendBuilderForm;
}

const chartConfig = {
  trend_value: {
    label: "Trend Value",
    color: "hsl(var(--primary))",
  },
};

export const TrendResultsChart = ({ data, config }: TrendResultsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trend Results
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No trend data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart
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

  // Get unique metadata values for colors
  const metadataValues = [...new Set(data.map(item => item.metadata_value))];
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--muted))",
    "hsl(var(--destructive))",
  ];

  const getTrendTypeLabel = (type: string) => {
    switch (type) {
      case "unique_users": return "Unique Users";
      case "avg_per_user": return "Average per User";
      default: return "Count";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Trend Analysis Results
        </CardTitle>
        <CardDescription>
          {getTrendTypeLabel(config.trendType)} for {config.metadataField} over {config.timeRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time_period" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {metadataValues.map((value, index) => (
                <Line
                  key={value}
                  type="monotone"
                  dataKey={value}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={value}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};