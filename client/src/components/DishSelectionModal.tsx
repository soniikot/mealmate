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
  {
    id: 1,
    name: "Overnight Oats",
    description: "Healthy breakfast option",
    ingredients: [{ item: "oats", amount: 1, unit: "cup" }],
    instructions: ["Mix ingredients", "Refrigerate overnight"],
    prep_time: 10,
    cook_time: 0,
    image_url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf",
    tags: ["breakfast", "healthy"]
  },
  {
    id: 2,
    name: "Quinoa Bowl",
    description: "Protein-rich lunch",
    ingredients: [{ item: "quinoa", amount: 1, unit: "cup" }],
    instructions: ["Cook quinoa", "Add toppings"],
    prep_time: 15,
    cook_time: 20,
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    tags: ["lunch", "healthy"]
  }
];

export default function DishSelectionModal({ isOpen, onClose, onSelect, mealType }: DishSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDish, setSelectedDish] = useState<Partial<Recipe> | null>(null);

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const handleSelect = () => {
    if (selectedDish?.name) {
      onSelect(selectedDish.name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</DialogTitle>
        </DialogHeader>
        
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
              className={`cursor-pointer transition-colors ${
                selectedDish?.id === recipe.id ? 'border-primary' : ''
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
          <Button onClick={handleSelect} disabled={!selectedDish}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
