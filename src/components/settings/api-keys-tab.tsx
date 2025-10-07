import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateApiKeyMutation } from "@/modules/api-keys/use-create-api-key-mutation";
import { useDeleteApiKeyMutation } from "@/modules/api-keys/use-delete-api-key-mutation";
import { useListApiKeysQuery } from "@/modules/api-keys/use-list-api-keys-query";
import { useRotateApiKeyMutation } from "@/modules/api-keys/use-rotate-api-key-mutation";
import { ApiKey, ApiKeyWithSecret } from "@/modules/api-keys/api-key.types";
import { Copy, Eye, EyeOff, Key, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ApiKeyDialogProps = {
  apiKey?: ApiKeyWithSecret;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ apiKey, open, onOpenChange }) => {
  const [showSecret, setShowSecret] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {apiKey ? "New API Key Created" : "API Key Details"}
          </DialogTitle>
          <DialogDescription>
            {apiKey 
              ? "Your new API key and secret have been generated. Please save them securely as you won't be able to see the secret again."
              : "API key details and configuration."
            }
          </DialogDescription>
        </DialogHeader>
        
        {apiKey && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                API Key ID
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                  <code className="text-sm font-mono">{apiKey.id}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiKey.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                API Secret
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                  <code className="text-sm font-mono break-all">
                    {showSecret ? apiKey.apiSecret : "•••••••••••••••••••••••••••••••••••••••"}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiKey.apiSecret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Save this API secret securely. You won't be able to see it again after closing this dialog.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {apiKey ? "I've Saved It" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type CreateApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeyCreated: (apiKey: ApiKeyWithSecret) => void;
  isCreating: boolean;
};

const CreateApiKeyDialog: React.FC<CreateApiKeyDialogProps> = ({ 
  open, 
  onOpenChange, 
  onApiKeyCreated,
  isCreating 
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("API key name is required");
      return;
    }
    
    // For now, we'll create the API key with the existing mutation
    // In a real implementation, you might want to extend the API to accept name/description
    // For now, we'll just proceed with the creation
    onOpenChange(false);
    onApiKeyCreated({} as ApiKeyWithSecret);
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New API Key
          </DialogTitle>
          <DialogDescription>
            Create a new API key for programmatic access to your data. Give it a descriptive name to help you identify its purpose.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key-name" className="text-sm font-medium text-foreground">
              API Key Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="api-key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Production API Key"
              className="mt-2"
              disabled={isCreating}
            />
          </div>

          <div>
            <Label htmlFor="api-key-description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="api-key-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional: Describe what this API key will be used for..."
              className="mt-2 resize-none"
              rows={3}
              disabled={isCreating}
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Once created, the API secret will only be shown once. Make sure to save it securely.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="min-w-[100px]"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              "Create API Key"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ApiKeysTab: React.FC<{ websiteId: string }> = ({ websiteId }) => {
  const [newApiKey, setNewApiKey] = useState<ApiKeyWithSecret | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: apiKeys = [], isLoading } = useListApiKeysQuery(websiteId);
  const createApiKeyMutation = useCreateApiKeyMutation(websiteId);
  const deleteApiKeyMutation = useDeleteApiKeyMutation(websiteId);
  const rotateApiKeyMutation = useRotateApiKeyMutation(websiteId);

  const handleCreateApiKey = async () => {
    setShowCreateDialog(true);
  };

  const handleConfirmCreateApiKey = async () => {
    try {
      const result = await createApiKeyMutation.mutateAsync();
      setNewApiKey(result);
      setShowApiKeyDialog(true);
      toast.success("API key created successfully");
    } catch (error) {
      toast.error("Failed to create API key");
      setShowCreateDialog(true); // Reopen create dialog on error
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteApiKeyMutation.mutateAsync(id);
      toast.success("API key deleted successfully");
    } catch (error) {
      toast.error("Failed to delete API key");
    }
  };

  const handleRotateApiKey = async (id: string) => {
    try {
      const result = await rotateApiKeyMutation.mutateAsync(id);
      setNewApiKey(result);
      setShowApiKeyDialog(true);
      toast.success("API key rotated successfully");
    } catch (error) {
      toast.error("Failed to rotate API key");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your API keys for programmatic access
            </p>
          </div>
          <Button
            onClick={handleCreateApiKey}
            disabled={createApiKeyMutation.isPending}
            className="rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create API Key
          </Button>
        </div>

        {/* API Keys List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading API keys...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No API keys yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first API key to start using the Adaptive API
              </p>
              <Button onClick={handleCreateApiKey} disabled={createApiKeyMutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>
          ) : (
            apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="glass-strong rounded-xl p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Key className="h-5 w-5 text-primary" />
                      <code className="text-sm font-mono font-medium text-foreground">
                        {apiKey.id}
                      </code>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <span className="ml-2 text-foreground">{formatDate(apiKey.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="ml-2 text-foreground">{formatDate(apiKey.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">Preview Secret:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-mono bg-muted/50 rounded px-2 py-1">
                          {apiKey.previewApiSecret}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.previewApiSecret)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRotateApiKey(apiKey.id)}
                          disabled={rotateApiKeyMutation.isPending}
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rotate API key</p>
                      </TooltipContent>
                    </Tooltip>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteApiKeyMutation.isPending}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access for any applications using this key.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* API Key Dialog */}
        <ApiKeyDialog
          apiKey={newApiKey || undefined}
          open={showApiKeyDialog}
          onOpenChange={setShowApiKeyDialog}
        />

        {/* Create API Key Dialog */}
        <CreateApiKeyDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onApiKeyCreated={handleConfirmCreateApiKey}
          isCreating={createApiKeyMutation.isPending}
        />

        {/* Usage Instructions */}
        {apiKeys.length > 0 && (
          <div className="glass-strong rounded-xl p-6">
            <h4 className="text-lg font-medium text-foreground mb-4">How to use your API keys</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-foreground mb-2">Authentication</h5>
                <p className="text-sm text-muted-foreground mb-3">
                  Include your API key and secret in the request headers for authentication:
                </p>
                <CodeBlock
                  language="bash"
                  code={`curl -X POST "https://api.adaptive.fyi/v1/events" \\
  -H "X-API-Key: your-api-key-id" \\
  -H "X-API-Secret: your-api-secret" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "user_action", "data": {...}}'`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
