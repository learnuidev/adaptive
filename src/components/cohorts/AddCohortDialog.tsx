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
import { useAddCohortMutation } from "@/modules/cohort/use-add-cohort-mutation";
import { toast } from "sonner";
import { RolloutRuleBuilder } from "@/components/features/RolloutRuleBuilder";

interface AddCohortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
}

export function AddCohortDialog({
  open,
  onOpenChange,
  websiteId,
}: AddCohortDialogProps) {
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
      onOpenChange(false);

      // Reset form
      setName("");
      setCohortRules([]);
    } catch (error) {
      toast.error("Failed to create cohort");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Cohort</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label>Cohort Rules</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Define rules to segment users based on their behavior and attributes
            </p>
            <RolloutRuleBuilder
              rules={cohortRules}
              onChange={setCohortRules}
              websiteId={websiteId}
            />
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
              disabled={addCohortMutation.isPending}
              className="bg-gradient-primary hover:bg-primary-glow"
            >
              {addCohortMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
