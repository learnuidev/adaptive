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
import { AddCredentialDialog } from "./add-credential-dialog";

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
        <SelectTrigger className="min-w-[200px] glass border-white/10 bg-card/50 backdrop-blur-md">
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
        <SelectContent className="glass border-white/10 bg-card/95 backdrop-blur-md">
          {credentials?.map((credential) => (
            <SelectItem key={credential.id} value={credential.id} className="hover:bg-white/5">
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
        onClick={() => setShowAddDialog(true)}
        className="flex items-center gap-2 glass border-white/10 bg-card/50 backdrop-blur-md"
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