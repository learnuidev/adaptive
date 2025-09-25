import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your profile and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <p className="text-sm text-muted-foreground">John Doe</p>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <Switch id="weekly-reports" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing">Data Sharing</Label>
              <Switch id="data-sharing" defaultChecked />
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Control your data retention and export options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Data Retention</Label>
              <p className="text-sm text-muted-foreground">Keep data for 12 months</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Application Settings
          </CardTitle>
          <CardDescription>
            Configure application-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-tracking">Analytics Tracking</Label>
              <Switch id="analytics-tracking" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="performance-monitoring">Performance Monitoring</Label>
              <Switch id="performance-monitoring" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="error-reporting">Error Reporting</Label>
              <Switch id="error-reporting" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="feature-flags">Feature Flags</Label>
              <Switch id="feature-flags" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;