import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { usePreferences } from "../context/PreferencesContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RecipeCard from "../components/RecipeCard";
import MealPlanTimeline from "../components/MealPlanTimeline";
import ShoppingList from "../components/ShoppingList";
import { fetchCurrentMealPlan, updateMealPlan } from "../lib/api";

export default function Dashboard() {
  const { preferences } = usePreferences();
  const queryClient = useQueryClient();
  const { data: mealPlan, isLoading } = useQuery({
    queryKey: ["mealPlan", preferences],
    queryFn: fetchCurrentMealPlan
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-[300px] rounded-lg overflow-hidden mb-8">
        <img 
          src="https://images.unsplash.com/reserve/EnF7DhHROS8OMEp2pCkx_Dufer%20food%20overhead%20hig%20res.jpg"
          alt="Kitchen preparation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Your Meal Planning Assistant</h1>
            <Link href="/preferences">
              <Button variant="secondary" size="lg">
                Update Preferences
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">This Week's Meal Plan</h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <MealPlanTimeline mealPlan={mealPlan} />
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <RecipeCard
              title="Healthy Buddha Bowl"
              image="https://images.unsplash.com/photo-1494390248081-4e521a5940db"
              prepTime={15}
              cookTime={25}
              tags={["Vegetarian", "Healthy"]}
            />
            <RecipeCard
              title="Fresh Summer Salad"
              image="https://images.unsplash.com/photo-1497888329096-51c27beff665"
              prepTime={10}
              cookTime={0}
              tags={["Vegan", "Raw"]}
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Shopping List</h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <ShoppingList 
                items={mealPlan?.shopping_list as Array<{ item: string; category: string; quantity: number; unit: string; }> || []}
                onUpdateItems={async (items) => {
                  try {
                    await updateMealPlan({
                      meals: mealPlan?.meals || [],
                      shopping_list: items
                    });
                    await queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
                  } catch (error) {
                    console.error("Failed to update shopping list:", error);
                  }
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
