import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, Clock, Activity } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { CredentialSelector } from "@/components/credentials/CredentialSelector";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";

const Performance = () => {
  const { credentialId } = useParams({ from: '/performance/$credentialId' });
  const { data: credentials } = useListUserCredentialsQuery();
  
  const currentCredential = credentials?.find(cred => cred.id === credentialId);

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Performance</h1>
          <p className="text-muted-foreground">
            {currentCredential ? `Monitor performance for ${currentCredential.title}` : "Monitor your application's performance metrics"}
          </p>
        </div>
        <CredentialSelector />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Web Vitals</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">
              Performance Score
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.02%</div>
            <p className="text-xs text-muted-foreground">
              -0.01% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
            <CardDescription>
              Average response times for different endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">/api/users</span>
                <span className="text-sm text-muted-foreground">145ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">/api/analytics</span>
                <span className="text-sm text-muted-foreground">89ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">/api/events</span>
                <span className="text-sm text-muted-foreground">234ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current system status and health metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Performance;