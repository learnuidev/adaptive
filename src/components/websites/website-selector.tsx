import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Database } from "lucide-react";

import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { AddWebsiteDialog } from "./add-website-dialog";

interface CredentialSelectorProps {
  onCredentialChange?: (websiteId: string) => void;
}

export function CredentialSelector({
  onCredentialChange,
}: CredentialSelectorProps) {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: websites, isLoading } = useListUserWebsitesQuery();

  const currentWebsite = websites?.find((website) => website.id === websiteId);

  const handleCredentialChange = (newCredentialId: string) => {
    const currentPath = location.pathname;
    const basePath = currentPath.split("/")[1] || "dashboard";
    navigate({ to: `/${basePath}/${newCredentialId}` });
    onCredentialChange?.(newCredentialId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <Database className="w-4 h-4 animate-pulse" />
        <span className="text-sm text-muted-foreground">
          Loading websites...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={websiteId || undefined}
        onValueChange={handleCredentialChange}
      >
        <SelectTrigger className="min-w-[200px] glass border-white/10 bg-card/50 backdrop-blur-md">
          <SelectValue placeholder="Select website" className="text-sm">
            {currentWebsite ? (
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="truncate">{currentWebsite.title}</span>
              </div>
            ) : (
              "Select website"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="glass border-white/10 bg-card/95 backdrop-blur-md">
          {websites?.map((website) => (
            <SelectItem
              key={website.id}
              value={website.id}
              className="hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <div>
                  <div className="font-medium">{website.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {website.domain}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setShowAddDialog(true)}
        className="flex items-center gap-2 glass border-white/10 bg-card/50 backdrop-blur-md"
      >
        <Plus className="w-4 h-4" />
        Add
      </Button>

      <AddWebsiteDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={(websiteId) => {
          setShowAddDialog(false);
          const currentPath = location.pathname;
          const basePath = currentPath.split("/")[1] || "dashboard";
          navigate({ to: `/${basePath}/${websiteId}` });
        }}
      />
    </div>
  );
}
