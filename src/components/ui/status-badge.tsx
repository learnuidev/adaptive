import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive" | "pending" | "error" | "success" | "warning";

interface StatusBadgeProps {
  status: StatusType | string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children?: React.ReactNode;
}

const statusConfig: Record<StatusType, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  active: {
    variant: "default",
    className: "bg-green-500 text-white hover:bg-green-600",
  },
  inactive: {
    variant: "secondary",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  },
  pending: {
    variant: "outline",
    className: "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100",
  },
  error: {
    variant: "destructive",
    className: "",
  },
  success: {
    variant: "default",
    className: "bg-green-500 text-white hover:bg-green-600",
  },
  warning: {
    variant: "outline",
    className: "bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100",
  },
};

export function StatusBadge({ 
  status, 
  variant, 
  className, 
  children 
}: StatusBadgeProps) {
  const config = statusConfig[status as StatusType];
  const finalVariant = variant || config?.variant || "secondary";
  const finalClassName = cn(
    config?.className,
    className
  );

  return (
    <Badge variant={finalVariant} className={finalClassName}>
      {children || status}
    </Badge>
  );
}

export function ActiveBadge({ className }: { className?: string }) {
  return <StatusBadge status="active" className={className}>Active</StatusBadge>;
}

export function InactiveBadge({ className }: { className?: string }) {
  return <StatusBadge status="inactive" className={className}>Inactive</StatusBadge>;
}
