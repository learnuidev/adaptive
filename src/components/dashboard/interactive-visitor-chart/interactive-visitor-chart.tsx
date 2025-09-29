import { LocationPanel } from "./location-panel";
import { TechPanel } from "./tech-panel";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function InteractiveVisitorChart({
  credentialId,
}: InteractiveVisitorChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Location */}
      <LocationPanel credentialId={credentialId} />

      {/* Right Panel - Technology */}
      <TechPanel credentialId={credentialId} />
    </div>
  );
}
