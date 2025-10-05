import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { cityNames } from "@/lib/city-names";
import { countryNames } from "@/lib/country-names";
import { flags } from "@/lib/flags";
import { regionNames } from "@/lib/region-names";
// import { regionNames } from "@/lib/region-names";
import {
  GetTotalVisitorsByResponse,
  LocationView,
} from "@/modules/analytics/use-get-total-visitors-by-query";
import { ExpandIcon, Monitor } from "lucide-react";
import * as React from "react";
import { useCallback, useId, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabelProps, TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface InteractiveVisitorChartProps {
  websiteId: string;
}

interface LocationItemProps {
  name: string;
  visitors: string;
  icon?: React.ReactNode;
}

function LocationItem({ name, visitors, icon = "📍" }: LocationItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <span className="text-sm font-mono text-muted-foreground">
        {visitors}
      </span>
    </div>
  );
}

interface LocationListProps {
  data?: GetTotalVisitorsByResponse;
  icon?: React.ReactNode;
  locationView?: LocationView;
}

export const formatVisitorsValue = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString();

const truncateText = (text: string, maxLength: number) => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  const safeLength = 42;
  return `${text.slice(0, safeLength).trimEnd()}…`;
};

export interface VisitorsBarDatum {
  id: string;
  label: string;
  value: number;
  secondaryLabel?: string;
  labelPrefix?: string;
  labelDescription?: string;
  meta?: unknown;
  [key: string]: unknown;
}

type ChartMargin = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

interface VisitorsBarChartProps {
  data: VisitorsBarDatum[];
  onBarClick?: (datum: VisitorsBarDatum) => void;
  tooltipRenderer?: (datum: VisitorsBarDatum) => React.ReactNode;
  valueFormatter?: (value: number) => string;
  emptyState?: React.ReactNode;
  barSize?: number;
  margin?: ChartMargin;
  className?: string;
  cursorFill?: string;
}

export function VisitorsBarChart({
  data,
  onBarClick,
  tooltipRenderer,
  valueFormatter = formatVisitorsValue,
  emptyState = "No data available",
  barSize = 34,
  margin,
  className,
  cursorFill = "hsl(var(--primary)/0.08)",
}: VisitorsBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const marginConfig = useMemo(
    () => ({
      top: margin?.top ?? 16,
      right: margin?.right ?? 120,
      bottom: margin?.bottom ?? 16,
      left: margin?.left ?? 12,
    }),
    [margin]
  );

  const maxValue = useMemo(() => {
    if (!data?.length) {
      return 0;
    }

    return Math.max(...data.map((item) => item.value));
  }, [data]);

  const gradientBaseId = useId();
  const gradientId = `${gradientBaseId}-bar`;
  const gradientActiveId = `${gradientBaseId}-bar-active`;

  const handleResize = useCallback((width: number, height: number) => {
    setChartSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  const renderPrimaryLabel = useCallback(
    (props: LabelProps) => {
      const { x = 0, y = 0, width = 0, height = 0, viewBox } = props;
      const payload = props.payload as VisitorsBarDatum | undefined;
      const labelText = payload?.label ?? "";
      const labelPrefix = payload?.labelPrefix;
      const labelDescription = payload?.labelDescription?.trim()
        ? payload.labelDescription
        : undefined;

      const derivedX = viewBox?.x ?? x;
      const derivedY = viewBox?.y ?? y;
      const derivedWidth = viewBox?.width ?? width;
      const derivedHeight = viewBox?.height ?? height;

      const barStartX = Number.isFinite(Number(derivedX))
        ? Number(derivedX)
        : Number(x);
      const barWidth = Number.isFinite(Number(derivedWidth))
        ? Number(derivedWidth)
        : Number(width);
      const barHeight = Number.isFinite(Number(derivedHeight))
        ? Number(derivedHeight)
        : Number(height);
      const baseY = Number.isFinite(Number(derivedY))
        ? Number(derivedY) + barHeight / 2
        : Number(y) + Number(height) / 2;

      const fitsInside = true;
      const insideX = barStartX + 16;
      const outsideX = Math.max(barStartX - 16, marginConfig.left);
      const textX = fitsInside ? insideX : outsideX;
      const textAnchor = fitsInside ? "start" : "end";
      const primaryFill = fitsInside
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))";
      const secondaryFill = fitsInside
        ? "hsl(var(--primary-foreground) / 0.7)"
        : "hsl(var(--muted-foreground))";

      const primaryContent = [labelPrefix, labelText, props?.id]
        .filter(Boolean)
        .join(" ")
        .trim();
      const hasSecondary = Boolean(labelDescription);
      const firstLineY = hasSecondary ? baseY - 6 : baseY;

      const approximateCharWidth = 7.25;
      const insideAvailable = Math.max(barWidth - 40, 56);
      const outsideAvailable = Math.max(barStartX - marginConfig.left - 16, 56);
      const maxChars = Math.max(
        10,
        Math.floor(
          (fitsInside ? insideAvailable : outsideAvailable) /
            approximateCharWidth
        )
      );
      const displayedPrimary = truncateText(primaryContent, maxChars);

      if (!displayedPrimary && !labelDescription) {
        return null;
      }

      return (
        <g>
          {displayedPrimary ? (
            <text
              x={textX}
              y={firstLineY}
              fill={primaryFill}
              fontSize={14}
              fontWeight={600}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              pointerEvents="none"
              style={{ paintOrder: "stroke" }}
              stroke={
                fitsInside
                  ? "hsl(var(--primary-foreground) / 0.2)"
                  : "transparent"
              }
              strokeWidth={fitsInside ? 1.5 : 0}
            >
              {displayedPrimary}
            </text>
          ) : null}
          {labelDescription ? (
            <text
              x={textX}
              y={firstLineY + 14}
              fill={secondaryFill}
              fontSize={11}
              fontWeight={500}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              pointerEvents="none"
            >
              {labelDescription}
            </text>
          ) : null}
        </g>
      );
    },
    [marginConfig.left]
  );

  const renderValueLabel = useCallback(
    (props: LabelProps) => {
      const { x = 0, y = 0, width = 0, height = 0, viewBox } = props;
      const payload = props.payload as VisitorsBarDatum | undefined;
      const rawValue =
        typeof props.value === "number"
          ? props.value
          : props.value
            ? Number(props.value)
            : payload?.value;

      if (
        rawValue === undefined ||
        rawValue === null ||
        Number.isNaN(rawValue)
      ) {
        return null;
      }

      const numericValue = Number(rawValue);

      const baseX =
        (viewBox?.x ?? 0) +
        Math.max(chartSize.width - marginConfig.right, 0) +
        marginConfig.right * 0.6;
      const fallbackX = Number(x) + Number(width) + marginConfig.right * 0.6;
      const anchorX = chartSize.width ? baseX : fallbackX;
      const textY = Number(y) + Number(height) / 2;

      return (
        <text
          x={anchorX}
          y={textY}
          fill="hsl(var(--foreground))"
          fontSize={13}
          fontWeight={700}
          dominantBaseline="middle"
          textAnchor="end"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {valueFormatter(numericValue)}
        </text>
      );
    },
    [chartSize.width, marginConfig.right, valueFormatter]
  );

  const tooltipContent = useCallback(
    ({ active, payload }: TooltipProps<ValueType, NameType>) => {
      if (!active || !payload?.length) {
        return null;
      }

      const datum = payload[0]?.payload as VisitorsBarDatum | undefined;

      if (!datum) {
        return null;
      }

      if (tooltipRenderer) {
        return tooltipRenderer(datum);
      }

      return (
        <div className="rounded-md border border-border/60 bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
          <p className="text-sm font-semibold">{datum.label}</p>
          {datum.secondaryLabel && datum.secondaryLabel !== datum.label ? (
            <p className="break-all text-xs text-muted-foreground">
              {datum.secondaryLabel}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {valueFormatter(datum.value)} visitors
          </p>
        </div>
      );
    },
    [tooltipRenderer, valueFormatter]
  );

  if (!data?.length) {
    const empty =
      typeof emptyState === "string" ? <span>{emptyState}</span> : emptyState;

    return (
      <div
        className={`flex h-full w-full items-center justify-center text-sm text-muted-foreground${className ? ` ${className}` : ""}`}
      >
        {empty}
      </div>
    );
  }

  return (
    <div className={`h-full w-full${className ? ` ${className}` : ""}`}>
      <ResponsiveContainer width="100%" height="100%" onResize={handleResize}>
        <BarChart data={data} layout="vertical" margin={marginConfig}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.85}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.55}
              />
            </linearGradient>

            <linearGradient id={gradientActiveId} x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.75}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={false}
            stroke="hsl(var(--border)/0.4)"
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            domain={[0, maxValue ? maxValue * 1.1 : 10]}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis
            dataKey="label"
            type="category"
            width={0}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <RechartTooltip
            cursor={{ fill: cursorFill }}
            content={tooltipContent}
          />
          <Bar
            dataKey="value"
            radius={[0, 999, 999, 0]}
            barSize={barSize}
            onClick={
              onBarClick
                ? (event) => {
                    const datum = event?.payload as
                      | VisitorsBarDatum
                      | undefined;
                    if (datum) {
                      onBarClick(datum);
                    }
                  }
                : undefined
            }
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <LabelList
              className="text-foreground"
              position="insideLeft"
              dataKey="label"
              content={renderPrimaryLabel}
            />

            <LabelList
              position="right"
              dataKey="value"
              content={renderValueLabel}
            />
            {data.map((item, index) => (
              <Cell
                key={`${item.id}-${index}`}
                cursor={onBarClick ? "pointer" : "default"}
                fill={
                  hoveredIndex === index
                    ? `url(#${gradientActiveId})`
                    : `url(#${gradientId})`
                }
                fillOpacity={hoveredIndex === index ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const getCountryFlag = (countryName: string) => {
  return flags[countryName] || "🌍";
};
const getRegionFlag = (countryName: string) => {
  return regionNames[countryName]?.countryFlag || "🌍";
};
const getCityFlag = (countryName: string) => {
  return cityNames[countryName]?.countryFlag || "🌍";
};

const getCountryName = (countryName: string) => {
  return countryNames[countryName] || "🌍";
};

const getRegionName = (regionName: string) => {
  return regionNames[regionName]?.regionName || regionName;
};

const getCountryCodeFromLocation = (locationName: string): string => {
  // Extract country code from location strings like "California, US" or "New York, US"
  const parts = locationName.split(",");
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return "";
};

const getFlagForLocation = (
  locationName: string,
  locationType: LocationView
): React.ReactNode => {
  if (locationType === "country") {
    return getCountryFlag(locationName);
  }

  if (locationType === "region") {
    return getRegionFlag(locationName);
  }

  if (locationType === "city") {
    return getCityFlag(locationName);
  }

  // For regions and cities, try to extract country code and get flag
  const countryCode = getCountryCodeFromLocation(locationName);
  if (countryCode) {
    return getCountryFlag(countryCode);
  }
  return "📍";
};

export const getLocationDisplayName = (
  locationName: string,
  locationType: LocationView
): string => {
  if (locationType === "country") {
    return getCountryName(locationName || "") || locationName || "";
  }

  if (locationType === "region") {
    return getRegionName(locationName || "") || locationName || "";
  }

  return locationName || "";
};

export const getLocationIcon = (
  locationName: string,
  locationType: LocationView
) => getFlagForLocation(locationName, locationType);

export function LocationList({ data, locationView }: LocationListProps) {
  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {data
        ?.slice(0, 8)
        .map((item) => (
          <LocationItem
            key={item.name}
            name={getLocationDisplayName(
              item.name || "",
              locationView || "country"
            )}
            visitors={item.visitors}
            icon={getLocationIcon(item?.name || "", locationView || "country")}
          />
        ))}
      {(!data || data.length === 0) && (
        <div className="text-center text-muted-foreground text-sm mt-8">
          No data available
        </div>
      )}
    </div>
  );
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabContent({ value, children }: TabContentProps) {
  return (
    <TabsContent value={value} className="mt-0 flex flex-col">
      {children}
    </TabsContent>
  );
}

interface MapLegendProps {}

export function MapLegend({}: MapLegendProps) {
  return (
    <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded p-3 border border-border/50">
      <p className="text-xs font-medium text-foreground mb-2">Visitors</p>
      <div className="flex items-center gap-2 text-xs">
        <div
          className="w-3 h-3 rounded"
          style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
        ></div>
        <span className="text-muted-foreground">No data</span>
      </div>
      <div className="flex items-center gap-2 text-xs mt-1">
        <div
          className="w-3 h-3 rounded"
          style={{ backgroundColor: "hsl(var(--primary) / 0.8)" }}
        ></div>
        <span className="text-muted-foreground">High traffic</span>
      </div>
    </div>
  );
}

interface TechItemProps {
  name: string;
  visitors: string;
  icon?: React.ElementType;
}

function TechItem({ name, visitors, icon: Icon = Monitor }: TechItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-primary/20 rounded">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <span className="text-sm font-mono text-muted-foreground">
        {visitors}
      </span>
    </div>
  );
}

interface TechListProps {
  data?: GetTotalVisitorsByResponse;
  icon?: React.ElementType;
}

export function TechList({ data, icon: Icon = Monitor }: TechListProps) {
  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {data
        ?.slice(0, 8)
        .map((item) => (
          <TechItem
            key={item.name}
            name={item.name}
            visitors={item.visitors}
            icon={Icon}
          />
        ))}
      {(!data || data.length === 0) && (
        <div className="text-center text-muted-foreground text-sm mt-8">
          No data available
        </div>
      )}
    </div>
  );
}

interface DetailsButtonProps {
  icon?: React.ElementType;
  label?: string;
  onClick?: () => void;
}

export function DetailsButton({
  icon: Icon = ExpandIcon,
  label = "Details",
  onClick,
}: DetailsButtonProps) {
  return (
    <div className="p-4 border-t border-border/50">
      <Button
        variant="ghost"
        className="w-full text-muted-foreground hover:text-foreground"
        size="sm"
        type="button"
        onClick={onClick}
      >
        <Icon className="w-4 h-4 mr-2" />
        <span className="uppercase">{label}</span>
      </Button>
    </div>
  );
}

interface AnalyticsDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
  entityLabel?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function AnalyticsDetailsDialog({
  open,
  onOpenChange,
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  totalCount,
  filteredCount,
  entityLabel = "items",
  header,
  children,
}: AnalyticsDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(90vw,80rem)] max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="sm:max-w-xs"
            />
            <span className="text-xs text-muted-foreground sm:text-right">
              Showing {filteredCount} of {totalCount} {entityLabel}
            </span>
          </div>
          {header ? header : null}
          <div className="max-h-[460px] overflow-y-auto rounded-md border border-border/50 bg-muted/10">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
