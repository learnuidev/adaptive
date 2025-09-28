import { MobileFilterSheet } from "./MobileFilterSheet";
import { DesktopFilters } from "./DesktopFilters";

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