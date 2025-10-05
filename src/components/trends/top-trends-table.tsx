import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TopMetadataTrendData } from "@/modules/trends/trends.types";
import { Crown, Users, Activity } from "lucide-react";

interface TopTrendsTableProps {
  data: TopMetadataTrendData[];
  metadataField: string;
  isLoading?: boolean;
}

export const TopTrendsTable = ({ data, metadataField, isLoading }: TopTrendsTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Top Trending {metadataField}
          </CardTitle>
          <CardDescription>Loading top trends...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Top Trending {metadataField}
          </CardTitle>
          <CardDescription>No trending data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No trending data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankBadgeVariant = (index: number) => {
    if (index === 0) return "default";
    if (index === 1) return "secondary";
    if (index === 2) return "outline";
    return "outline";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Top Trending {metadataField}
        </CardTitle>
        <CardDescription>
          Most popular values ranked by activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Activity className="h-4 w-4" />
                  Events
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Users className="h-4 w-4" />
                  Users
                </div>
              </TableHead>
              <TableHead className="text-right">Ratio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const ratio = item.unique_users > 0 ? (item.event_count / item.unique_users).toFixed(1) : "0";
              
              return (
                <TableRow key={item.metadata_value}>
                  <TableCell>
                    <Badge variant={getRankBadgeVariant(index)}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.metadata_value}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(item.event_count)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(item.unique_users)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {ratio}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};