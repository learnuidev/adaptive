import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddFeatureMutation } from "@/modules/feature/use-add-feature-mutation";
import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { toast } from "sonner";

interface AddFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
}

export function AddFeatureDialog({
  open,
  onOpenChange,
  websiteId,
}: AddFeatureDialogProps) {
  const [name, setName] = useState("");
  const [featureKey, setFeatureKey] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const { data: authUser } = useGetAuthUserQuery();
  const addFeatureMutation = useAddFeatureMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser?.email) {
      toast.error("User email not found");
      return;
    }

    try {
      await addFeatureMutation.mutateAsync({
        name,
        featureKey,
        description: description || undefined,
        userId: authUser.email,
        websiteId: websiteId,
        featureKeyAndWebsiteId: `${featureKey}#${websiteId}`,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      });

      toast.success("Feature created");
      onOpenChange(false);

      // Reset form
      setName("");
      setFeatureKey("");
      setDescription("");
      setTags("");
    } catch (error) {
      toast.error("Failed to create feature");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Create Feature</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                const val = e.target.value;

                setName(val);
                setFeatureKey(val?.split(" ").join("-").toLowerCase());
              }}
              placeholder="Dark Mode"
              required
              className="glass"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featureKey">Feature Key</Label>
            <Input
              id="featureKey"
              value={featureKey}
              onChange={(e) => setFeatureKey(e.target.value)}
              placeholder="dark-mode"
              required
              className="glass font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dark theme support with automatic switching"
              className="glass"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ui, theme, accessibility"
              className="glass"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="glass"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addFeatureMutation.isPending}
              className="bg-gradient-primary hover:bg-primary-glow"
            >
              {addFeatureMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
