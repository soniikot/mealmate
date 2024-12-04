import { MealPlan, Preferences } from "@db/schema";

export async function fetchCurrentMealPlan() {
  const response = await fetch("/api/meal-plan");
  if (!response.ok) throw new Error("Failed to fetch meal plan");
  return response.json();
}

export async function generateMealPlan() {
  const response = await fetch("/api/meal-plan/generate", { method: "POST" });
  if (!response.ok) throw new Error("Failed to generate meal plan");
  return response.json();
}

export async function updateMealPlan(mealPlan: any) {
  const response = await fetch("/api/meal-plan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mealPlan)
  });
  if (!response.ok) throw new Error("Failed to update meal plan");
  return response.json();
}
