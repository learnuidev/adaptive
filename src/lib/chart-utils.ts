import { FilterPeriod } from "@/modules/analytics/analytics.types";
import { VisitorCount } from "@/modules/analytics/use-get-summary-query";

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DeviceDataPoint {
  name: string;
  value: number;
  fill: string;
}

export function buildChartData(
  selectedPeriod: FilterPeriod,
  totalVisitors: VisitorCount[]
): ChartDataPoint[] {
  if (!totalVisitors) return [];

  const raw = totalVisitors;
  const filled: ChartDataPoint[] = [];

  // Decide granularity from the first item that has a key
  const first = raw.find((it) => it?.day || it?.hour || it?.month);
  if (!first) return [];

  if (first.day) {
    // ---------- WEEK (7 days) ----------
    // Reorder days so Monday is first and Sunday is last
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = new Map<string, number>();
    raw.forEach((it) => {
      if (it?.day) {
        const d = new Date(it.day);
        // Adjust day index so Monday (1) maps to 0
        const dayIndex = (d.getDay() + 6) % 7;
        map.set(days[dayIndex], Number(it.total) || 0);
      }
    });
    days.forEach((d) => filled.push({ name: d, value: map.get(d) || 0 }));
  } else if (first.hour) {
    // ---------- DAY (24 hours) ----------
    const map = new Map<number, number>();
    raw.forEach((it) => {
      if (it?.hour)
        map.set(new Date(it.hour).getHours(), Number(it.total) || 0);
    });
    Array.from({ length: 24 }, (_, h) => h).forEach((h) =>
      filled.push({ name: `${h}:00`, value: map.get(h) || 0 })
    );
  } else if (first.month) {
    // ---------- YEAR (12 months) ----------
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const map = new Map<number, number>();
    raw.forEach((it) => {
      if (it?.month) {
        const str = String(it.month);
        const m = Number(str.slice(4, 6)); // 1-12
        map.set(m - 1, Number(it.total) || 0);
      }
    });
    monthNames.forEach((name, idx) =>
      filled.push({ name, value: map.get(idx) || 0 })
    );
  }

  // If selectedPeriod is 'month', override labels to "Month Day"
  if (["month", "last30d"].includes(selectedPeriod) && first.day) {
    const dayMap = new Map<string, number>();
    raw.forEach((it) => {
      if (it?.day) {
        const d = new Date(it.day);
        const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
        dayMap.set(iso, Number(it.total) || 0);
      }
    });

    // Build array in chronological order
    const sorted = Array.from(dayMap.keys()).sort();

    // Fill missing days with 0
    const filledMonth: ChartDataPoint[] = [];
    if (sorted.length > 0) {
      const firstDate = new Date(sorted[0]);
      const lastDate = new Date(sorted[sorted.length - 1]);
      const dayMs = 24 * 60 * 60 * 1000;
      for (
        let d = new Date(firstDate);
        d <= lastDate;
        d.setTime(d.getTime() + dayMs)
      ) {
        const iso = d.toISOString().slice(0, 10);
        const monthName = d.toLocaleString("en-US", { month: "long" });
        const day = d.getDate();
        const label = `${monthName} ${day}`;
        const value = dayMap.get(iso) || 0;
        filledMonth.push({ name: label, value });
      }
    }
    return filledMonth;
  }

  return filled;
}

export function buildDeviceChartData(
  devices: { name: string; value: number }[]
): DeviceDataPoint[] {
  const colors = [
    "#8884d8", // Purple
    "#82ca9d", // Green
    "#ffc658", // Yellow
    "#ff7300", // Orange
    "#0088fe", // Blue
    "#00c49f", // Teal
  ];

  return devices.map((device, index) => ({
    name: device.name,
    value: device.value,
    fill: colors[index % colors.length],
  }));
}

export function combineChartData(
  currentData: ChartDataPoint[],
  previousData: ChartDataPoint[]
): Array<ChartDataPoint & { previous: number }> {
  return currentData.map((item, index) => ({
    ...item,
    previous: previousData[index]?.value || 0,
  }));
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatChartDataValue(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}
