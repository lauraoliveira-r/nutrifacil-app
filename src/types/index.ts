export interface MealPlan {
  id: string;
  name: string;
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mealPlans: MealPlan[];
}