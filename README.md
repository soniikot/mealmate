# MealMate - AI-Powered Meal Planning Assistant

MealMate is an intelligent meal-planning application that helps users create personalized weekly meal plans, manage recipes, and generate shopping lists automatically. The application uses ChatGPT API to tailor recommendations based on dietary preferences and restrictions.

## Key Features

- 🍽️ **Personalized Meal Planning**: Generate weekly meal plans tailored to your dietary preferences
- 🔄 **Plan Customization**: Modify and adjust meal plans to your liking
- 📝 **Smart Shopping Lists**: Automatically generated and customizable shopping lists
- 🥗 **Recipe Management**: Browse and select from a variety of recipes
- ⚙️ **Preference Management**: Set dietary restrictions, allergies, and cuisine preferences
- 🎯 **Type Safety**: Built with TypeScript for robust type-checking

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for meal suggestions
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + Context API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `OPENAI_API_KEY`: OpenAI API key

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features in Detail

### Meal Plan Generation
- AI-powered meal planning based on user preferences
- Support for various dietary restrictions (vegetarian, vegan, gluten-free)
- Customizable serving sizes
- Weekly meal plans with breakfast, lunch, and dinner

### Recipe Management
- Browse recipes by meal type
- Filter recipes based on dietary preferences
- Detailed recipe information, including prep time and ingredients

### Shopping List
- Automatic generation based on meal plan
- Categorized ingredients
- Customizable quantities
- Interactive checklist functionality

### Preferences Management
- Set dietary restrictions
- Specify allergies
- Choose preferred cuisines
- Adjust serving sizes

## Development

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context providers
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/              # Backend Express application
│   ├── routes.ts        # API routes
│   └── chatgpt.ts      # AI integration
└── db/                  # Database schema and migrations
```

### Key Components
- `PreferencesContext`: Manages user preferences state
- `MealPlanTimeline`: Displays weekly meal plan
- `DishSelectionModal`: Modal for selecting meals
- `ShoppingList`: Interactive shopping list component

## License

MIT License - feel free to use this project for learning or building your own meal planning application!
