import type { Express, Request } from "express";
import { db } from "db";
import { preferences, mealPlans } from "@db/schema";
import { eq } from "drizzle-orm";
import { generateMealPlanWithGPT } from "./chatgpt";

// Extend Express Request type to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
    };
  }
}

export function registerRoutes(app: Express) {
  app.get("/api/preferences", async (req: Request, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    
    const userPreferences = await db.query.preferences.findFirst({
      where: eq(preferences.user_id, req.user.id)
    });
    
    res.json(userPreferences);
  });

  app.post("/api/preferences", async (req: Request, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    
    const userPreferences = await db.insert(preferences)
      .values({
        ...req.body,
        user_id: req.user.id
      })
      .onConflictDoUpdate({
        target: [preferences.user_id],
        set: req.body
      })
      .returning();
    
    res.json(userPreferences[0]);
  });

  app.get("/api/meal-plan", async (req: Request, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    
    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

    const mealPlan = await db.query.mealPlans.findFirst({
      where: eq(mealPlans.user_id, req.user.id),
      orderBy: (mealPlans, { desc }) => [desc(mealPlans.week_start)]
    });
    
    res.json(mealPlan);
  });

  app.post("/api/meal-plan/generate", async (req: Request, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    
    const userPreferences = await db.query.preferences.findFirst({
      where: eq(preferences.user_id, req.user.id)
    });

    if (!userPreferences) {
      return res.status(400).json({ error: "Please set your preferences first" });
    }

    const mealPlan = await generateMealPlanWithGPT(userPreferences);
    
    const newMealPlan = {
      user_id: req.user.id,
      week_start: new Date(),
      meals: mealPlan.meals || [],
      shopping_list: mealPlan.shopping_list || []
    };

    const savedMealPlan = await db.insert(mealPlans)
      .values([newMealPlan])
      .returning();
    
    res.json(savedMealPlan[0]);
  });
}
