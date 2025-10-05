import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/page-layout";
import { Users, Mail } from "lucide-react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useListCohortUsersQuery } from "@/modules/cohort/list-cohort-users-query";
import { useListCohortsQuery } from "@/modules/cohort/use-list-cohorts-query";
import { format } from "date-fns";
import { useNavigationUtils } from "@/lib/navigation-utils";

const CohortDetail = () => {
  const params = useParams({ strict: false }) as {
    websiteId?: string;
    cohortId?: string;
  };
  const navigate = useNavigate();
  const { navigateToCohorts } = useNavigationUtils();
  const websiteId = params?.websiteId;
  const cohortId = params?.cohortId;

  const { data: cohorts } = useListCohortsQuery(websiteId || "");
  const { data: cohortUsers, isLoading } = useListCohortUsersQuery(
    cohortId || ""
  );

  const cohort = cohorts?.find((c) => c.id === cohortId);

  if (!cohort) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Cohort not found</p>
        </div>
      </div>
    );
  }

  const ruleCount = cohort.cohortRules?.length || 0;

  return (
    <PageLayout
      title={cohort.name}
      description={`Created ${format(new Date(cohort.createdAt), "MMM d, yyyy")}`}
      backButton={{
        onClick: () => navigateToCohorts(websiteId),
        text: "Back to Cohorts",
      }}
      actions={
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {ruleCount} {ruleCount === 1 ? "rule" : "rules"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {cohortUsers?.length || 0}{" "}
            {cohortUsers?.length === 1 ? "user" : "users"}
          </Badge>
        </div>
      }
      headerContent={
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
      }
    >
        <Card className="glass border-border/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Cohort Users
            </h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading users...
              </div>
            ) : cohortUsers && cohortUsers.length > 0 ? (
              <div className="space-y-2">
                {cohortUsers.map((user, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate({
                        to: `/users/${cohort.websiteId}/${user.visitor_id}`,
                      })
                    }
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/20 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {user.email || "No email"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users in this cohort yet</p>
              </div>
            )}
          </CardContent>
        </Card>
    </PageLayout>
  );
};

export default CohortDetail;
