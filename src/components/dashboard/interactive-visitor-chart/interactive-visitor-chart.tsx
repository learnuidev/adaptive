import { GoalsPanel } from "./goals-panel";
import { LocationPanel } from "./location-panel";
import { PageAndFeaturePanel } from "./page-and-feature-panel";
import { TechPanel } from "./tech-panel";
import { UsersPanel } from "./users-panel";

interface InteractiveVisitorChartProps {
  websiteId: string;
}

export function InteractiveVisitorChart({
  websiteId,
}: InteractiveVisitorChartProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Location */}
        <LocationPanel websiteId={websiteId} />

        <PageAndFeaturePanel websiteId={websiteId} />

        {/* Right Panel - Technology */}
        <TechPanel websiteId={websiteId} />

        <UsersPanel websiteId={websiteId} />
      </div>
    </>
  );
}
