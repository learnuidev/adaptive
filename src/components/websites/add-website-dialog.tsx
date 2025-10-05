import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useToast } from "@/hooks/use-toast";

interface AddWebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (credential: {
    id: string;
    title: string;
    accessKeyId: string;
    secretKey: string;
  }) => void;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timezones } from "./timezones";
import {
  AddUserWebsiteParam,
  addUserWebsiteParamSchema,
  possibleScopes,
  useAddUserWebsiteMutation,
} from "@/modules/user-websites/use-add-user-website-mutation";

export function AddWebsiteDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddWebsiteDialogProps) {
  const { toast } = useToast();
  const addMutation = useAddUserWebsiteMutation();

  const form = useForm<AddUserWebsiteParam>({
    resolver: zodResolver(addUserWebsiteParamSchema),
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      timeZone: "America/Montreal",
      scopes: [],
    },
  });

  const onSubmit = async (data: AddUserWebsiteParam) => {
    try {
      const result = await addMutation.mutateAsync(data);
      // Use the actual API secret from the response
      const credentialWithSecret = {
        id: result.id,
        title: data.title,
        accessKeyId: result.id,
        secretKey: result.id,
      };
      onSuccess?.(credentialWithSecret);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to add credential",
        description:
          "There was an error adding your credential. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My API Credentials" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of this credential"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., api.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Zone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.name} value={tz.name}>
                          {tz.name} ({tz.offsetStr})
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
              name="scopes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scopes</FormLabel>
                  <div className="gap-8 flex flex-row">
                    {possibleScopes.map((scope) => (
                      <div
                        key={scope.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={scope.value}
                          checked={field.value.includes(scope.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, scope?.value]);
                            } else {
                              field.onChange(
                                field.value.filter((s) => s !== scope.value)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={scope.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {scope.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? "Adding..." : "Add Credential"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
