import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { MealPlan } from "@db/schema";
import DishSelectionModal from "./DishSelectionModal";
import { updateMealPlan } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

type MealDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

interface MealPlanTimelineProps {
  mealPlan?: {
    meals: MealDay[];
    shopping_list: Array<{
      item: string;
      category: string;
      quantity: number;
      unit: string;
    }>;
  };
}

export default function MealPlanTimeline({ mealPlan }: MealPlanTimelineProps) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | null
  >(null);

  const handleAddDish = (
    day: string,
    mealType: "breakfast" | "lunch" | "dinner",
  ) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsModalOpen(true);
  };

  const handleDishSelect = async (dishName: string) => {
    if (!selectedDay || !selectedMealType) return;

    const currentMeals = mealPlan?.meals || [];
    console.log('Current meals:', currentMeals);

    const updatedMeals = [...currentMeals];
    const dayIndex = updatedMeals.findIndex((meal) => meal.day === selectedDay);
    
    if (dayIndex === -1) {
      // Create new day entry
      updatedMeals.push({
        day: selectedDay,
        breakfast: selectedMealType === "breakfast" ? dishName : "",
        lunch: selectedMealType === "lunch" ? dishName : "",
        dinner: selectedMealType === "dinner" ? dishName : ""
      });
    } else {
      // Update existing day
      updatedMeals[dayIndex] = {
        ...updatedMeals[dayIndex],
        [selectedMealType]: dishName
      };
    }

    console.log('Updated meals:', updatedMeals);

    try {
      const updatedMealPlan = await updateMealPlan({
        meals: updatedMeals,
        shopping_list: mealPlan?.shopping_list || []
      });
      console.log('Server response:', updatedMealPlan);
      await queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update meal plan:", error);
    }
  };

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const dayMeals = mealPlan?.meals?.find((meal) => meal.day === day);
        console.log('Day meals for', day, ':', dayMeals);

        return (
          <Card key={day} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{day}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    Breakfast
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddDish(day, "breakfast")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">{dayMeals?.breakfast || "Not planned"}</p>
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
                <p className="text-sm">{dayMeals?.lunch || "Not planned"}</p>
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
                <p className="text-sm">{dayMeals?.dinner || "Not planned"}</p>
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
