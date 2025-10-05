import { CredentialSelector } from "@/components/credentials/credential-selector";
import { FilterPeriodSelector } from "./filter-period-selector";

export function DesktopFilters() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <CredentialSelector />
      <FilterPeriodSelector />
    </div>
  );
}