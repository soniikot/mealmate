import { Card } from "@/components/ui/card";
import type { MealPlan } from "@db/schema";

interface MealPlanTimelineProps {
  mealPlan?: MealPlan;
}

interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function MealPlanTimeline({ mealPlan }: MealPlanTimelineProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
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
                <span className="text-sm text-muted-foreground">Breakfast</span>
                <p>{dayMeals?.breakfast || "Not planned"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Lunch</span>
                <p>{dayMeals?.lunch || "Not planned"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Dinner</span>
                <p>{dayMeals?.dinner || "Not planned"}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
