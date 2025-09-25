import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";

const Goals = () => {
  const mockGoals = [
    { 
      id: 1, 
      name: "Increase User Signups", 
      target: 1000, 
      current: 750, 
      status: "active",
      period: "This Month"
    },
    { 
      id: 2, 
      name: "Reduce Bounce Rate", 
      target: 25, 
      current: 30, 
      status: "behind",
      period: "This Quarter",
      unit: "%"
    },
    { 
      id: 3, 
      name: "Revenue Growth", 
      target: 50000, 
      current: 42000, 
      status: "active",
      period: "This Quarter",
      unit: "$"
    },
    { 
      id: 4, 
      name: "Page Load Speed", 
      target: 2, 
      current: 1.8, 
      status: "achieved",
      period: "Ongoing",
      unit: "s"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'default';
      case 'active': return 'secondary';
      case 'behind': return 'destructive';
      default: return 'outline';
    }
  };

  const calculateProgress = (current: number, target: number, unit?: string) => {
    if (unit === '%' || unit === 's') {
      // For percentages and time, lower is better for some metrics
      return unit === '%' ? Math.max(0, (target / current) * 100) : Math.min(100, (target / current) * 100);
    }
    return Math.min(100, (current / target) * 100);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Goals</h1>
        <p className="text-muted-foreground">Track progress towards your business objectives</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 achieved this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">
              Target: +30%
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Target</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">
              $42K of $50K goal
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>
            Current progress on your key objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockGoals.map((goal) => {
              const progress = calculateProgress(goal.current, goal.target, goal.unit);
              return (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">{goal.name}</h4>
                      <p className="text-sm text-muted-foreground">{goal.period}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {goal.unit === '$' ? '$' : ''}{goal.current.toLocaleString()}{goal.unit && goal.unit !== '$' ? goal.unit : ''}
                          {' '}/{' '}
                          {goal.unit === '$' ? '$' : ''}{goal.target.toLocaleString()}{goal.unit && goal.unit !== '$' ? goal.unit : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
                      </div>
                      <Badge variant={getStatusColor(goal.status) as any}>
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;