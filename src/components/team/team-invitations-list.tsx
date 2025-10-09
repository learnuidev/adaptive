import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Mail, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useWebsiteInvitationsQuery } from "@/modules/team-invitations/use-list-team-invitations-query.js";
import {
  useAcceptInvitationMutation,
  useRejectInvitationMutation,
} from "@/modules/team-invitations/use-update-invitation-status-mutation.js";

import { toast } from "sonner";

import { InvitationStatus, TeamRole } from "./team-invitation.types";

interface TeamInvitationsListProps {
  websiteId: string;
}

export function TeamInvitationsList({ websiteId }: TeamInvitationsListProps) {
  const {
    data: invitationsData,
    isLoading,
    error,
  } = useWebsiteInvitationsQuery(websiteId);
  const acceptInvitationMutation = useAcceptInvitationMutation();
  const rejectInvitationMutation = useRejectInvitationMutation();

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitationMutation.mutateAsync(invitationId);
      toast.success("Invitation accepted");
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

  const getStatusBadge = (status: InvitationStatus) => {
    const variants = {
      [InvitationStatus.PENDING]: "default",
      [InvitationStatus.ACCEPTED]: "default",
      [InvitationStatus.REJECTED]: "secondary",
      [InvitationStatus.EXPIRED]: "outline",
    } as const;

    const colors = {
      [InvitationStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [InvitationStatus.ACCEPTED]: "bg-green-100 text-green-800",
      [InvitationStatus.REJECTED]: "bg-red-100 text-red-800",
      [InvitationStatus.EXPIRED]: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status]} variant={variants[status]}>
        {status}
      </Badge>
    );
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
          <CardTitle>Team Invitations</CardTitle>
          <CardDescription>Loading invitations...</CardDescription>
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
          <CardTitle>Team Invitations</CardTitle>
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
          Team Invitations
        </CardTitle>
        <CardDescription>
          Manage invitations for team members to collaborate on this website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No invitations sent yet.</p>
            <p className="text-sm">
              Invite team members to collaborate on this website.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    {invitation.email}
                  </TableCell>
                  <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
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
                    {invitation.status === InvitationStatus.PENDING &&
                      !isInvitationExpired(invitation.expiresAt) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleAcceptInvitation(invitation.id)
                              }
                              disabled={acceptInvitationMutation.isPending}
                            >
                              {acceptInvitationMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4 mr-2" />
                              )}
                              Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRejectInvitation(invitation.id)
                              }
                              disabled={rejectInvitationMutation.isPending}
                              className="text-red-600"
                            >
                              {rejectInvitationMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <UserX className="h-4 w-4 mr-2" />
                              )}
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
