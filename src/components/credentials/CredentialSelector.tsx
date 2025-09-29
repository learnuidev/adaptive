import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Database } from "lucide-react";
import { AddCredentialDialog } from "./AddCredentialDialog";

interface CredentialSelectorProps {
  onCredentialChange?: (credentialId: string) => void;
}

export function CredentialSelector({ onCredentialChange }: CredentialSelectorProps) {
  // Use strict: false to handle cases where params might not exist  
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: credentials, isLoading } = useListUserCredentialsQuery();

  const currentCredential = credentials?.find(cred => cred.id === credentialId);

  const handleCredentialChange = (newCredentialId: string) => {
    const currentPath = location.pathname;
    const basePath = currentPath.split('/')[1] || 'dashboard';
    navigate({ to: `/${basePath}/${newCredentialId}` });
    onCredentialChange?.(newCredentialId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <Database className="w-4 h-4 animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading credentials...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={credentialId || undefined} onValueChange={handleCredentialChange}>
        <SelectTrigger className="min-w-[200px] bg-card/50 border-border/50">
          <SelectValue 
            placeholder="Select credential"
            className="text-sm"
          >
            {currentCredential ? (
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="truncate">{currentCredential.title}</span>
              </div>
            ) : (
              "Select credential"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {credentials?.map((credential) => (
            <SelectItem key={credential.id} value={credential.id}>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <div>
                  <div className="font-medium">{credential.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {credential.domain}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAddDialog(true)}
        className="flex items-center gap-2 bg-card/50 border-border/50"
      >
        <Plus className="w-4 h-4" />
        Add
      </Button>

      <AddCredentialDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={(credentialId) => {
          setShowAddDialog(false);
          const currentPath = location.pathname;
          const basePath = currentPath.split('/')[1] || 'dashboard';
          navigate({ to: `/${basePath}/${credentialId}` });
        }}
      />
    </div>
  );
}