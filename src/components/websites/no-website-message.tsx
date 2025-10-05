import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import { AddWebsiteDialog } from "./add-website-dialog";
import { WebsiteSuccessDialog } from "./website-success-dialog";

export function NoWebsiteMessage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newWebsite, setNewWebsite] = useState<{
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleWebsiteAdded = (website: {
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
      navigate({ to: `/dashboard/${newWebsite.id}` });
    }
    setNewWebsite(null);
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto bg-card/50 border-border/50">
          <div className="mb-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Analytics
            </h1>
            <p className="text-muted-foreground">
              Start by adding your first API credential to access your analytics
              data.
            </p>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            Add Your First Credential
          </Button>
        </Card>
      </div>

      <AddWebsiteDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleWebsiteAdded}
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
