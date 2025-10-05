import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { NoCredentialsMessage } from "@/components/credentials/no-credentials-message";
import { WithGlow } from "@/components/with-glow";
import { useListCohortsQuery } from "@/modules/cohort/use-list-cohorts-query";
import { CohortCard } from "@/components/cohorts/cohort-card";

const Cohorts = () => {
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const navigate = useNavigate();
  const { data: credentials } = useListUserCredentialsQuery();
  const { data: cohorts, isLoading } = useListCohortsQuery(credentialId || "");
  const [searchQuery, setSearchQuery] = useState("");

  const currentCredential = credentials?.find(
    (cred) => cred.id === credentialId
  );

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  const filteredCohorts = (cohorts || []).filter((cohort) =>
    cohort.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cohorts</h1>
              <p className="text-muted-foreground">
                {currentCredential
                  ? `${currentCredential.title}`
                  : "Segment and analyze user groups"}
              </p>
            </div>
            <WithGlow>
              <Button
                onClick={() => navigate({ to: `/cohorts/${credentialId}/add` })}
                className="bg-gradient-primary hover:bg-primary-glow shadow-emerald"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </WithGlow>
          </div>

          {/* Stats */}
          <Card className="p-4 glass border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cohorts</p>
                <p className="text-2xl font-bold text-foreground">
                  {cohorts?.length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cohorts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 glass border-border/50"
          />
        </div>

        {/* Cohorts List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : filteredCohorts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No cohorts yet</p>
              <p className="text-sm">
                Create your first cohort to segment your users
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCohorts.map((cohort) => (
              <CohortCard key={cohort.id} cohort={cohort} websiteId={cohort.websiteId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cohorts;