import type { Express, Request, Response } from "express";
import { db } from "db";
import { preferences, mealPlans, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { generateMealPlanWithGPT, generateRecipes } from "./chatgpt";
import { registerUser, validateUser } from "./auth";

export function registerRoutes(app: Express) {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await registerUser(username, email, password);
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error: any) {
      if (error.code === "23505") {
        // Unique violation
        res.status(400).json({ error: "Email or username already exists" });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await validateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
  });

  app.get("/api/meal-plan", async (_req: Request, res) => {
    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay(),
    );

    const mealPlan = await db.query.mealPlans.findFirst({
      orderBy: (mealPlans, { desc }) => [desc(mealPlans.week_start)],
    });

    res.json(mealPlan);
  });

  app.post("/api/meal-plan/generate", async (_req: Request, res) => {
    const userPreferences = await db.query.preferences.findFirst();

    if (!userPreferences) {
      return res
        .status(400)
        .json({ error: "Please set your preferences first" });
    }

    const mealPlan = await generateMealPlanWithGPT(userPreferences);

    const newMealPlan = {
      week_start: new Date(),
      meals: (mealPlan.meals || []) as {
        day: string;
        breakfast: string;
        lunch: string;
        dinner: string;
      }[],
      shopping_list: (mealPlan.shopping_list || []) as {
        item: string;
        category: string;
        quantity: number;
        unit: string;
      }[],
    };

    const savedMealPlan = await db
      .insert(mealPlans)
      .values(newMealPlan)
      .returning();

    res.json(savedMealPlan[0]);
  });

  app.put("/api/meal-plan", async (req: Request, res: Response) => {
    try {
      const mealPlanData = req.body;
      const existingMealPlan = await db.query.mealPlans.findFirst({
        orderBy: (mealPlans, { desc }) => [desc(mealPlans.week_start)],
      });

      // Ensure meals array is properly initialized
      const meals = Array.isArray(mealPlanData.meals) ? mealPlanData.meals : [];

      if (existingMealPlan) {
        const [updatedMealPlan] = await db
          .update(mealPlans)
          .set({
            meals: meals,
            shopping_list: mealPlanData.shopping_list || [],
          })
          .where(eq(mealPlans.id, existingMealPlan.id))
          .returning();

        res.json(updatedMealPlan);
      } else {
        const [newMealPlan] = await db
          .insert(mealPlans)
          .values({
            week_start: new Date(),
            meals: meals,
            shopping_list: mealPlanData.shopping_list || [],
          })
          .returning();

        res.json(newMealPlan);
      }
    } catch (error) {
      console.error("Failed to update meal plan:", error);
      res.status(500).json({ error: "Failed to update meal plan" });
    }
  });

  app.get("/api/preferences", async (req: Request, res: Response) => {
    try {
      const userPreferences = await db.query.preferences.findFirst();
      res.json(userPreferences || {
        dietary_restrictions: [],
        allergies: [],
        cuisine_preferences: [],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        servings: 2
      });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.post("/api/preferences", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const [newPreferences] = await db.insert(preferences)
        .values(data)
        .onConflictDoUpdate({
          target: preferences.id,
          set: data
        })
        .returning();
      res.json(newPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ error: "Failed to save preferences" });
    }
  });

  app.get("/api/recipes/:mealType", async (req: Request, res: Response) => {
    try {
      const { mealType } = req.params;
      const userPreferences = await db.query.preferences.findFirst();

      // Use default preferences if none are set
      const defaultPreferences = {
        id: 0,
        user_id: null,
        dietary_restrictions: [],
        allergies: [],
        cuisine_preferences: [],
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        servings: 2,
      };

      const preferences = userPreferences || defaultPreferences;
      const recipes = await generateRecipes(mealType, preferences);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({
        error: "Failed to fetch recipes",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
