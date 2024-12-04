import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { insertPreferencesSchema } from "@db/schema";
import { fetchPreferences, updatePreferences } from "../lib/api";

export default function PreferencesForm() {
  const { toast } = useToast();
  
  const { data: existingPreferences } = useQuery({
    queryKey: ["preferences"],
    queryFn: fetchPreferences
  });

  const form = useForm({
    resolver: zodResolver(insertPreferencesSchema),
    defaultValues: existingPreferences || {
      dietary_restrictions: [],
      allergies: [],
      cuisine_preferences: [],
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      servings: 2
    }
  });

  const mutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your meal preferences have been saved successfully."
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <FormField
          control={form.control}
          name="is_vegetarian"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Vegetarian</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_vegan"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Vegan</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_gluten_free"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Gluten Free</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Servings</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={1} max={10} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Preferences
        </Button>
      </form>
    </Form>
  );
}
