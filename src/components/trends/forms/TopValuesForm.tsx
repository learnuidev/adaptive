import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { List, Play } from "lucide-react";
import { TopMetadataValuesForm, TIME_RANGE_OPTIONS } from "@/modules/trends/trends.types";

interface TopValuesFormProps {
  onSubmit: (data: TopMetadataValuesForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultValues: TopMetadataValuesForm = {
  metadataField: "",
  topN: 10,
  timeRange: "7d",
};

export const TopValuesForm = ({ onSubmit, onCancel, isLoading }: TopValuesFormProps) => {
  const form = useForm<TopMetadataValuesForm>({
    defaultValues,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Top N Metadata Values
        </CardTitle>
        <CardDescription>
          Find the most popular metadata values ranked by activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    The metadata field to analyze top values for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="topN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Top Values</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={100} 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                      />
                    </FormControl>
                    <FormDescription>
                      How many top values to return (1-100)
                    </FormDescription>
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
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Trend"}
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