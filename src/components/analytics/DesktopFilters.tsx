import { CredentialSelector } from "@/components/credentials/CredentialSelector";
import { FilterPeriodSelector } from "./FilterPeriodSelector";

export function DesktopFilters() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <CredentialSelector />
      <FilterPeriodSelector />
    </div>
  );
}