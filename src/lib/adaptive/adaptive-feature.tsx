import { useQuery } from "@tanstack/react-query";
import { useAdaptive } from "./adaptive-core-provider";

import React, { createContext, useContext } from "react";

export function useIsFeatureEnabled({
  featureKey,
  featureVersionId,
}: {
  featureKey: string;
  featureVersionId?: string;
}) {
  const adaptive = useAdaptive();

  return useQuery<boolean>({
    queryKey: ["is-feature-enabled", featureKey, featureVersionId],
    queryFn: () => adaptive.isFeatureEnabled({ featureKey, featureVersionId }),
  });
}
type IAdaptiveFeatureContext = {
  featureKey: string;
  featureVersionId: string;
};

const AdaptiveFeatureContext = createContext<
  IAdaptiveFeatureContext | undefined
>(undefined);

export const useFeatureKey = () => {
  const context = useContext(AdaptiveFeatureContext);
  if (!context) {
    throw new Error("useFeatureKey must be used within an AdaptiveFeature");
  }
  return context;
};

export function useTrackFeature() {
  const adaptive = useAdaptive();
  const { featureKey, featureVersionId } = useFeatureKey();

  const track = (eventName: string, payload?: any) => {
    adaptive.adaptive(eventName, {
      ...payload,
      featureKey,
      featureVersionId,
    });
  };

  return { track };
}

export function AdaptiveFeature({
  featureKey,
  featureVersionId,
  LoadingComponent,
  FallbackComponent,
  children,
}: {
  featureKey: string;
  featureVersionId?: string;
  LoadingComponent?: () => React.ReactNode;
  FallbackComponent?: () => React.ReactNode;
  children: React.ReactNode;
}) {
  const { data, isLoading } = useIsFeatureEnabled({
    featureKey,
    featureVersionId,
  });

  if (isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }

    return <div></div>;
  }

  if (data === true) {
    const adaptiveFeature = { featureKey, featureVersionId };

    return (
      <div adaptive-feature-key={featureKey}>
        <AdaptiveFeatureContext.Provider value={adaptiveFeature}>
          {children}
        </AdaptiveFeatureContext.Provider>
      </div>
    );
  }

  if (FallbackComponent) {
    return <FallbackComponent />;
  }

  return null;
}
