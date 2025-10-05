import { useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { NotFound } from "@/components/ui/error-boundary";
import { ArrowLeft, Database, Key, Globe, Calendar } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { ApiKeysList } from "@/components/api-keys/api-keys-list";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useNavigationUtils } from "@/lib/navigation-utils";

export default function CredentialDetail() {
  const { websiteId } = useParams({ from: "/dashboard/$websiteId" });
  const { navigateToWebsites } = useNavigationUtils();
  const { data: websites, isLoading } = useListUserWebsitesQuery();

  const website = websites?.find((c) => c.id === websiteId);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  if (!website) {
    return (
      <NotFound
        title="Credential Not Found"
        description="The website you're looking for doesn't exist or you don't have access to it."
        onGoBack={navigateToWebsites}
        goBackText="Back to Credentials"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={navigateToWebsites}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Credentials
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {website.title}
              </h1>
              <p className="text-muted-foreground">
                Manage your API website and associated keys
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credential Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Credential Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Title
                  </label>
                  <p className="font-medium">{website.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm">{website.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Domain
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>{website.domain}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Website ID
                  </label>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    {website.id}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    API Key
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {website.apiKey.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Scopes
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {website.scopes.map((scope) => (
                      <Badge
                        key={scope}
                        variant="secondary"
                        className="text-xs"
                      >
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(website.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Keys Management */}
          <div className="lg:col-span-2">
            <ApiKeysList websiteId={website.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
