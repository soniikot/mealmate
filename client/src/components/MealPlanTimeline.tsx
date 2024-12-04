import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { MealPlan } from "@db/schema";
import DishSelectionModal from "./DishSelectionModal";
import { updateMealPlan } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface MealPlanTimelineProps {
  mealPlan?: MealPlan;
}

type MealDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

export default function MealPlanTimeline({ mealPlan }: { mealPlan?: { meals: MealDay[] } }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | null>(null);

  const handleAddDish = (day: string, mealType: "breakfast" | "lunch" | "dinner") => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsModalOpen(true);
  };

  const handleDishSelect = async (dishName: string) => {
    if (!selectedDay || !selectedMealType || !mealPlan) return;

    const currentMeals = [...(mealPlan.meals || [])] as MealDay[];
    const dayIndex = currentMeals.findIndex(meal => meal.day === selectedDay);

    if (dayIndex === -1) {
      currentMeals.push({
        day: selectedDay,
        breakfast: selectedMealType === "breakfast" ? dishName : "",
        lunch: selectedMealType === "lunch" ? dishName : "",
        dinner: selectedMealType === "dinner" ? dishName : ""
      });
    } else {
      currentMeals[dayIndex] = {
        ...currentMeals[dayIndex],
        [selectedMealType]: dishName
      };
    }

    try {
      await updateMealPlan({
        ...mealPlan,
        meals: currentMeals
      });
      queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update meal plan:", error);
    }
  };
  
  return (
    <div className="space-y-4">
      {days.map((day) => {
        const meals = mealPlan?.meals as MealDay[] | undefined;
        const dayMeals = meals?.find((meal) => meal.day === day);
        
        return (
          <Card key={day} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{day}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Breakfast</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddDish(day, "breakfast")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p>{dayMeals?.breakfast || "Not planned"}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Lunch</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddDish(day, "lunch")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p>{dayMeals?.lunch || "Not planned"}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Dinner</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddDish(day, "dinner")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p>{dayMeals?.dinner || "Not planned"}</p>
              </div>
            </div>
          </Card>
        );
      })}
      
      <DishSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleDishSelect}
        mealType={selectedMealType || "breakfast"}
      />
    </div>
  );
}
