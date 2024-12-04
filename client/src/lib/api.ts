import { MealPlan, Preferences } from "@db/schema";

export async function fetchCurrentMealPlan(): Promise<MealPlan> {
  const response = await fetch("/api/meal-plan");
  if (!response.ok) throw new Error("Failed to fetch meal plan");
  return response.json();
}

export async function fetchPreferences(): Promise<Preferences> {
  const response = await fetch("/api/preferences");
  if (!response.ok) throw new Error("Failed to fetch preferences");
  return response.json();
}

export async function updatePreferences(preferences: Partial<Preferences>): Promise<void> {
  const response = await fetch("/api/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences)
  });
  if (!response.ok) throw new Error("Failed to update preferences");
}

export async function generateMealPlan(): Promise<MealPlan> {
  const response = await fetch("/api/meal-plan/generate", { method: "POST" });
  if (!response.ok) throw new Error("Failed to generate meal plan");
  return response.json();
}
