export interface UserProfile {
    gender: string;
    age: number;
    height: number; // in cm
    weight_start: number; // in kg
    weight_current: number; // in kg
    weight_target: number; // in kg
    favorite_ingredients: string[]; // list of favorite ingredients
    dietary_restrictions: string[]; // list of dietary restrictions
    bmi: number; // Body Mass Index
}

export interface UserData {
    email: string;
    authProvider: string;
    profile: UserProfile;
}

export interface FavoriteMeal {
    meal_name: string;
    calories: number; // in kcal
}

export interface Meal {
    meal_name: string;
    calories: number; // in kcal
}
export interface DailyMealPlan {
    calories_target: number; // in kcal
    meals: {
        breakfast: Meal[];
        lunch: Meal[];
        dinner: Meal[];
        snack: Meal[];
    };
    calories_current: number; // in kcal
}