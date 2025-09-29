/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";

type HourlyRecord = { hour: string; total: number };
type DailyRecord = { day: string; total: number };
type MonthlyRecord = { month: number; total: number };
type TotalRecord = { total: number };

type CurrentPrevious<T> = {
  current: T[];
  previous: T[];
};

// Discriminated union mapping period to return type
type PeriodResultMap = {
  last24h: CurrentPrevious<HourlyRecord>;
  week: CurrentPrevious<DailyRecord>;
  wtd: CurrentPrevious<DailyRecord>;
  day: CurrentPrevious<DailyRecord>;
  yesterday: CurrentPrevious<DailyRecord>;
  today: CurrentPrevious<DailyRecord>;
  month: CurrentPrevious<DailyRecord>;
  mtd: CurrentPrevious<DailyRecord>;
  last7d: CurrentPrevious<DailyRecord>;
  last30d: CurrentPrevious<DailyRecord>;
  last12m: CurrentPrevious<DailyRecord>;
  ytd: CurrentPrevious<MonthlyRecord>;
  year: CurrentPrevious<MonthlyRecord>;
  all: CurrentPrevious<TotalRecord>;
  custom: CurrentPrevious<DailyRecord>;
};

export type Page = {
  href: string;
  patternHref?: string;
};

export type PageVisit = {
  href: string;
  visits: string;
  total: string;
  patternHref?: string;
};

export type VisitorCount = {
  hour?: string;
  day?: string;
  month?: string;
  total: string;
};

export interface Visitor {
  visitor_id: string;
  last_seen: string;
  email?: string;
  country?: string;
  region?: string;
  city?: string;
}

export type GetSummaryResponseRaw = {
  pages: Page[];
  totalPageVisits: {
    current: PageVisit[];
    previous: PageVisit[];
  };
  totalVisitors: {
    current: VisitorCount[];
    previous: VisitorCount[];
  };
  totalPageVisitsOvertime: {
    current: VisitorCount[];
    previous: VisitorCount[];
  };

  visitors: Visitor[];

  averageSession: {
    // seconds
    current: number;
    previous: number;
  };
};

const getSummaryRawResponse = {
  pages: [
    {
      href: "https://www.adaptive.fyi/",
    },
    {
      href: "https://www.adaptive.fyi/analytics/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/analytics/[param]",
    },
    {
      href: "https://www.adaptive.fyi/dashboard/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/dashboard/[param]",
    },
    {
      href: "https://www.adaptive.fyi/dashboard/01K66Y71NVHBWVFX8T9HB76WXH",
      patternHref: "https://www.adaptive.fyi/dashboard/[param]",
    },
    {
      href: "https://www.adaptive.fyi/events/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/events/[param]",
    },
    {
      href: "https://www.adaptive.fyi/feature-flags/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/feature-flags/[param]",
    },
    {
      href: "https://www.adaptive.fyi/goals/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/goals/[param]",
    },
    {
      href: "https://www.adaptive.fyi/insights/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/insights/[param]",
    },
    {
      href: "https://www.adaptive.fyi/performance/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/performance/[param]",
    },
    {
      href: "https://www.adaptive.fyi/settings/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/settings/[param]",
    },
    {
      href: "https://www.adaptive.fyi/settings/01K66Y71NVHBWVFX8T9HB76WXH",
      patternHref: "https://www.adaptive.fyi/settings/[param]",
    },
    {
      href: "https://www.adaptive.fyi/users/01K66XSK34CXMV0TT8ATS953W0",
      patternHref: "https://www.adaptive.fyi/users/[param]",
    },
  ],
  totalPageVisits: {
    current: [
      {
        href: "https://www.adaptive.fyi/dashboard/01K66XSK34CXMV0TT8ATS953W0",
        visits: "16",
        patternHref: "https://www.adaptive.fyi/dashboard/[param]",
      },
      {
        href: "https://www.adaptive.fyi/",
        visits: "15",
      },
      {
        href: "https://www.adaptive.fyi/performance/01K66XSK34CXMV0TT8ATS953W0",
        visits: "6",
        patternHref: "https://www.adaptive.fyi/performance/[param]",
      },
      {
        href: "https://www.adaptive.fyi/insights/01K66XSK34CXMV0TT8ATS953W0",
        visits: "5",
        patternHref: "https://www.adaptive.fyi/insights/[param]",
      },
      {
        href: "https://www.adaptive.fyi/dashboard/01K66Y71NVHBWVFX8T9HB76WXH",
        visits: "5",
        patternHref: "https://www.adaptive.fyi/dashboard/[param]",
      },
      {
        href: "https://www.adaptive.fyi/feature-flags/01K66XSK34CXMV0TT8ATS953W0",
        visits: "5",
        patternHref: "https://www.adaptive.fyi/feature-flags/[param]",
      },
      {
        href: "https://www.adaptive.fyi/users/01K66XSK34CXMV0TT8ATS953W0",
        visits: "5",
        patternHref: "https://www.adaptive.fyi/users/[param]",
      },
      {
        href: "https://www.adaptive.fyi/goals/01K66XSK34CXMV0TT8ATS953W0",
        visits: "4",
        patternHref: "https://www.adaptive.fyi/goals/[param]",
      },
      {
        href: "https://www.adaptive.fyi/analytics/01K66XSK34CXMV0TT8ATS953W0",
        visits: "4",
        patternHref: "https://www.adaptive.fyi/analytics/[param]",
      },
      {
        href: "https://www.adaptive.fyi/settings/01K66XSK34CXMV0TT8ATS953W0",
        visits: "4",
        patternHref: "https://www.adaptive.fyi/settings/[param]",
      },
      {
        href: "https://www.adaptive.fyi/events/01K66XSK34CXMV0TT8ATS953W0",
        visits: "3",
        patternHref: "https://www.adaptive.fyi/events/[param]",
      },
      {
        href: "https://www.adaptive.fyi/settings/01K66Y71NVHBWVFX8T9HB76WXH",
        visits: "1",
        patternHref: "https://www.adaptive.fyi/settings/[param]",
      },
    ],
    previous: [],
  },
  totalVisitors: {
    current: [
      {
        total: "73",
      },
    ],
    previous: [
      {
        total: "0",
      },
    ],
  },
};

export type GetSummaryResponse = {
  totalVisitors: {
    current: VisitorCount[];
    previous: VisitorCount[];
    currentTotal: number;
    previousTotal: number;
    percentageDifference: number;
  };
  totalPageVisits: {
    current: number;
    previous: number;
    percentageDifference: number;
  };

  visitors: Visitor[];

  averageSession: {
    // seconds
    current: number;
    previous: number;
    percentageDifference: number | null;
  };

  totalPageVisitsOvertime: {
    current: VisitorCount[];
    previous: VisitorCount[];
  };
};
export type FilterPeriod =
  | "today"
  | "yesterday"
  | "day"
  | "week"
  | "month"
  | "year"
  | "last24h"
  | "last7d"
  | "last30d"
  | "last12m"
  | "wtd"
  | "mtd"
  | "ytd"
  | "all"
  | "custom";

export const filterPeriods: Record<FilterPeriod, FilterPeriod> = {
  today: "today",
  yesterday: "yesterday",
  day: "day",
  week: "week",
  month: "month",
  year: "year",
  last24h: "last24h",
  last7d: "last7d",
  last30d: "last30d",
  last12m: "last12m",
  wtd: "wtd",
  mtd: "mtd",
  ytd: "ytd",
  all: "all",
  custom: "custom",
};

async function getSummary({
  websiteId,
  period,
}: {
  websiteId: string;
  period: FilterPeriod;
}): Promise<GetSummaryResponse> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/get-summary`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId, period }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const respRaw = (await res.json()) as GetSummaryResponseRaw;

  try {
    console.log("RESP RAW", respRaw);

    const totalCurrentPageVisits = respRaw.totalPageVisits.current.reduce(
      (acc, curr) => {
        return acc + parseInt(curr?.visits || curr?.total);
      },
      0
    );
    const totalPreviousPageVisits = respRaw.totalPageVisits.previous.reduce(
      (acc, curr) => {
        return acc + parseInt(curr?.visits || curr?.total);
      },
      0
    );

    const totalCurrentVisitors = parseInt(
      respRaw.totalVisitors?.current?.[0]?.total || "0"
    );
    const totalPreviousVisitors = parseInt(
      respRaw?.totalVisitors?.previous?.[0]?.total || "0"
    );

    const currentAverageSession = respRaw.averageSession?.current || 0;
    const previousAverageSession = respRaw.averageSession?.previous || 0;

    const avgSessionPercDiff =
      previousAverageSession === 0
        ? null
        : ((currentAverageSession - previousAverageSession) /
            previousAverageSession) *
            100 || 0;

    const resp = {
      totalVisitors: {
        current: respRaw.totalVisitors.current,
        previous: respRaw.totalVisitors.previous,
        currentTotal: totalCurrentVisitors,
        previousTotal: totalPreviousVisitors,
        percentageDifference:
          totalPreviousVisitors === 0
            ? null
            : ((totalCurrentVisitors - totalPreviousVisitors) /
                (totalPreviousVisitors || 1)) *
                100 || 0,
      },

      totalPageVisits: {
        current: totalCurrentPageVisits,
        previous: totalPreviousPageVisits,
        percentageDifference:
          totalPreviousPageVisits === 0
            ? null
            : ((totalCurrentPageVisits - totalPreviousPageVisits) /
                totalPreviousPageVisits) *
                100 || 0,
      },

      visitors: respRaw.visitors,

      averageSession: {
        current: currentAverageSession,
        previous: previousAverageSession,
        percentageDifference: avgSessionPercDiff,
      },

      totalPageVisitsOvertime: {
        current: respRaw?.totalPageVisitsOvertime?.current,
        previous: respRaw?.totalPageVisitsOvertime?.previous,
      },
    };

    console.log("RESP", resp);
    return resp;
  } catch (error) {
    console.log("ERROR", error);
    throw Error(`Something went wrong`);
  }
}
const getSummaryQueryKey = "get-summary";

export const useGetSummaryQuery = ({
  websiteId,
  period,
}: {
  websiteId: string;
  period: FilterPeriod;
}) => {
  return useQuery<GetSummaryResponse>({
    queryKey: [getSummaryQueryKey, websiteId, period],
    queryFn: async () => {
      const response = await getSummary({ websiteId, period });
      return response;
    },
    // refetchInterval: 5000,

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
