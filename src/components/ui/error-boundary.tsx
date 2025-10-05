import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorBoundaryProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  showRetry?: boolean;
  showGoBack?: boolean;
}

export function ErrorBoundary({
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  onRetry,
  onGoBack,
  showRetry = true,
  showGoBack = true,
}: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 justify-center">
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          {showGoBack && onGoBack && (
            <Button onClick={onGoBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface NotFoundProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  goBackText?: string;
}

export function NotFound({
  title = "Not Found",
  description = "The page you're looking for doesn't exist or you don't have access to it.",
  onGoBack,
  goBackText = "Go Back",
}: NotFoundProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground mb-6">{description}</p>
          {onGoBack && (
            <Button onClick={onGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {goBackText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
