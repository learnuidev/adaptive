import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users as UsersIcon, UserPlus, Activity, Clock } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { CredentialSelector } from "@/components/credentials/CredentialSelector";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";

const Users = () => {
  const { credentialId } = useParams({ from: '/users/$credentialId' });
  const { data: credentials } = useListUserCredentialsQuery();
  
  const currentCredential = credentials?.find(cred => cred.id === credentialId);

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active", lastSeen: "2 mins ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active", lastSeen: "5 mins ago" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "inactive", lastSeen: "2 hours ago" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", status: "active", lastSeen: "1 min ago" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            {currentCredential ? `Manage users for ${currentCredential.title}` : "Manage and analyze your user base"}
          </p>
        </div>
        <CredentialSelector />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12 since yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-muted-foreground">
              +1m 12s from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>
            Latest user activity and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 glass">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;