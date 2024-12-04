import { MealPlan, Preferences } from "@db/schema";

export async function fetchCurrentMealPlan(): Promise<MealPlan> {
  const response = await fetch("/api/meal-plan");
  if (!response.ok) throw new Error("Failed to fetch meal plan");
  return response.json();
}

// Preferences are now handled by context

export async function generateMealPlan(): Promise<MealPlan> {
  const response = await fetch("/api/meal-plan/generate", { method: "POST" });
  if (!response.ok) throw new Error("Failed to generate meal plan");
  return response.json();
}

export async function updateMealPlan(mealPlan: Partial<MealPlan>): Promise<MealPlan> {
  const response = await fetch("/api/meal-plan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mealPlan)
  });
  if (!response.ok) throw new Error("Failed to update meal plan");
  return response.json();
}
