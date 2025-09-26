// import { IAdaptiveInput } from "./adaptive.types.ts";
// import { adaptive, IAdaptive } from "./adaptive.ts";
import React, { createContext, useContext } from "react";

import { adaptive } from "adaptive-engine/dist/index";

export const AdaptiveContext = createContext<any | undefined>(undefined);

export const useAdaptive = () => {
  const context = useContext(AdaptiveContext);
  if (!context) {
    throw new Error("useAdaptive must be used within a DatafastProvider");
  }
  return context;
};

export const AdaptiveProvider = ({
  children,
  domain,
  apiKey,
  apiUrl,
  identity,
}: { children: React.ReactNode } & any) => {
  const selfHostedDataFast = adaptive({
    apiKey,
    apiUrl,
    domain,
    identity,
  });

  if (!selfHostedDataFast) {
    throw new Error("AdaptivefastProvider: Failed to initialize adaptive");
  }

  return (
    <AdaptiveContext.Provider value={selfHostedDataFast}>
      {children}
    </AdaptiveContext.Provider>
  );
};
