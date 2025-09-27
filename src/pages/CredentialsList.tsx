import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, ExternalLink, Key } from "lucide-react";
import { AddCredentialDialog } from "@/components/credentials/AddCredentialDialog";
import { formatDistance } from "date-fns";

export default function CredentialsList() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();
  const { data: credentials, isLoading } = useListUserCredentialsQuery();

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
            onClick={() => {
              console.log("Add first credential button clicked");
              setShowAddDialog(true);
            }}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            Add Your First Credential
          </Button>
        </Card>

        <AddCredentialDialog
          open={showAddDialog}
          onOpenChange={(open) => {
            console.log("Dialog open state changed:", open);
            setShowAddDialog(open);
          }}
          onSuccess={(credentialId) => {
            console.log("Credential added successfully:", credentialId);
            setShowAddDialog(false);
            navigate(`/dashboard/${credentialId}`);
          }}
        />
      </div>
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
            onClick={() => setShowAddDialog(true)}
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
                  {formatDistance(new Date(credential.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddCredentialDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          console.log("Dialog open state changed:", open);
          setShowAddDialog(open);
        }}
        onSuccess={(credentialId) => {
          console.log("Credential added successfully:", credentialId);
          setShowAddDialog(false);
          navigate(`/dashboard/${credentialId}`);
        }}
      />
    </div>
  );
}
