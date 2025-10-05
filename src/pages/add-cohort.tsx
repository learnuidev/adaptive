import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddCohortMutation } from "@/modules/cohort/use-add-cohort-mutation";
import { toast } from "sonner";
import { RolloutRuleBuilder } from "@/components/features/rollout-rule-builder";
import { ArrowLeft } from "lucide-react";

const AddCohort = () => {
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId || "";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [cohortRules, setCohortRules] = useState<
    Array<{
      type: "and" | "or";
      fields: Array<{ field: string; op: string; value: string }>;
    }>
  >([]);

  const addCohortMutation = useAddCohortMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCohortMutation.mutateAsync({
        name,
        websiteId,
        cohortRules: cohortRules.length > 0 ? cohortRules : null,
      });

      toast.success("Cohort created");
      navigate({ to: `/cohorts/${websiteId}` });
    } catch (error) {
      toast.error("Failed to create cohort");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: `/cohorts/${websiteId}` })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cohorts
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Create Cohort</h1>
          <p className="text-muted-foreground">
            Define a new user segment with custom rules
          </p>
        </div>
      </div>

      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Cohort Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Power Users"
                  required
                  className="glass"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Cohort Rules</CardTitle>
              <p className="text-xs text-muted-foreground">
                Define rules to segment users based on their behavior and
                attributes
              </p>
            </CardHeader>
            <CardContent>
              <RolloutRuleBuilder
                rules={cohortRules}
                onChange={setCohortRules}
                websiteId={websiteId}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: `/cohorts/${websiteId}` })}
              className="glass"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addCohortMutation.isPending}
              className="bg-gradient-primary hover:bg-primary-glow"
            >
              {addCohortMutation.isPending ? "Creating..." : "Create Cohort"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCohort;
