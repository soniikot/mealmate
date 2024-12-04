import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Preferences } from "@db/schema";

// Action types
type PreferencesAction =
  | { type: "SET_PREFERENCES"; payload: Partial<Preferences> }
  | { type: "RESET_PREFERENCES" };

// Context type
type PreferencesContextType = {
  preferences: Partial<Preferences>;
  dispatch: React.Dispatch<PreferencesAction>;
};

// Initial state
const initialPreferences: Partial<Preferences> = {
  dietary_restrictions: [],
  allergies: [],
  cuisine_preferences: [],
  is_vegetarian: false,
  is_vegan: false,
  is_gluten_free: false,
  servings: 2
};

// Create context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Reducer function
function preferencesReducer(state: Preferences, action: PreferencesAction): Preferences {
  switch (action.type) {
    case "SET_PREFERENCES":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET_PREFERENCES":
      return initialPreferences;
    default:
      return state;
  }
}

// Provider component
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, dispatch] = useReducer(preferencesReducer, initialPreferences);

  return (
    <PreferencesContext.Provider value={{ preferences, dispatch }}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Custom hook for using preferences context
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

export { type PreferencesAction };
