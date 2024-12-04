import { pgTable, text, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  created_at: timestamp("created_at").defaultNow()
});

export const preferences = pgTable("preferences", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id").references(() => users.id),
  dietary_restrictions: json("dietary_restrictions").$type<string[]>(),
  allergies: json("allergies").$type<string[]>(),
  cuisine_preferences: json("cuisine_preferences").$type<string[]>(),
  is_vegetarian: boolean("is_vegetarian").default(false),
  is_vegan: boolean("is_vegan").default(false),
  is_gluten_free: boolean("is_gluten_free").default(false),
  servings: integer("servings").default(2)
});

export const mealPlans = pgTable("meal_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id").references(() => users.id),
  week_start: timestamp("week_start").notNull(),
  meals: json("meals").$type<{
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }[]>(),
  shopping_list: json("shopping_list").$type<{
    item: string;
    category: string;
    quantity: number;
    unit: string;
  }[]>()
});

export const recipes = pgTable("recipes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  ingredients: json("ingredients").$type<{
    item: string;
    amount: number;
    unit: string;
  }[]>(),
  instructions: json("instructions").$type<string[]>(),
  prep_time: integer("prep_time"),
  cook_time: integer("cook_time"),
  image_url: text("image_url").notNull().default(''),
  tags: json("tags").$type<string[]>()
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPreferencesSchema = createInsertSchema(preferences);
export const selectPreferencesSchema = createSelectSchema(preferences);
export const insertMealPlanSchema = createInsertSchema(mealPlans);
export const selectMealPlanSchema = createSelectSchema(mealPlans);
export const insertRecipeSchema = createInsertSchema(recipes);
export const selectRecipeSchema = createSelectSchema(recipes);

export type User = z.infer<typeof selectUserSchema>;
export type Preferences = z.infer<typeof selectPreferencesSchema>;
export type MealPlan = z.infer<typeof selectMealPlanSchema>;
export type Recipe = z.infer<typeof selectRecipeSchema>;
