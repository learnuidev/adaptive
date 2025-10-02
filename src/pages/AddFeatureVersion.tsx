import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAddFeatureVersionMutation } from "@/modules/feature/use-add-feature-version-mutation";
import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { useToast } from "@/hooks/use-toast";
import { RolloutRuleBuilder } from "@/components/feature-flags/RolloutRuleBuilder";
import { ArrowLeft } from "lucide-react";
// import { RolloutRuleGroup } from "@/components/feature-flags/AddFeatureVersionDialog";
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

export default function AddFeatureVersion() {
  const params = useParams({ strict: false }) as {
    credentialId?: string;
    featureId?: string;
  };
  const navigate = useNavigate();
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
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

    if (!params.featureId) {
      toast({
        title: "Error",
        description: "Feature ID is missing",
        variant: "destructive",
      });
      return;
    }

    addVersion(
      {
        description,
        featureId: params.featureId,
        version,
        config,
        isActive,
        rolloutPercentage,
        rolloutRules: rolloutRules.length > 0 ? rolloutRules : null,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Feature version added successfully",
          });
          navigate({
            to: `/features/${params.credentialId}/${params.featureId}`,
          });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() =>
              navigate({
                to: `/features/${params.credentialId}/${params.featureId}`,
              })
            }
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feature
          </Button>

          <h1 className="text-2xl font-bold text-foreground">
            Add Feature Version
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new version for this feature with custom configuration and
            rollout rules
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="p-6 space-y-6">
          {/* Version */}
          <div className="space-y-2">
            <Label htmlFor="version">Description</Label>
            <Input
              id="version"
              placeholder="Add a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A sample description for this version (e.g., "Add a new feature")
            </p>
          </div>
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
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Define the configuration for this version in JSON format
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="isActive" className="text-base">
                Active
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
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
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base">Rollout Percentage</Label>
              <span className="text-lg font-semibold">
                {rolloutPercentage}%
              </span>
            </div>
            <Slider
              value={[rolloutPercentage]}
              onValueChange={([value]) => setRolloutPercentage(value)}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Control what percentage of users receive this version
            </p>
          </div>

          {/* Rollout Rules */}
          <div className="space-y-3">
            <div>
              <Label className="text-base">Rollout Rules (Optional)</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Define conditions for when this version should be activated
              </p>
            </div>
            <RolloutRuleBuilder
              rules={rolloutRules}
              onChange={setRolloutRules}
              websiteId={params.credentialId || ""}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  to: `/features/${params.credentialId}/${params.featureId}`,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-gradient-primary hover:bg-primary-glow"
            >
              {isPending ? "Creating..." : "Create Version"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
