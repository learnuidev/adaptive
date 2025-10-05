import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChartNotesStore } from "@/stores/chart-notes-store";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChartNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartKey: string;
  dataPoint: string;
  dataPointLabel: string;
  credentialId?: string;
}

export function ChartNoteDialog({
  open,
  onOpenChange,
  chartKey,
  dataPoint,
  dataPointLabel,
  credentialId,
}: ChartNoteDialogProps) {
  const { toast } = useToast();
  const { addNote, updateNote, deleteNote, getNoteForPoint } = useChartNotesStore();
  const existingNote = getNoteForPoint(chartKey, dataPoint);
  
  const [note, setNote] = useState("");

  useEffect(() => {
    if (existingNote) {
      setNote(existingNote.note);
    } else {
      setNote("");
    }
  }, [existingNote, open]);

  const handleSave = () => {
    if (!note.trim()) {
      toast({
        title: "Error",
        description: "Note cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (existingNote) {
      updateNote(existingNote.id, note);
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully",
      });
    } else {
      addNote({
        chartKey,
        dataPoint,
        note,
        credentialId,
      });
      toast({
        title: "Note added",
        description: "Your note has been added successfully",
      });
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (existingNote) {
      deleteNote(existingNote.id);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>
            {existingNote ? "Edit Note" : "Add Note"}
          </DialogTitle>
          <DialogDescription>
            Add a note for <strong>{dataPointLabel}</strong> to track important events or changes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Enter your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="glass border-white/10 min-h-[120px]"
            autoFocus
          />
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {existingNote && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="glass border-white/10"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              {existingNote ? "Update" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
