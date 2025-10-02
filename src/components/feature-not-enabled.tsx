import { ShieldOff } from "lucide-react";

export const FeatureNotEnabled = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 bg-muted rounded-full">
        <ShieldOff className="w-12 h-12 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Feature Unavailable
        </h2>
        <p className="text-muted-foreground max-w-sm mt-2">
          This feature is currently not enabled. Contact your administrator to
          enable it.
        </p>
      </div>
    </div>
  );
};
