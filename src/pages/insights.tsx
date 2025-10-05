import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Zap,
} from "lucide-react";
// import { useListUserCredentialsQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";

const Insights = () => {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();

  const currentWebsite = websites?.find((website) => website.id === websiteId);

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  const mockInsights = [
    {
      id: 1,
      title: "Peak Usage Hours Detected",
      description: "Your app experiences 40% more traffic between 2-4 PM EST",
      type: "opportunity",
      impact: "high",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Conversion Rate Improvement",
      description:
        "Landing page A is converting 15% better than landing page B",
      type: "success",
      impact: "medium",
      time: "4 hours ago",
    },
    {
      id: 3,
      title: "Performance Alert",
      description:
        "API response times have increased by 23% in the last 24 hours",
      type: "warning",
      impact: "high",
      time: "6 hours ago",
    },
    {
      id: 4,
      title: "User Behavior Pattern",
      description: "Mobile users spend 2.3x more time on product pages",
      type: "info",
      impact: "medium",
      time: "1 day ago",
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return TrendingUp;
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      default:
        return Zap;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "default";
      case "success":
        return "default";
      case "warning":
        return "destructive";
      case "info":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Insights</h1>
          <p className="text-muted-foreground">
            {currentWebsite
              ? `AI insights for ${currentWebsite.title}`
              : "AI-powered insights and recommendations"}
          </p>
        </div>
        <ResponsiveFilters />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Insights</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+3 since yesterday</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Growth opportunities identified
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Latest Insights</CardTitle>
          <CardDescription>
            AI-generated insights based on your data patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInsights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-lg border border-border/50 glass space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${insight.type === "warning" ? "bg-destructive/10" : "bg-primary/10"} flex items-center justify-center mt-1`}
                      >
                        <IconComponent
                          className={`w-4 h-4 ${insight.type === "warning" ? "text-destructive" : "text-primary"}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {insight.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-11">
                    <Badge variant={getInsightColor(insight.type) as any}>
                      {insight.type}
                    </Badge>
                    <Badge variant={getImpactColor(insight.impact) as any}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;
