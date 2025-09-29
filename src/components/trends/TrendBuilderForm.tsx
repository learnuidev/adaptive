import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Play, Settings } from "lucide-react";
import { 
  TrendBuilderForm as TrendBuilderFormType, 
  TREND_TYPE_OPTIONS, 
  TIME_RANGE_OPTIONS, 
  GROUP_BY_TIME_OPTIONS 
} from "@/modules/trends/trends.types";

interface TrendBuilderFormProps {
  onSubmit: (data: TrendBuilderFormType) => void;
  isLoading?: boolean;
}

const defaultValues: TrendBuilderFormType = {
  metadataField: "",
  trendType: "count",
  timeRange: "7d",
  eventType: "",
  groupByTime: "day",
  limit: 50,
};

export const TrendBuilderForm = ({ onSubmit, isLoading }: TrendBuilderFormProps) => {
  const form = useForm<TrendBuilderFormType>({
    defaultValues,
  });

  const handleSubmit = (data: TrendBuilderFormType) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Trend Builder
        </CardTitle>
        <CardDescription>
          Configure your custom trend analysis parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metadataField"
                rules={{ required: "Metadata field is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Field</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., contentid, category, userId" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The metadata field to analyze trends for
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., pageview, click, purchase" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Filter by specific event type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="trendType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trend Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trend type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TREND_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_RANGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupByTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group By</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grouping" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GROUP_BY_TIME_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result Limit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={1000} 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 50)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of results to return (1-1000)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              {isLoading ? "Generating Trends..." : "Generate Trends"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};