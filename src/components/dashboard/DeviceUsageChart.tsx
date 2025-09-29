import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Monitor, Smartphone, Tablet } from "lucide-react";

type UserDevice = {
  os_name: string;
  os_version: string;
  browser_name: string;
  browser_version: string;
  device_vendor: string;
  device_model: string;
  percentageUsed: number;
};

interface DeviceUsageChartProps {
  devices: UserDevice[];
}

const getDeviceIcon = (deviceModel: string, osName: string) => {
  const model = deviceModel.toLowerCase();
  const os = osName.toLowerCase();
  
  if (model.includes('iphone') || model.includes('android') || os.includes('ios') || os.includes('android')) {
    return <Smartphone className="h-4 w-4" />;
  }
  if (model.includes('ipad') || model.includes('tablet')) {
    return <Tablet className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(var(--destructive))',
];

export const DeviceUsageChart = ({ devices }: DeviceUsageChartProps) => {
  const chartData = devices.map((device, index) => ({
    name: `${device.device_model} (${device.os_name})`,
    value: device.percentageUsed,
    browser: device.browser_name,
    os: `${device.os_name} ${device.os_version}`,
    browserVersion: device.browser_version,
    vendor: device.device_vendor,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            {getDeviceIcon(data.name, data.os)}
            <p className="font-medium">{data.name}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Usage:</span> {data.value.toFixed(1)}%</p>
            <p><span className="text-muted-foreground">Browser:</span> {data.browser} {data.browserVersion}</p>
            <p><span className="text-muted-foreground">OS:</span> {data.os}</p>
            <p><span className="text-muted-foreground">Vendor:</span> {data.vendor}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {getDeviceIcon(entry.payload.name, entry.payload.os)}
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.payload.name.split('(')[0].trim()} ({entry.payload.value.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!devices || devices.length === 0) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No device data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Device Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};