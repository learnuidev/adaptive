import { useHasUserEventsQuery } from "@/modules/analytics/use-has-user-events-query";
import { ReactNode } from "react";

interface WithNewEventsProps {
  credentialId?: string;
  children: ReactNode;
}

export function WithNewEvents({ credentialId, children }: WithNewEventsProps) {
  const { data } = useHasUserEventsQuery(credentialId);

  if (!data?.hasUserEvents) {
    return (
      <div className="mt-32 bg-background flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center mb-8">
          <div
            className="w-8 h-8 bg-primary rounded-full animate-ping opacity-40"
            style={{ animationDuration: "2s" }}
          ></div>
          <div
            className="w-4 h-4 bg-primary/80 rounded-full animate-ping opacity-25 animation-delay-200"
            style={{ animationDuration: "2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary/60 rounded-full animate-ping opacity-15 animation-delay-400"
            style={{ animationDuration: "2s" }}
          ></div>
        </div>

        <div>
          <div className="relative z-10 text-center">
            <h1 className="text-lg font-medium text-primary">
              Listening for first event
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Follow the setup steps in{" "}
              <a
                href={`/settings/${credentialId}`}
                className="underline hover:text-foreground"
              >
                settings
              </a>{" "}
              to begin receiving events.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
