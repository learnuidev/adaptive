import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { RelativeTime } from "@/components/ui/time-display";
import { cn } from "@/lib/utils";

interface MetaCardProps {
  title: string;
  description?: string;
  status?: string;
  createdAt?: Date;
  tags?: string[];
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export function MetaCard({
  title,
  description,
  status,
  createdAt,
  tags,
  icon,
  actions,
  className,
  children,
  onClick,
}: MetaCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {icon && <div className="p-2 rounded-lg bg-primary/10">{icon}</div>}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight truncate">
                {title}
              </CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
      </CardHeader>

      {(status || createdAt || tags || children) && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {status && (
              <div className="flex items-center gap-2">
                <StatusBadge status={status} />
              </div>
            )}

            {createdAt && <RelativeTime date={createdAt} className="text-xs" />}

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface SimpleCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function SimpleCard({
  title,
  description,
  icon,
  className,
  children,
}: SimpleCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 rounded-lg bg-primary/10">{icon}</div>}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
