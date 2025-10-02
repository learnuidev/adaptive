import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAddFeatureVersionMutation } from "@/modules/feature/use-add-feature-version-mutation";
import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { useToast } from "@/hooks/use-toast";
import { RolloutRuleBuilder } from "./RolloutRuleBuilder";

interface AddFeatureVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureId: string;
  websiteId: string;
}

export type RolloutRuleGroup = {
  type: "and" | "or";
  fields: Array<{
    field: string;
    op: string;
    value: string;
  }>;
};

export function AddFeatureVersionDialog({
  open,
  onOpenChange,
  featureId,
  websiteId,
}: AddFeatureVersionDialogProps) {
  const [version, setVersion] = useState("");
  const [configJson, setConfigJson] = useState("{}");
  const [isActive, setIsActive] = useState(false);
  const [rolloutPercentage, setRolloutPercentage] = useState<number>(100);
  const [rolloutRules, setRolloutRules] = useState<RolloutRuleGroup[]>([]);

  const { data: user } = useGetAuthUserQuery();
  const { mutate: addVersion, isPending } = useAddFeatureVersionMutation();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!version.match(/^\d+\.\d+\.\d+$/)) {
      toast({
        title: "Invalid version",
        description: "Version must be in semantic format (e.g., 1.0.0)",
        variant: "destructive",
      });
      return;
    }

    let config: Record<string, unknown>;
    try {
      config = JSON.parse(configJson);
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Config must be valid JSON",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    addVersion(
      {
        featureId,
        version,
        config,
        isActive,
        rolloutPercentage,
        rolloutRules: rolloutRules.length > 0 ? rolloutRules : null,
        createdBy: user.id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Feature version added successfully",
          });
          onOpenChange(false);
          setVersion("");
          setConfigJson("{}");
          setIsActive(false);
          setRolloutPercentage(100);
          setRolloutRules([]);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add feature version",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Feature Version</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Version *</Label>
            <Input
              id="version"
              placeholder="1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Semantic version format (e.g., 1.0.0)
            </p>
          </div>

          {/* Config */}
          <div className="space-y-2">
            <Label htmlFor="config">Configuration (JSON)</Label>
            <Textarea
              id="config"
              placeholder='{"feature": "enabled"}'
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-xs text-muted-foreground">
                Enable this version immediately
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Rollout Percentage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Rollout Percentage</Label>
              <span className="text-sm font-medium">{rolloutPercentage}%</span>
            </div>
            <Slider
              value={[rolloutPercentage]}
              onValueChange={([value]) => setRolloutPercentage(value)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Rollout Rules */}
          <div className="space-y-2">
            <Label>Rollout Rules (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Define conditions for when this version should be activated
            </p>
            <RolloutRuleBuilder
              rules={rolloutRules}
              onChange={setRolloutRules}
              websiteId={websiteId}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Creating..." : "Create Version"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
