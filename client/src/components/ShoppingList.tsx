import { useState } from "react";
import { Check, ShoppingBasket, Plus, Minus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ShoppingItem {
  item: string;
  category: string;
  quantity: number;
  unit: string;
}

interface ShoppingListProps {
  items: ShoppingItem[];
  onUpdateItems?: (items: ShoppingItem[]) => void;
}

export default function ShoppingList({ items, onUpdateItems }: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ item: "", category: "", quantity: 1, unit: "piece" });

  const categories = Array.from(new Set(items.map(item => item.category)));
  const totalItems = items.length;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;

  const handleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleQuantityChange = (index: number, delta: number) => {
    if (!onUpdateItems) return;
    
    const updatedItems = [...items];
    const newQuantity = Math.max(1, updatedItems[index].quantity + delta);
    updatedItems[index] = { ...updatedItems[index], quantity: newQuantity };
    onUpdateItems(updatedItems);
  };

  const handleClearCompleted = () => {
    if (!onUpdateItems) return;
    const remainingItems = items.filter((_, index) => !checkedItems[`${index}`]);
    onUpdateItems(remainingItems);
    setCheckedItems({});
  };

  const handleAddItem = () => {
    if (!onUpdateItems || !newItem.item || !newItem.category) return;
    
    const updatedItems = [...items, newItem];
    onUpdateItems(updatedItems);
    setNewItem({ item: "", category: "", quantity: 1, unit: "piece" });
    setIsAddItemModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {completedItems} of {totalItems} items completed
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddItemModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCompleted}
            disabled={completedItems === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Completed
          </Button>
        </div>
      </div>

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
                      <Checkbox 
                        id={`item-${index}`}
                        checked={checkedItems[`${index}`] || false}
                        onCheckedChange={() => handleItemCheck(`${index}`)}
                      />
                      <label 
                        htmlFor={`item-${index}`} 
                        className={`flex-1 ${checkedItems[`${index}`] ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.item}
                      </label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(index, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Item Name</label>
              <Input
                value={newItem.item}
                onChange={(e) => setNewItem(prev => ({ ...prev, item: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unit</label>
              <Input
                value={newItem.unit}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="Enter unit (e.g., piece, kg, lb)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
