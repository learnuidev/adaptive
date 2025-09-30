import { useQuery } from "@tanstack/react-query";
import { useAdaptive } from "./adaptive-core-provider";

import React, { createContext, useContext } from "react";

export function useIsFeatureEnabled(featureKey: string) {
  const adaptive = useAdaptive();

  return useQuery<boolean>({
    queryKey: ["is-feature-enabled", featureKey],
    queryFn: () => adaptive.isFeatureEnabled(featureKey),
  });
}
type IAdaptiveFeatureContext = {
  featureKey: string;
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
  const { featureKey } = useFeatureKey();

  const track = (eventName: string, payload?: any) => {
    adaptive.adaptive(eventName, {
      ...payload,
      featureKey,
    });
  };

  return { track };
}

export function AdaptiveFeature({
  featureKey,
  LoadingComponent,
  children,
}: {
  featureKey: string;
  LoadingComponent?: () => React.ReactNode;
  children: React.ReactNode;
}) {
  const { data, isLoading } = useIsFeatureEnabled(featureKey);

  if (isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }

    return <div></div>;
  }

  if (data === true) {
    const adaptiveFeature = { featureKey };

    return (
      <div adaptive-feature-key={featureKey}>
        <AdaptiveFeatureContext.Provider value={adaptiveFeature}>
          {children}
        </AdaptiveFeatureContext.Provider>
      </div>
    );
  }

  return null;
}
