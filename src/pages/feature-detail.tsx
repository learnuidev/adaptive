import { useParams, useNavigate } from "@tanstack/react-router";
import { useGetFeatureDetailsQuery } from "@/modules/feature/use-get-feature-details-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeatureDetail() {
  const params = useParams({ strict: false }) as {
    credentialId?: string;
    featureId?: string;
  };
  const navigate = useNavigate();
  const { data: featureDetails, isLoading } = useGetFeatureDetailsQuery(
    params.featureId || ""
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!featureDetails) {
    return (
      <div className="min-h-screen bg-background p-6">
        <p className="text-muted-foreground">Feature not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: `/features/${params.credentialId}` })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Features
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {featureDetails.name}
              </h1>
              {featureDetails.description && (
                <p className="text-muted-foreground mb-4">
                  {featureDetails.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="font-mono">
                  {featureDetails.featureKey}
                </Badge>
                {featureDetails.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              className="bg-gradient-primary hover:bg-primary-glow shadow-emerald"
              onClick={() =>
                navigate({
                  to: `/features/${params.credentialId}/${params.featureId}/add-version`,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Version
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Created {format(new Date(featureDetails.createdAt), "MMM d, yyyy")}
          </div>
        </div>
      </div>

      {/* Versions */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Versions</h2>

        {featureDetails.versions && featureDetails.versions.length > 0 ? (
          <div className="space-y-3">
            {featureDetails.versions.map((version) => (
              <Card
                key={version.version}
                className="p-4 glass border-border/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {version?.description} - v{version.version}
                      </h3>
                      {version.isActive && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    {version.rolloutPercentage !== null &&
                      version.rolloutPercentage !== undefined && (
                        <p className="text-sm text-muted-foreground">
                          Rollout: {version.rolloutPercentage}%
                        </p>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center glass border-border/50">
            <p className="text-muted-foreground mb-2">No versions yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first version to start managing this feature
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
