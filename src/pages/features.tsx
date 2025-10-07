import { FeatureCard } from "@/components/features/feature-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { AddFeatureDialog } from "@/components/features/add-feature-dialog";
import { WithGlow } from "@/components/with-glow";
import { useListFeaturesQuery } from "@/modules/feature/use-list-features-query";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";

export default function Features() {
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();
  const { data: features, isLoading } = useListFeaturesQuery(websiteId || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const currentWebsite = websites?.find((website) => website.id === websiteId);

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  const filteredFeatures = (features || []).filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (feature.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Features</h1>
              <p className="text-muted-foreground">
                {currentWebsite ? `${currentWebsite.title}` : "Manage features"}
              </p>
            </div>
            <WithGlow>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-primary hover:bg-primary-glow shadow-emerald"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </WithGlow>
          </div>

          {/* Stats */}
          <Card className="p-4 glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Features</p>
                <p className="text-2xl font-bold text-foreground">
                  {features?.length || 0}
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
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 glass"
          />
        </div>

        {/* Features List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No features yet</p>
              <p className="text-sm">
                Create your first feature to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        )}
      </div>

      <AddFeatureDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        websiteId={websiteId || ""}
      />
    </div>
  );
}
