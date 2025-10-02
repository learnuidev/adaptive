import { FeatureCard } from "@/components/feature-flags/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { ResponsiveFilters } from "@/components/analytics/ResponsiveFilters";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { WithGlow } from "@/components/with-glow";

const features = [
  {
    id: 1,
    name: "Enhanced User Interface",
    description:
      "New modern UI with improved user experience and accessibility features",
    enabled: true,
    rolloutPercentage: 85,
    environment: "production" as const,
    usersAffected: 25400,
  },
  {
    id: 2,
    name: "Real-time Notifications",
    description: "Push notifications for real-time updates and alerts",
    enabled: true,
    rolloutPercentage: 100,
    environment: "production" as const,
    usersAffected: 30000,
  },
  {
    id: 3,
    name: "Advanced Analytics Dashboard",
    description:
      "Enhanced analytics with machine learning insights and predictive modeling",
    enabled: false,
    rolloutPercentage: 15,
    environment: "staging" as const,
    usersAffected: 1200,
  },
  {
    id: 4,
    name: "Mobile App Integration",
    description:
      "Native mobile app features and cross-platform synchronization",
    enabled: true,
    rolloutPercentage: 60,
    environment: "production" as const,
    usersAffected: 18000,
  },
  {
    id: 5,
    name: "AI-Powered Insights",
    description:
      "Artificial intelligence powered data analysis and recommendations",
    enabled: false,
    rolloutPercentage: 5,
    environment: "development" as const,
    usersAffected: 250,
  },
  {
    id: 6,
    name: "Dark Mode Theme",
    description: "Dark theme support with automatic light/dark mode switching",
    enabled: true,
    rolloutPercentage: 95,
    environment: "production" as const,
    usersAffected: 28500,
  },
];

export default function Features() {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const { data: credentials } = useListUserCredentialsQuery();
  const [items, setItems] = useState(features);
  const [searchQuery, setSearchQuery] = useState("");

  const currentCredential = credentials?.find(
    (cred) => cred.id === credentialId
  );

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enabledCount = items.filter((item) => item.enabled).length;
  const totalUsers = items.reduce(
    (sum, item) => (item.enabled ? sum + item.usersAffected : sum),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Features</h1>
              <p className="text-muted-foreground">
                {currentCredential
                  ? `Manage features for ${currentCredential.title}`
                  : "Manage and monitor feature releases across environments"}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <ResponsiveFilters />

              <WithGlow>
                <Button className="hidden md:flex bg-gradient-primary hover:bg-primary-glow shadow-emerald">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Feature
                </Button>
              </WithGlow>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 glass border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Features
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {enabledCount}
                  </p>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {Math.round((enabledCount / items.length) * 100)}%
                </Badge>
              </div>
            </Card>

            <Card className="p-4 glass border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Users Affected
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </Card>

            <Card className="p-4 glass border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Features
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {items.length}
                  </p>
                </div>
                <Badge variant="secondary">All Environments</Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass border-border/50"
            />
          </div>
          <Button variant="outline" className="glass border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard {...item} onToggle={() => toggleItem(item.id)} />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No features found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
