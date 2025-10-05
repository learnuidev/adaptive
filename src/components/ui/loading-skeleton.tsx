import { Card } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: "card" | "list" | "chart";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ 
  type = "card", 
  count = 3, 
  className = "" 
}: LoadingSkeletonProps) {
  if (type === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  // Default card type
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </Card>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse"></div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    </div>
  );
}
