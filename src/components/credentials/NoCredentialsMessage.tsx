import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";
import { AddCredentialDialog } from "./AddCredentialDialog";
import { CredentialSuccessDialog } from "./CredentialSuccessDialog";
import { useNavigate } from "react-router-dom";

export function NoCredentialsMessage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newCredential, setNewCredential] = useState<{
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleCredentialAdded = (credential: {
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  }) => {
    setIsAddDialogOpen(false);
    setNewCredential(credential);
    setIsSuccessDialogOpen(true);
  };

  const handleSuccessContinue = () => {
    setIsSuccessDialogOpen(false);
    if (newCredential) {
      navigate(`/dashboard/${newCredential.id}`);
    }
    setNewCredential(null);
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
              Start by adding your first API credential to access your analytics data.
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

      <AddCredentialDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleCredentialAdded}
      />
      
      <CredentialSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        credential={newCredential}
        onContinue={handleSuccessContinue}
      />
    </>
  );
}