Task: Add frequency filter and date picker for custom period

Description: In filter-period-selector selector when user selects custom period, show date picker (chadcn) to select start and end date. It should be mobile friendly. Once user selects the date, it should update the filter period to custom and set the start and end date and send this to backend.

status: DONE

## Agent Report

**Report Filed:** 2025-10-05 20:45:00  
**Total Implementation Time:** ~20 minutes

### Changes Made:

- **Created Date Range Picker Component** (`src/components/analytics/date-range-picker.tsx`) - Mobile-friendly calendar using Chadcn UI with react-day-picker for selecting start/end dates
- **Enhanced Filter Period Store** (`src/stores/filter-period-store.ts`) - Added custom date range state management with persistence and proper deserialization
- **Updated Filter Period Selector** (`src/components/analytics/filter-period-selector.tsx`) - Integrated date picker UI that appears when "custom" period is selected
- **Enhanced Mobile Filter Sheet** (`src/components/analytics/mobile-filter-sheet.tsx`) - Added custom date picker support for mobile devices
- **Extended Analytics Types** (`src/modules/analytics/analytics.types.ts`) - Added `CustomDateRange` type for type safety
- **Updated get-summary Query** (`src/modules/analytics/use-get-summary-query.ts`) - Enhanced API to send custom date ranges to backend
- **Created Date Utilities** (`src/utils/date-utils.ts`) - Safe date handling utilities for serialization issues
- **Updated All Analytics Pages** - Integrated custom date range support across dashboard, users, and detail pages

### Key Features:
✅ Custom date range selection with mobile-friendly UI  
✅ Automatic backend integration with proper API formatting  
✅ Robust state persistence across page refreshes  
✅ Full TypeScript support and error handling
