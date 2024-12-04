import type { Express, Request, Response } from "express";
import { db } from "db";
import { preferences, mealPlans, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { generateMealPlanWithGPT } from "./chatgpt";
import { registerUser, validateUser, requireAuth } from "./auth";

// Extend Express Request type to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
    };
  }
}

export function registerRoutes(app: Express) {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await registerUser(username, email, password);
      req.session.userId = user.id;
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

    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username, email: user.email });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.json({ message: "Logged out successfully" });
      }
    });
  });

  // Meal plan routes still require auth
  app.use("/api/meal-plan", requireAuth);

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
