import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Plus } from "lucide-react";
import { AddCredentialDialog } from "./AddCredentialDialog";
import { useNavigate } from "react-router-dom";

export function NoCredentialsMessage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="p-8 text-center max-w-md mx-auto bg-card/50 border-border/50">
        <div className="mb-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Credentials Found
          </h3>
          <p className="text-muted-foreground text-sm">
            You need to add your API credentials to start viewing analytics data. 
            Click the button below to add your first credential.
          </p>
        </div>
        
        <Button 
          onClick={() => {
            console.log("Add credential button clicked");
            setShowAddDialog(true);
          }}
          className="w-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Your First Credential
        </Button>

        {showAddDialog && (
          <AddCredentialDialog 
            open={showAddDialog} 
            onOpenChange={setShowAddDialog}
            onSuccess={(credentialId) => {
              setShowAddDialog(false);
              navigate(`/dashboard/${credentialId}`);
            }}
          />
        )}
      </Card>
    </div>
  );
}