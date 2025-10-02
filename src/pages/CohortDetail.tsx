import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Mail } from "lucide-react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useListCohortUsersQuery } from "@/modules/cohort/list-cohort-users-query";
import { useListCohortsQuery } from "@/modules/cohort/use-list-cohorts-query";
import { format } from "date-fns";

const CohortDetail = () => {
  const params = useParams({ strict: false }) as { credentialId?: string; cohortId?: string };
  const navigate = useNavigate();
  const credentialId = params?.credentialId;
  const cohortId = params?.cohortId;

  const { data: cohorts } = useListCohortsQuery(credentialId || "");
  const { data: cohortUsers, isLoading } = useListCohortUsersQuery(cohortId || "");

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: `/cohorts/${credentialId}` })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cohorts
          </Button>

          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {cohort.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Created {format(new Date(cohort.createdAt), "MMM d, yyyy")}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {ruleCount} {ruleCount === 1 ? "rule" : "rules"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {cohortUsers?.length || 0} {cohortUsers?.length === 1 ? "user" : "users"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="glass border-border/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Cohort Users</h2>
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
                    onClick={() => navigate({ to: `/users/${cohort.websiteId}/${user.visitor_id}` })}
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
      </div>
    </div>
  );
};

export default CohortDetail;
