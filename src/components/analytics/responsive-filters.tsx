import { MobileFilterSheet } from "./mobile-filter-sheet";
import { DesktopFilters } from "./desktop-filters";

export function ResponsiveFilters() {
  return (
    <>
      {/* Mobile Filters */}
      <div className="md:hidden">
        <MobileFilterSheet />
      </div>
      
      {/* Desktop Filters */}
      <DesktopFilters />
    </>
  );
}