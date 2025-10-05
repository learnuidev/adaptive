import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Database, ExternalLink, Key, Plus } from "lucide-react";
import { useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { useNavigationUtils } from "@/lib/navigation-utils";

import { AddWebsiteDialog } from "@/components/websites/add-website-dialog";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { WebsiteSuccessDialog } from "@/components/websites/website-success-dialog";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useWebsiteStore } from "@/stores/website-store";

export default function CredentialsList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState<{
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  } | null>(null);
  const { data: websites, isLoading } = useListUserWebsitesQuery();
  const { navigateToDashboard } = useNavigationUtils();
  const { setSelectedWebsite } = useWebsiteStore();

  const handleCredentialClick = (websiteId: string) => {
    setSelectedWebsite(websiteId);
    navigateToDashboard(websiteId);
  };

  const handleCredentialAdded = (website: {
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  }) => {
    setIsAddDialogOpen(false);
    setNewWebsite(website);
    setIsSuccessDialogOpen(true);
  };

  const handleSuccessContinue = () => {
    setIsSuccessDialogOpen(false);
    if (newWebsite) {
      setSelectedWebsite(newWebsite.id);
      navigateToDashboard(newWebsite.id);
    }
    setNewWebsite(null);
  };

  if (isLoading) {
    return (
      <PageLoadingSkeleton />
    );
  }

  if (!websites || websites.length === 0) {
    return (
      <>
        <NoWebsiteMessage />
        <AddWebsiteDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleCredentialAdded}
        />

        <WebsiteSuccessDialog
          open={isSuccessDialogOpen}
          onOpenChange={setIsSuccessDialogOpen}
          website={newWebsite}
          onContinue={handleSuccessContinue}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Your Credentials
            </h1>
            <p className="text-muted-foreground">
              Manage your API websites and access analytics
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Card
              key={website.id}
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-card/50 border-border/50"
              onClick={() => handleCredentialClick(website.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {website.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {website.domain}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {website.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {website.scopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  <span>API Key: •••••••••</span>
                </div>
                <span>
                  Added{" "}
                  {formatDistanceToNow(new Date(website.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddWebsiteDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleCredentialAdded}
      />

      <WebsiteSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        website={newWebsite}
        onContinue={handleSuccessContinue}
      />
    </div>
  );
}
