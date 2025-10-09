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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, UserCheck, UserX, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePendingInvitationsQuery } from "@/modules/team-invitations/use-list-team-invitations-query.js";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from "@/modules/team-invitations/use-update-invitation-status-mutation.js";

import { toast } from "sonner";
import { TeamRole } from "./team-invitation.types";

interface PendingInvitationsProps {
  userEmail: string;
}

export function PendingInvitations({ userEmail }: PendingInvitationsProps) {
  const {
    data: invitationsData,
    isLoading,
    error,
  } = usePendingInvitationsQuery(userEmail);
  const acceptInvitationMutation = useAcceptInvitationMutation();
  const rejectInvitationMutation = useRejectInvitationMutation();

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitationMutation.mutateAsync(invitationId);
      toast.success("Invitation accepted! You now have access to the website.");
    } catch (error: any) {
      toast.error(error.message || "Failed to accept invitation");
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await rejectInvitationMutation.mutateAsync(invitationId);
      toast.success("Invitation rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject invitation");
    }
  };

  const getRoleBadge = (role: TeamRole) => {
    const colors = {
      [TeamRole.ADMIN]: "bg-purple-100 text-purple-800",
      [TeamRole.MEMBER]: "bg-blue-100 text-blue-800",
      [TeamRole.VIEWER]: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[role]} variant="outline">
        {role}
      </Badge>
    );
  };

  const isInvitationExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Loading your invitations...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Failed to load invitations</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-red-600">
            Error loading invitations. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const invitations = invitationsData?.invitations || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Your Pending Invitations
        </CardTitle>
        <CardDescription>
          You have been invited to collaborate on these websites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending invitations.</p>
            <p className="text-sm">
              When someone invites you to collaborate, it will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Website ID: {invitation.websiteId.substring(0, 8)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {invitation.invitedBy}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(invitation.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {isInvitationExpired(invitation.expiresAt) ? (
                      <Badge variant="outline" className="text-red-600">
                        Expired
                      </Badge>
                    ) : (
                      formatDistanceToNow(new Date(invitation.expiresAt), {
                        addSuffix: true,
                      })
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isInvitationExpired(invitation.expiresAt) ? (
                      <span className="text-sm text-muted-foreground">
                        Expired
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          disabled={acceptInvitationMutation.isPending}
                        >
                          {acceptInvitationMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserCheck className="h-4 w-4 mr-2" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectInvitation(invitation.id)}
                          disabled={rejectInvitationMutation.isPending}
                        >
                          {rejectInvitationMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserX className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
