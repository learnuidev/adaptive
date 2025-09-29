import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Clock, Play } from "lucide-react";
import { MetadataTimelineForm, TIME_RANGE_OPTIONS, GROUP_BY_TIME_OPTIONS } from "@/modules/trends/trends.types";

interface TimelineFormProps {
  onSubmit: (data: MetadataTimelineForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultValues: MetadataTimelineForm = {
  metadataField: "",
  metadataValue: "",
  timeRange: "30d",
  groupByTime: "day",
};

export const TimelineForm = ({ onSubmit, onCancel, isLoading }: TimelineFormProps) => {
  const form = useForm<MetadataTimelineForm>({
    defaultValues,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Metadata Timeline
        </CardTitle>
        <CardDescription>
          Track a specific metadata value's performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      The metadata field to analyze
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadataValue"
                rules={{ required: "Metadata value is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata Value</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., specific content ID or category name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The specific value to track over time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                    <FormDescription>
                      Time period to analyze
                    </FormDescription>
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
                          <SelectValue />
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
                    <FormDescription>
                      Time grouping for the timeline
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Timeline"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};