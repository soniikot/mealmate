import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PreferencesForm from "../components/PreferencesForm";

export default function Preferences() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative h-[200px] rounded-lg overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1522791465802-47616431a4cf"
            alt="Fresh ingredients"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Your Meal Preferences</h1>
          </div>
        </div>

        <Card className="p-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <PreferencesForm />
        </Card>
      </div>
    </div>
  );
}
