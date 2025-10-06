import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CustomDateRange } from "@/modules/analytics/analytics.types";
import { safeParseDate, safeFormatDate } from "@/utils/date-utils";

interface DateRangePickerProps {
  value?: CustomDateRange;
  onApply: (dateRange: CustomDateRange) => void;
  onClear: () => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onApply,
  onClear,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<{
    from?: Date;
    to?: Date;
  }>({
    from: value?.startDate ? safeParseDate(value.startDate) : undefined,
    to: value?.endDate ? safeParseDate(value.endDate) : undefined,
  });

  const handleDateChange = (newDate: { from?: Date; to?: Date }) => {
    setDate(newDate);
  };

  const handleClear = () => {
    setDate({ from: undefined, to: undefined });
    onClear();
  };

  const handleApply = () => {
    if (date.from && date.to) {
      onApply({
        startDate: date.from,
        endDate: date.to,
      });
    }
  };

  const isCompleteRange = date.from && date.to;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Calendar */}
      <div className="bg-background rounded-lg border p-4 shadow-sm">
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={2}
          className="mx-auto"
          classNames={{
            months: "flex flex-col sm:flex-row gap-4",
            month: "flex flex-col gap-4",
            caption: "flex justify-center items-center relative h-12",
            caption_label: "text-sm font-medium",
            nav: "flex gap-1",
            nav_button: "h-8 w-8 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground text-sm font-normal w-9 h-9",
            row: "flex w-full mt-2",
            cell: "relative h-9 w-9 text-center text-sm p-0",
            day: cn(
              "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            ),
            day_range_end: cn(
              "rounded-r-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            ),
            day_selected: cn(
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold"
            ),
            day_today: cn(
              "bg-accent text-accent-foreground font-semibold border border-primary/20"
            ),
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
            day_range_middle: cn(
              "bg-primary/20 text-accent-foreground font-medium"
            ),
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Selected Dates Display */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              From
            </label>
            <div className="bg-background rounded-md border px-3 py-2 text-foreground">
              {date.from ? safeFormatDate(date.from) : "Select date"}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              To
            </label>
            <div className="bg-background rounded-md border px-3 py-2 text-foreground">
              {date.to ? safeFormatDate(date.to) : "Select date"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button
          onClick={handleApply}
          disabled={!isCompleteRange}
          className="flex-1"
        >
          <Check className="h-4 w-4 mr-2" />
          Apply
        </Button>
      </div>
    </div>
  );
}
