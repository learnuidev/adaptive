import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Users, Calendar, Trash2 } from "lucide-react";
import { Cohort } from "@/modules/cohort/cohort.types";
import { format } from "date-fns";
import { useDeleteCohortMutation } from "@/modules/cohort/use-delete-cohort-mutation";
import { toast } from "sonner";

interface CohortCardProps {
  cohort: Cohort;
  websiteId: string;
}

export function CohortCard({ cohort, websiteId }: CohortCardProps) {
  const ruleCount = cohort.cohortRules?.length || 0;
  const deleteCohortMutation = useDeleteCohortMutation();

  const handleDelete = async () => {
    try {
      await deleteCohortMutation.mutateAsync({
        id: cohort.id,
        websiteId,
      });
      toast.success("Cohort deleted successfully");
    } catch (error) {
      toast.error("Failed to delete cohort");
    }
  };

  return (
    <Card className="glass border-border/50 hover:border-primary/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{cohort.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(cohort.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Cohort</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{cohort.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {ruleCount} {ruleCount === 1 ? "rule" : "rules"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
