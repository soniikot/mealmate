import { Check, ShoppingBasket } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ShoppingItem {
  item: string;
  category: string;
  quantity: number;
  unit: string;
}

interface ShoppingListProps {
  items: ShoppingItem[];
}

export default function ShoppingList({ items }: ShoppingListProps) {
  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <ShoppingBasket className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No items in your shopping list</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="font-semibold mb-2 text-muted-foreground">{category}</h3>
              <div className="space-y-2">
                {items
                  .filter(item => item.category === category)
                  .map((item, index) => (
                    <div key={`${category}-${index}`} className="flex items-center gap-2">
                      <Checkbox id={`item-${category}-${index}`} />
                      <label htmlFor={`item-${category}-${index}`} className="flex-1">
                        {item.quantity} {item.unit} {item.item}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
