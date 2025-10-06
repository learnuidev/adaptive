import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomDateRange } from "@/modules/analytics/analytics.types";
import { safeParseDate } from "@/utils/date-utils";

interface DateRangePickerProps {
  value?: CustomDateRange;
  onChange: (dateRange: CustomDateRange) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<{
    from?: Date;
    to?: Date;
  }>({
    from: value?.startDate,
    to: value?.endDate,
  });

  React.useEffect(() => {
    if (value) {
      setDate({
        from: safeParseDate(value.startDate),
        to: safeParseDate(value.endDate),
      });
    }
  }, [value]);

  const handleDateChange = (newDate: { from?: Date; to?: Date }) => {
    setDate(newDate);
    if (newDate.from && newDate.to) {
      onChange({
        startDate: newDate.from,
        endDate: newDate.to,
      });
    }
  };

  const formatDateDisplay = () => {
    if (date.from && date.to) {
      return `${format(date.from, "MMM dd, yyyy")} - ${format(
        date.to,
        "MMM dd, yyyy"
      )}`;
    }
    if (date.from) {
      return format(date.from, "MMM dd, yyyy");
    }
    return "Pick dates";
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
