import { CredentialSelector } from "@/components/websites/website-selector";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { possibleScopes } from "@/modules/user-websites/use-add-user-website-mutation";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { InstallationTab } from "@/components/settings/installation-tab";
import { ApiKeysTab } from "@/components/settings/api-keys-tab";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { useParams, useSearch } from "@tanstack/react-router";
import { Book, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

type InfoFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

type ScopesDisplayProps = {
  scopes?: string[];
};

// ──────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ──────────────────────────────────────────────────────────────

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  children,
  className = "",
}) => (
  <div className={`group ${className}`}>
    <label className="text-sm font-semibold text-foreground mb-3 block uppercase tracking-wide">
      {label}
    </label>
    <div className="bg-muted/50 rounded-xl px-4 py-3 transition-all duration-200 group-hover:bg-muted/70">
      {children}
    </div>
  </div>
);

const ScopesDisplay: React.FC<ScopesDisplayProps> = ({ scopes }) => (
  <div className="flex flex-wrap gap-2">
    {scopes?.length ? (
      scopes.map((scope) => {
        const scopeItem = possibleScopes?.find((s) => s.value === scope);
        return (
          <Badge
            key={scope}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
          >
            {scopeItem?.name || scope}
          </Badge>
        );
      })
    ) : (
      <span className="text-sm text-muted-foreground">
        No scopes configured
      </span>
    )}
  </div>
);

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────

export default function Settings() {
  const params = useParams({ strict: false }) as { websiteId?: string };
  const search = useSearch({ strict: false }) as { view?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();

  // URL state management for tabs
  const [activeTab, setActiveTab] = useState(search.view || "installation");

  if (!websiteId) {
    return <NoWebsiteMessage />;
  }

  const currentWebsite = websites?.find((c) => c.id === websiteId);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">
                  Settings
                </h1>
                <p className="text-lg text-muted-foreground">
                  Configure your API integration and manage websites
                </p>
              </div>
              <div className="glass p-1 rounded-2xl">
                <CredentialSelector />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              // const url = new URL(window.location.href);
              setActiveTab(value);
              // url.searchParams.set("view", value);
            }}
            className="space-y-8"
          >
            <div className="glass-strong rounded-2xl p-1">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-1">
                <TabsTrigger
                  value="installation"
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all duration-200"
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Installation & Setup
                </TabsTrigger>
                <TabsTrigger
                  value="api"
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all duration-200"
                >
                  <Book className="h-4 w-4 mr-2" />
                  API
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <TabsContent value="installation" className="mt-0">
              <InstallationTab />
            </TabsContent>

            <TabsContent value="api" className="mt-0">
              <ApiKeysTab websiteId={websiteId} />
            </TabsContent>
          </Tabs>

          {/* Website Details Section */}
          <div
            className="glass-strong rounded-3xl p-8 animate-slide-up mt-8"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Website Details
              </h2>
              <p className="text-muted-foreground">
                Information about your current website configuration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Title">
                <p className="text-sm text-foreground font-medium">
                  {currentWebsite?.title || "Unknown"}
                </p>
              </InfoField>

              <InfoField label="Description">
                <p className="text-sm text-muted-foreground">
                  {currentWebsite?.description || "No description provided"}
                </p>
              </InfoField>

              <InfoField label="Scopes" className="md:col-span-2">
                <ScopesDisplay scopes={currentWebsite?.scopes} />
              </InfoField>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
