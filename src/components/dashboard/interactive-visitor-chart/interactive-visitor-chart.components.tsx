import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { countryNames } from "@/lib/country-names";
import { flags } from "@/lib/flags";
import { regionNames } from "@/lib/region-names";
import {
  GetTotalVisitorsByResponse,
  LocationView,
} from "@/modules/analytics/use-get-total-visitors-by";
import { ExpandIcon, Monitor } from "lucide-react";

interface InteractiveVisitorChartProps {
  credentialId: string;
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

const getCountryFlag = (countryName: string) => {
  return flags[countryName] || "🌍";
};

const getCountryName = (countryName: string) => {
  return countryNames[countryName] || "🌍";
};

const getRegionName = (regionName: string) => {
  return regionNames[regionName] || regionName;
};

const getCountryCodeFromLocation = (locationName: string): string => {
  // Extract country code from location strings like "California, US" or "New York, US"
  const parts = locationName.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return '';
};

const getFlagForLocation = (locationName: string, locationType: LocationView): React.ReactNode => {
  if (locationType === 'country') {
    return getCountryFlag(locationName);
  }
  // For regions and cities, try to extract country code and get flag
  const countryCode = getCountryCodeFromLocation(locationName);
  if (countryCode) {
    return getCountryFlag(countryCode);
  }
  return "📍";
};

export function LocationList({ data, locationView }: LocationListProps) {
  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {data
        ?.slice(0, 8)
        .map((item) => (
          <LocationItem
            key={item.name}
            name={
              locationView === "country"
                ? getCountryName(item.name || "")
                : locationView === "region"
                  ? getRegionName(item.name || "")
                  : item.name || ""
            }
            visitors={item.visitors}
            icon={getFlagForLocation(item?.name || "", locationView || "country")}
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
}

export function DetailsButton({
  icon: Icon = ExpandIcon,
  label = "Details",
}: DetailsButtonProps) {
  return (
    <div className="p-4 border-t border-border/50">
      <Button
        variant="ghost"
        className="w-full text-muted-foreground hover:text-foreground"
        size="sm"
      >
        <Icon className="w-4 h-4 mr-2" />
        <span className="uppercase">{label}</span>
      </Button>
    </div>
  );
}
