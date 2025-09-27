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
import { useAddUserCredentialMutation, AddUserCredentialParam, addUserCredentialParamSchema, possibleScops } from "@/modules/user-credentials/use-add-user-credential-mutation";
import { useToast } from "@/hooks/use-toast";

interface AddCredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (credentialId: string) => void;
}

export function AddCredentialDialog({ open, onOpenChange, onSuccess }: AddCredentialDialogProps) {
  const { toast } = useToast();
  const addMutation = useAddUserCredentialMutation();
  
  const form = useForm<AddUserCredentialParam>({
    resolver: zodResolver(addUserCredentialParamSchema),
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      scopes: [],
    },
  });

  const onSubmit = async (data: AddUserCredentialParam) => {
    try {
      const result = await addMutation.mutateAsync(data);
      toast({
        title: "Credential added successfully",
        description: `${data.title} has been configured and is ready to use.`,
      });
      onSuccess?.(result.id);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to add credential",
        description: "There was an error adding your credential. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
                    <Input placeholder="Brief description of this credential" {...field} />
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
              name="scopes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scopes</FormLabel>
                  <div className="space-y-2">
                    {possibleScops.map((scope) => (
                      <div key={scope} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope}
                          checked={field.value.includes(scope)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, scope]);
                            } else {
                              field.onChange(field.value.filter(s => s !== scope));
                            }
                          }}
                        />
                        <label htmlFor={scope} className="text-sm font-medium">
                          {scope}
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
              <Button 
                type="submit" 
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? "Adding..." : "Add Credential"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}