import type { Preferences, MealPlan } from "@db/schema";

const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function generateMealPlanWithGPT(preferences: Preferences): Promise<Partial<MealPlan>> {
  const dietaryRestrictions = Array.isArray(preferences.dietary_restrictions) 
    ? preferences.dietary_restrictions.join(", ")
    : "";
  const allergies = Array.isArray(preferences.allergies)
    ? preferences.allergies.join(", ")
    : "";
  const cuisinePreferences = Array.isArray(preferences.cuisine_preferences)
    ? preferences.cuisine_preferences.join(", ")
    : "";

  const prompt = `
    Generate a weekly meal plan for someone with the following preferences:
    - Vegetarian: ${preferences.is_vegetarian}
    - Vegan: ${preferences.is_vegan}
    - Gluten Free: ${preferences.is_gluten_free}
    - Dietary Restrictions: ${dietaryRestrictions}
    - Allergies: ${allergies}
    - Cuisine Preferences: ${cuisinePreferences}
    - Servings: ${preferences.servings}

    Include 3 meals per day (breakfast, lunch, dinner) for 7 days.
    Also generate a shopping list organized by categories (produce, pantry, etc).
    Format the response as JSON matching the MealPlan type.
  `;

  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a meal planning assistant that generates healthy and balanced meal plans." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate meal plan");
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
}

import type { Recipe } from "@db/schema";

export async function generateRecipes(mealType: string, preferences: Preferences): Promise<Partial<Recipe>[]> {
  const prompt = `
    Generate 6 ${mealType} recipes that match these dietary preferences:
    - Vegetarian: ${preferences.is_vegetarian}
    - Vegan: ${preferences.is_vegan}
    - Gluten Free: ${preferences.is_gluten_free}
    - Dietary Restrictions: ${Array.isArray(preferences.dietary_restrictions) ? preferences.dietary_restrictions.join(', ') : ''}
    - Allergies: ${Array.isArray(preferences.allergies) ? preferences.allergies.join(', ') : ''}
    
    For each recipe include:
    - name
    - description
    - ingredients (with amounts and units)
    - prep_time
    - cook_time
    - tags
    
    Format the response as JSON matching the Recipe type.
  `;

  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a culinary expert that creates detailed, healthy recipes." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI API");
    }
    
    const recipes = JSON.parse(data.choices[0].message.content);
    return Array.isArray(recipes) ? recipes : [recipes];
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes");
  }
}