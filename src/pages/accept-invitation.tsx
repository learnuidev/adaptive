import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Shield,
  Eye,
} from "lucide-react";
import { useAcceptInvitationMutation } from "@/modules/team-invitations/use-accept-invitation-mutation.js";
import { useVerifyInvitationTokenQuery } from "@/modules/team-invitations/use-verify-invitation-token-query.js";
import { TeamRole } from "@/components/team/team-invitation.types";
import { toast } from "sonner";
import { useIsAuthenticatedQuery } from "@/modules/auth/use-is-authenticated.query";
import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
// import { useAuth } from "@/hooks/use-auth";

const AcceptInvitationPage = () => {
  const { token } = useParams({ strict: false }) as { token?: string };
  const navigate = useNavigate();
  const { data: user } = useGetAuthUserQuery();

  const isAuthenticated = !!user;

  const [isAccepted, setIsAccepted] = useState(false);

  const verifyInvitationQuery = useVerifyInvitationTokenQuery(token || "");
  const acceptInvitationMutation = useAcceptInvitationMutation();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleAcceptInvitation = async () => {
    if (!token) return;

    try {
      await acceptInvitationMutation.mutateAsync({ token });
      setIsAccepted(true);
      toast.success("Successfully joined the team!");

      // Redirect to team page after successful acceptance
      setTimeout(() => {
        navigate("/team");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to accept invitation");
    }
  };

  const handleLogin = () => {
    // Redirect to login page with invitation token as return URL
    navigate({
      to: "/login",
      search: { returnUrl: `/team/invite/accept/${token}` },
    });
  };

  const handleSignup = () => {
    // Redirect to signup page with invitation token as return URL
    navigate({
      to: "/signup",
      search: { returnUrl: `/team/invite/accept/${token}` },
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "MEMBER":
        return <Users className="h-4 w-4" />;
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">
                Invalid Invitation Link
              </h2>
              <p className="text-muted-foreground">
                This invitation link is invalid or has expired.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyInvitationQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">
                Verifying Invitation
              </h2>
              <p className="text-muted-foreground">
                Please wait while we verify your invitation...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyInvitationQuery.isError || !verifyInvitationQuery.data?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Invalid Invitation</h2>
              <p className="text-muted-foreground mb-4">
                {verifyInvitationQuery.error?.message ||
                  "This invitation is invalid or has expired."}
              </p>
              <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitationData = verifyInvitationQuery.data.data;

  if (isAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">
                Welcome to the Team!
              </h2>
              <p className="text-muted-foreground mb-4">
                You have successfully joined the team. Redirecting to your
                dashboard...
              </p>
              <Button onClick={() => navigate("/team")}>
                Go to Team Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <CardTitle>You're Invited!</CardTitle>
            <CardDescription>
              You've been invited to join a team on Adaptive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Invitation Details:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {invitationData?.email}
                </div>
                <div>
                  <span className="font-medium">Team:</span>{" "}
                  {invitationData?.websiteId}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Role:</span>
                  {getRoleBadge("MEMBER")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                To accept this invitation, please sign in or create an account
              </p>
              <Button onClick={handleLogin} className="w-full">
                Sign In
              </Button>
              <Button
                onClick={handleSignup}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated, show acceptance screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <CardTitle>Accept Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join a team on Adaptive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Invitation Details:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Email:</span>{" "}
                {invitationData?.email}
              </div>
              <div>
                <span className="font-medium">Team:</span>{" "}
                {invitationData?.websiteId}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Role:</span>
                {getRoleBadge("MEMBER")}
              </div>
            </div>
          </div>

          {user?.email?.toLowerCase() !==
          invitationData?.email?.toLowerCase() ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Email Mismatch
                  </p>
                  <p className="text-xs text-yellow-700">
                    This invitation was sent to {invitationData?.email}, but
                    you're signed in as {user?.email}.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={handleAcceptInvitation}
                className="w-full"
                disabled={acceptInvitationMutation.isPending}
              >
                {acceptInvitationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Invitation
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/team")}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitationPage;
