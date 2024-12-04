import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Link } from "wouter";
import type { Recipe } from "@db/schema";

interface DishSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dishName: string, ingredients: Array<{ item: string; amount: number; unit: string }>) => void;
  mealType: "breakfast" | "lunch" | "dinner";
}

export default function DishSelectionModal({ isOpen, onClose, onSelect, mealType }: DishSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDish, setSelectedDish] = useState<Partial<Recipe> | null>(null);
  const [recipes, setRecipes] = useState<Partial<Recipe>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/recipes/${mealType}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch recipes");
        }
        
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch recipes");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchRecipes();
    }
  }, [isOpen, mealType]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const handleSelect = () => {
    if (!selectedDish?.name) return;
    
    // Pass both the dish name and ingredients
    onSelect(
      selectedDish.name,
      (selectedDish.ingredients as Array<{ item: string; amount: number; unit: string }>) || []
    );
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
          {error ? (
            <div className="col-span-2 text-center py-4 text-red-500">
              {error}
              <Link href="/preferences" className="block mt-2 text-primary hover:underline">
                Update Preferences
              </Link>
            </div>
          ) : isLoading ? (
            <div className="col-span-2 text-center py-8">Loading recipes...</div>
          ) : filteredRecipes.length === 0 ? (
            <div className="col-span-2 text-center py-8">No recipes found</div>
          ) : (
            filteredRecipes.map((recipe) => (
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
                      src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                      alt={recipe.name}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                  <h3 className="font-medium">{recipe.name}</h3>
                  <p className="text-sm text-muted-foreground">{recipe.description}</p>
                </CardContent>
              </Card>
            ))
          )}
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
