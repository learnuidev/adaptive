import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  backButton?: {
    onClick: () => void;
    text?: string;
  };
  actions?: ReactNode;
  headerContent?: ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  children,
  backButton,
  actions,
  headerContent,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          {backButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={backButton.onClick}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backButton.text || "Back"}
            </Button>
          )}

          {headerContent}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2 ml-4">{actions}</div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface SimplePageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  backButton?: {
    onClick: () => void;
    text?: string;
  };
  className?: string;
}

export function SimplePageLayout({
  title,
  children,
  backButton,
  description,
  className = "",
}: SimplePageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background p-6 space-y-6 ${className}`}>
      {backButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={backButton.onClick}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backButton.text || "Back"}
        </Button>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        <p className="text-muted-foreground">{description}</p>
      </div>

      {children}
    </div>
  );
}
