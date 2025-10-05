import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { RefreshCw, Trash2, Key, Copy, Eye, EyeOff } from "lucide-react";
import { useListApiKeysQuery } from "@/modules/api-keys/use-list-api-keys-query";
import { useDeleteApiKeyMutation } from "@/modules/api-keys/use-delete-api-key-mutation";
import { useRotateApiKeyMutation } from "@/modules/api-keys/use-rotate-api-key-mutation";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApiKeysListProps {
  websiteId: string;
}

export function ApiKeysList({ websiteId }: ApiKeysListProps) {
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [rotatedKey, setRotatedKey] = useState<{
    id: string;
    apiSecret: string;
    previewApiSecret: string;
  } | null>(null);

  const { toast } = useToast();
  const { data: apiKeys, isLoading, refetch } = useListApiKeysQuery(websiteId);
  const deleteMutation = useDeleteApiKeyMutation(websiteId);
  const rotateMutation = useRotateApiKeyMutation(websiteId);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "API key deleted",
        description: "The API key has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete API key",
        description: "There was an error deleting the API key.",
        variant: "destructive",
      });
    }
  };

  const handleRotate = async (id: string) => {
    try {
      const result = await rotateMutation.mutateAsync(id);
      setRotatedKey({
        id: result.id,
        apiSecret: result.apiSecret,
        previewApiSecret: result.previewApiSecret,
      });
      setRotateDialogOpen(true);
      toast({
        title: "API key rotated",
        description: "Your API secret has been rotated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to rotate API key",
        description: "There was an error rotating the API key.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The API secret has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return <LoadingSkeleton type="list" count={3} />;
  }

  if (!apiKeys || apiKeys.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No API keys found</h3>
          <p className="text-muted-foreground">
            Create user websites to generate API keys for this website.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">API Keys</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    Website ID: {apiKey.websiteId}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Secret: {apiKey.previewApiSecret}</span>
              </div>
              <span>
                Created{" "}
                {formatDistanceToNow(new Date(apiKey.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotate(apiKey.id)}
                disabled={rotateMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Rotate Secret
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this API key? This action
                      cannot be undone. Any applications using this API key will
                      lose access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(apiKey.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API Secret Rotated</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New API Secret</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 p-2 bg-muted rounded text-sm">
                  {rotatedKey?.apiSecret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    rotatedKey && copyToClipboard(rotatedKey.apiSecret)
                  }
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">⚠️ Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Save this API secret immediately</li>
                <li>Update your applications with the new secret</li>
                <li>Previous API secret is now invalid</li>
              </ul>
            </div>
            <Button
              onClick={() => setRotateDialogOpen(false)}
              className="w-full"
            >
              I've Saved the Secret
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
