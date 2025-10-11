import { useState } from "react";
import {
  getRouteApi,
  Route,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Mail,
  Settings,
  Plus,
  Shield,
  Eye,
  UserCheck,
  Building,
  Loader2,
} from "lucide-react";
import { CredentialSelector } from "@/components/websites/website-selector";
import { TeamInvitationsList } from "@/components/team/team-invitations-list";
import { TeamInvitationDialog } from "@/components/team/team-invitation-dialog";
import { PendingInvitations } from "@/components/team/pending-invitations";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { useGetCurrentWebsite } from "@/hooks/use-get-current-website";
import {
  useCreateTeamMutation,
  CreateTeamRequestSchema,
} from "@/modules/teams/use-create-team-mutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifyInvitationTokenQuery } from "@/modules/team-invitations/use-verify-invitation-token-query";
import { useAcceptInvitationMutation } from "@/modules/team-invitations/use-accept-invitation-mutation";

// Mock team members data - in a real app, this would come from an API
const mockTeamMembers = [
  {
    id: "1",
    email: "admin@example.com",
    role: "ADMIN",
    addedAt: new Date("2024-01-15").toISOString(),
    lastActiveAt: new Date("2024-10-06").toISOString(),
    status: "active",
  },
  {
    id: "2",
    email: "developer@example.com",
    role: "MEMBER",
    addedAt: new Date("2024-02-20").toISOString(),
    lastActiveAt: new Date("2024-10-05").toISOString(),
    status: "active",
  },
];

const TeamManagementPage = () => {
  const { data: user } = useGetAuthUserQuery();
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  // const searchParams = useSearchParams()

  // const routeApi = getRouteApi("/teams/$websiteId");
  // @ts-ignore
  const search = useSearch<any>("/teams/$websiteId");

  const { data } = useVerifyInvitationTokenQuery(search?.token);

  console.log("search", data);

  // console.log("route Api", routeApi);

  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;

  const createTeamMutation = useCreateTeamMutation();

  const teamForm = useForm<z.infer<typeof CreateTeamRequestSchema>>({
    resolver: zodResolver(CreateTeamRequestSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onCreateTeam = async (
    values: z.infer<typeof CreateTeamRequestSchema>
  ) => {
    console.log("values", values);
    try {
      await createTeamMutation.mutateAsync(values);
      teamForm.reset();
      setShowCreateTeamDialog(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "MEMBER":
        return <UserCheck className="h-4 w-4" />;
      case "VIEWER":
        return <Eye className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: "bg-purple-100 text-purple-800",
      MEMBER: "bg-blue-100 text-blue-800",
      VIEWER: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[role as keyof typeof colors]} variant="outline">
        <div className="flex items-center gap-1">
          {getRoleIcon(role)}
          {role}
        </div>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge
        className={colors[status as keyof typeof colors]}
        variant="outline"
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!websiteId) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-muted-foreground">
            Manage team members and invitations for your websites.
          </p>
        </div>

        <NoWebsiteMessage />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Management</h1>
            <p className="text-muted-foreground">
              Manage team members and invitations for your website.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* <CredentialSelector onCredentialChange={setSelectedWebsite} /> */}
            <Dialog
              open={showCreateTeamDialog}
              onOpenChange={setShowCreateTeamDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Building className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Create New Team
                  </DialogTitle>
                  <DialogDescription>
                    Create a new team to collaborate with others.
                  </DialogDescription>
                </DialogHeader>

                <Form {...teamForm}>
                  <form
                    onSubmit={teamForm.handleSubmit(onCreateTeam)}
                    className="space-y-4"
                  >
                    <FormField
                      control={teamForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter team name..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={teamForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your team..."
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
                        onClick={() => setShowCreateTeamDialog(false)}
                        disabled={createTeamMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createTeamMutation.isPending}
                      >
                        {createTeamMutation.isPending ? (
                          <>
                            {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                            Creating...
                          </>
                        ) : (
                          <>
                            {/* <Plus className="h-4 w-4 mr-2" /> */}
                            Create Team
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <TeamInvitationDialog
              websiteId={websiteId}
              onSuccess={() => {
                // Refresh invitations list
              }}
            >
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </TeamInvitationDialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invitations
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Your Invitations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Current team members with access to this website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockTeamMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No team members yet.</p>
                  <p className="text-sm">
                    Invite team members to collaborate on this website.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Added {formatDate(member.addedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRoleBadge(member.role)}
                        {getStatusBadge(member.status)}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <TeamInvitationsList websiteId={websiteId} />
        </TabsContent>

        <TabsContent value="pending">
          {user?.email && <PendingInvitations userEmail={user.email} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagementPage;
