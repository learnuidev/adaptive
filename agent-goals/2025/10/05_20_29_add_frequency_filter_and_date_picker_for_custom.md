Task: Add frequency filter and date picker for custom period

Description: In filter-period-selector selector when user selects custom period, show date picker (chadcn) to select start and end date. It should be mobile friendly. Once user selects the date, it should update the filter period to custom and set the start and end date and send this to backend.

status: DONE

## Agent Report

**Report Filed:** 2025-10-05 21:05:00  
**Total Implementation Time:** ~40 minutes

### Changes Made:

- **Completely Redesigned Date Range Picker** (`src/components/analytics/date-range-picker.tsx`) - Beautiful new UI with enhanced styling, proper spacing, and visual feedback
- **Enhanced Date Selection Styling** - Fixed calendar styling with proper highlight colors for selected dates, range middle, and start/end dates
- **Fixed Layout Shift Issue** - Implemented floating date picker with overlay to prevent any layout displacement
- **Added Date Edit Functionality** - Users can now reopen date picker to modify existing custom date ranges
- **Selected Dates Display** - Shows selected date range beside dropdown when custom period is active
- **Improved User Experience** - Date picker opens immediately when custom is selected, with modal-like behavior
- **Enhanced Date Selection Flow** - Added from/to display fields below calendar with clear and apply buttons
- **Fixed Apply Button Behavior** - Apply button now closes the date selector automatically after selection
- **Updated Filter Period Selector** (`src/components/analytics/filter-period-selector.tsx`) - Added floating modal with backdrop and edit functionality
- **Enhanced Mobile Filter Sheet** (`src/components/analytics/mobile-filter-sheet.tsx`) - Applied consistent behavior with date display and edit options

### Key Features:
✅ No layout shift - floating date picker with overlay  
✅ Selected dates displayed beside dropdown  
✅ Edit button to modify existing date ranges  
✅ Beautiful, modern date picker UI with enhanced styling  
✅ Proper date selection highlighting with visible colors  
✅ Modal-like behavior with backdrop click to close  
✅ Apply button closes date selector automatically  
✅ Consistent design across desktop and mobile interfaces
