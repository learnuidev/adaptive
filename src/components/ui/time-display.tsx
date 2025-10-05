import { formatDistanceToNow } from "date-fns";

interface TimeDisplayProps {
  date: string | Date;
  addSuffix?: boolean;
  className?: string;
}

export function TimeDisplay({ 
  date, 
  addSuffix = true, 
  className = "" 
}: TimeDisplayProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return (
    <span className={className}>
      {formatDistanceToNow(dateObj, { addSuffix })}
    </span>
  );
}

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
  prefix?: string;
}

export function RelativeTime({ 
  date, 
  className = "", 
  prefix = "Created" 
}: RelativeTimeProps) {
  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {prefix} <TimeDisplay date={date} />
    </span>
  );
}
