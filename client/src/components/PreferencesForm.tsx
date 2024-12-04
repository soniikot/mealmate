import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { insertPreferencesSchema, type Preferences } from "@db/schema";
import { fetchPreferences, updatePreferences } from "../lib/api";

export default function PreferencesForm() {
  const { toast } = useToast();
  
  const { data: existingPreferences } = useQuery({
    queryKey: ["preferences"],
    queryFn: fetchPreferences
  });

  const defaultArrayValue = [] as string[];
  const form = useForm<Preferences>({
    resolver: zodResolver(insertPreferencesSchema),
    defaultValues: {
      dietary_restrictions: existingPreferences?.dietary_restrictions ?? defaultArrayValue,
      allergies: existingPreferences?.allergies ?? defaultArrayValue,
      cuisine_preferences: existingPreferences?.cuisine_preferences ?? defaultArrayValue,
      is_vegetarian: existingPreferences?.is_vegetarian ?? false,
      is_vegan: existingPreferences?.is_vegan ?? false,
      is_gluten_free: existingPreferences?.is_gluten_free ?? false,
      servings: existingPreferences?.servings ?? 2
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
                  checked={field.value as boolean}
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
                  checked={field.value as boolean}
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
                  checked={field.value as boolean}
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
                <Input 
                  type="number" 
                  value={field.value?.toString() ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                  onBlur={field.onBlur}
                  name={field.name}
                  min={1} 
                  max={10} 
                />
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