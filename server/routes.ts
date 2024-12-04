import type { Express, Request, Response } from "express";
import { db } from "db";
import { preferences, mealPlans, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { generateMealPlanWithGPT } from "./chatgpt";
import { registerUser, validateUser } from "./auth";

export function registerRoutes(app: Express) {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await registerUser(username, email, password);
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
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
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

    const mealPlan = await db.query.mealPlans.findFirst({
      orderBy: (mealPlans, { desc }) => [desc(mealPlans.week_start)]
    });
    
    res.json(mealPlan);
  });

  app.post("/api/meal-plan/generate", async (_req: Request, res) => {
    const userPreferences = await db.query.preferences.findFirst();

    if (!userPreferences) {
      return res.status(400).json({ error: "Please set your preferences first" });
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
      }[]
    };

    const savedMealPlan = await db.insert(mealPlans)
      .values(newMealPlan)
      .returning();
    
    res.json(savedMealPlan[0]);
  });
}
