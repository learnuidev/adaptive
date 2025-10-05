import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  website: {
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  } | null;
  onContinue: () => void;
}

export function WebsiteSuccessDialog({
  open,
  onOpenChange,
  website,
  onContinue,
}: WebsiteSuccessDialogProps) {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  if (!website) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-center">
            🎉 Credential Created Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Please save these credentials securely. You won't be able to see the
            secret key again.
          </p>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Access Key ID
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                    {website.accessKeyId}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(website.accessKeyId, "Access Key ID")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Secret Key
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                    {showSecretKey ? website.secretKey : "•".repeat(40)}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(website.secretKey, "Secret Key")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> Make sure to save these credentials
              securely. The secret key will not be shown again for security
              reasons.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={onContinue} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
