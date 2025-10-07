import { useHasUserEventsQuery } from "@/modules/analytics/use-has-user-events-query";
import { ReactNode } from "react";
import { WithPulseDots } from "./with-pulse-dots";

interface WithNewEventsProps {
  websiteId?: string;
  children: ReactNode;
}

export function WithNewEvents({ websiteId, children }: WithNewEventsProps) {
  const { data } = useHasUserEventsQuery(websiteId);

  if (!data?.hasUserEvents) {
    return (
      <WithPulseDots>
        <div>
          <div className="relative z-10 text-center">
            <h1 className="text-lg font-medium text-primary">
              Listening for first event
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Follow the setup steps in{" "}
              <a
                href={`/settings/${websiteId}`}
                className="underline hover:text-foreground"
              >
                settings
              </a>{" "}
              to begin receiving events.
            </p>
          </div>
        </div>
      </WithPulseDots>
    );
  }

  return <>{children}</>;
}
