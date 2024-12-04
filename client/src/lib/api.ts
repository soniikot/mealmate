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

export async function updateMealPlan(mealPlan: {
  meals: Array<{
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }>;
  shopping_list: Array<{
    item: string;
    category: string;
    quantity: number;
    unit: string;
  }>;
}) {
  const response = await fetch("/api/meal-plan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mealPlan)
  });
  if (!response.ok) throw new Error("Failed to update meal plan");
  return response.json();
}

export async function updateShoppingList(items: Array<{
  item: string;
  category: string;
  quantity: number;
  unit: string;
}>) {
  const currentMealPlan = await fetchCurrentMealPlan();
  const response = await fetch("/api/meal-plan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...currentMealPlan,
      shopping_list: items
    })
  });
  if (!response.ok) throw new Error("Failed to update shopping list");
  return response.json();
}
