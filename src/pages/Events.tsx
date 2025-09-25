import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MousePointer, Eye, UserPlus } from "lucide-react";

const Events = () => {
  const mockEvents = [
    { id: 1, name: "Page View", count: 1234, type: "tracking", time: "2 mins ago" },
    { id: 2, name: "Button Click", count: 567, type: "interaction", time: "5 mins ago" },
    { id: 3, name: "User Signup", count: 89, type: "conversion", time: "10 mins ago" },
    { id: 4, name: "Form Submit", count: 234, type: "interaction", time: "15 mins ago" },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'tracking': return Eye;
      case 'interaction': return MousePointer;
      case 'conversion': return UserPlus;
      default: return Activity;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'tracking': return 'default';
      case 'interaction': return 'secondary';
      case 'conversion': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <p className="text-muted-foreground">Track and analyze user events and interactions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">
              +24% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,234</div>
            <p className="text-xs text-muted-foreground">
              +18% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interactions</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,567</div>
            <p className="text-xs text-muted-foreground">
              +32% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">655</div>
            <p className="text-xs text-muted-foreground">
              +15% from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Latest user events and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents.map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 glass">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.count} events</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getEventColor(event.type) as any}>
                      {event.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{event.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;