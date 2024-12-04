import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { Recipe } from "@db/schema";

interface DishSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dishName: string) => void;
  mealType: "breakfast" | "lunch" | "dinner";
}

// Mock data for now - will be replaced with actual API data
const mockRecipes: Partial<Recipe>[] = [
  // Breakfast options
  {
    id: 1,
    name: "Overnight Oats",
    description: "Healthy breakfast option with fresh berries",
    ingredients: [
      { item: "oats", amount: 1, unit: "cup" },
      { item: "almond milk", amount: 1, unit: "cup" },
      { item: "berries", amount: 0.5, unit: "cup" }
    ],
    prep_time: 10,
    cook_time: 0,
    image_url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf",
    tags: ["breakfast", "healthy", "vegan"]
  },
  {
    id: 2,
    name: "Greek Yogurt Parfait",
    description: "Quick and protein-rich breakfast",
    ingredients: [
      { item: "greek yogurt", amount: 1, unit: "cup" },
      { item: "granola", amount: 0.5, unit: "cup" },
      { item: "honey", amount: 1, unit: "tbsp" }
    ],
    prep_time: 5,
    cook_time: 0,
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    tags: ["breakfast", "healthy", "quick", "protein"]
  },
  {
    id: 3,
    name: "Avocado Toast",
    description: "Classic breakfast with whole grain bread",
    ingredients: [
      { item: "whole grain bread", amount: 2, unit: "slices" },
      { item: "avocado", amount: 1, unit: "whole" },
      { item: "cherry tomatoes", amount: 0.5, unit: "cup" }
    ],
    prep_time: 10,
    cook_time: 5,
    image_url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
    tags: ["breakfast", "vegetarian", "healthy"]
  },
  // Lunch options
  {
    id: 4,
    name: "Quinoa Buddha Bowl",
    description: "Nutritious lunch bowl with seasonal vegetables",
    ingredients: [
      { item: "quinoa", amount: 1, unit: "cup" },
      { item: "mixed vegetables", amount: 2, unit: "cups" },
      { item: "chickpeas", amount: 1, unit: "cup" }
    ],
    prep_time: 15,
    cook_time: 20,
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    tags: ["lunch", "healthy", "vegetarian", "protein"]
  },
  {
    id: 5,
    name: "Mediterranean Salad",
    description: "Fresh salad with feta and olives",
    ingredients: [
      { item: "mixed greens", amount: 2, unit: "cups" },
      { item: "feta cheese", amount: 0.5, unit: "cup" },
      { item: "kalamata olives", amount: 0.25, unit: "cup" }
    ],
    prep_time: 15,
    cook_time: 0,
    image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    tags: ["lunch", "vegetarian", "quick", "low-carb"]
  },
  {
    id: 6,
    name: "Chicken Caesar Wrap",
    description: "Classic Caesar salad in a wrap",
    ingredients: [
      { item: "grilled chicken", amount: 6, unit: "oz" },
      { item: "romaine lettuce", amount: 2, unit: "cups" },
      { item: "whole wheat wrap", amount: 1, unit: "piece" }
    ],
    prep_time: 20,
    cook_time: 15,
    image_url: "https://images.unsplash.com/photo-1550507992-eb63ffee0847",
    tags: ["lunch", "protein", "quick"]
  },
  // Dinner options
  {
    id: 7,
    name: "Grilled Salmon",
    description: "Omega-rich dinner with roasted vegetables",
    ingredients: [
      { item: "salmon fillet", amount: 6, unit: "oz" },
      { item: "asparagus", amount: 1, unit: "bunch" },
      { item: "lemon", amount: 1, unit: "whole" }
    ],
    prep_time: 10,
    cook_time: 15,
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    tags: ["dinner", "protein", "healthy", "low-carb"]
  },
  {
    id: 8,
    name: "Vegetarian Stir-Fry",
    description: "Quick and colorful vegetable stir-fry",
    ingredients: [
      { item: "tofu", amount: 14, unit: "oz" },
      { item: "mixed vegetables", amount: 4, unit: "cups" },
      { item: "brown rice", amount: 1, unit: "cup" }
    ],
    prep_time: 20,
    cook_time: 15,
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    tags: ["dinner", "vegetarian", "vegan", "healthy"]
  },
  {
    id: 9,
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta dish",
    ingredients: [
      { item: "whole wheat spaghetti", amount: 8, unit: "oz" },
      { item: "ground beef", amount: 1, unit: "lb" },
      { item: "tomato sauce", amount: 2, unit: "cups" }
    ],
    prep_time: 15,
    cook_time: 30,
    image_url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    tags: ["dinner", "protein", "classic"]
  }
];

export default function DishSelectionModal({ isOpen, onClose, onSelect, mealType }: DishSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDish, setSelectedDish] = useState<Partial<Recipe> | null>(null);

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const handleSelect = () => {
    if (!selectedDish?.name) return;
    onSelect(selectedDish.name);
    setSelectedDish(null);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="meal-selection-description">
        <DialogHeader>
          <DialogTitle>Select {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</DialogTitle>
        </DialogHeader>
        <div id="meal-selection-description" className="sr-only">
          Select a meal for your meal plan
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dishes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 my-4 max-h-[400px] overflow-y-auto">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className={`cursor-pointer transition-colors hover:border-primary ${
                selectedDish?.id === recipe.id ? 'border-2 border-primary' : ''
              }`}
              onClick={() => setSelectedDish(recipe)}
            >
              <CardContent className="p-4">
                <div className="aspect-video relative mb-2">
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
                <h3 className="font-medium">{recipe.name}</h3>
                <p className="text-sm text-muted-foreground">{recipe.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedDish}
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
