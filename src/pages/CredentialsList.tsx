import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Database, 
  ExternalLink, 
  Key 
} from "lucide-react";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { AddCredentialDialog } from "@/components/credentials/AddCredentialDialog";
import { CredentialSuccessDialog } from "@/components/credentials/CredentialSuccessDialog";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function CredentialsList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newCredential, setNewCredential] = useState<{
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  } | null>(null);
  const { data: credentials, isLoading } = useListUserCredentialsQuery();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Your Credentials
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!credentials || credentials.length === 0) {
    return (
      <>
        <NoCredentialsMessage />
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

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Your Credentials
            </h1>
            <p className="text-muted-foreground">
              Manage your API credentials and access analytics
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
          {credentials.map((credential) => (
            <Card
              key={credential.id}
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-card/50 border-border/50"
              onClick={() => navigate(`/dashboard/${credential.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {credential.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {credential.domain}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {credential.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {credential.scopes.map((scope) => (
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
                  {formatDistanceToNow(new Date(credential.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Card>
          ))}
        </div>
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
    </div>
  );
}
