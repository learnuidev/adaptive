import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Plus, UserPlus } from "lucide-react";
import { useCreateTeamInvitationMutation } from "@/modules/team-invitations/use-create-team-invitation-mutation.js";

import { toast } from "sonner";
// import { CreateInvitationRequestSchema } from "adaptive.fyi";
import { useState } from "react";
import { TeamRole } from "./team-invitation.types";

export const CreateInvitationRequestSchema = z.object({
  email: z.email(),
  websiteId: z.ulid().optional(),
  role: z.nativeEnum(TeamRole),
  message: z.string().optional(),
});

const formSchema = CreateInvitationRequestSchema;

type FormValues = z.infer<typeof formSchema>;

interface TeamInvitationDialogProps {
  websiteId: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function TeamInvitationDialog({
  websiteId,
  children,
  onSuccess,
}: TeamInvitationDialogProps) {
  console.log("WEBSITE ID", websiteId);
  const [open, setOpen] = useState(false);

  const createInvitationMutation = useCreateTeamInvitationMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: TeamRole.MEMBER,
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createInvitationMutation.mutateAsync({
        ...values,
        websiteId,
      });

      toast.success(`Invitation sent to ${values.email}`);
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation");
    }
  };

  const getRoleDescription = (role: TeamRole) => {
    switch (role) {
      case TeamRole.ADMIN:
        return "Full access to all features and settings";
      case TeamRole.MEMBER:
        return "Can view and edit most content";
      case TeamRole.VIEWER:
        return "Read-only access to analytics";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on this website.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="colleague@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TeamRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{role}</span>
                            <span className="text-xs text-muted-foreground">
                              {getRoleDescription(role)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This determines what the team member can access.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal message to the invitation..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createInvitationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createInvitationMutation.isPending}
              >
                {createInvitationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
