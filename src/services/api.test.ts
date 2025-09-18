import { db } from './firebase.mock'; // นำเข้า Firestore mock instance จาก firebase.test.ts
import {
  createUser,
  getCalories,
  createFavoriteMeals,
  getFavoriteMeals,
  createDailyMealPlan,
  getDailyMealPlan,
  updateDailyMealPlan,
  getWeightAndCalories,
  updateTargetGoal,
} from './api';
import { UserData, DailyMealPlan, FavoriteMeal } from '../types/firestoreType';

// ข้อมูลจำลองสำหรับการทดสอบ
const mockUid = 'test-user-id-123';
const mockDate = '2025-09-17';
const mockUserData: UserData = {
  email: 'test@example.com',
  authProvider: 'email',
  profile: {
    gender: 'male',
    age: 30,
    height: 175,
    weight_start: 70,
    weight_current: 70,
    weight_target: 65,
    favorite_ingredients: ['chicken'],
    dietary_restrictions: [],
    bmi: 22.86,
  },
};
const mockDailyMealPlan: DailyMealPlan = {
  calories_target: 2000,
  meals: {
    breakfast: [{ meal_name: 'Oatmeal', calories: 350 }],
    lunch: [{ meal_name: 'Salad', calories: 450 }],
    dinner: [{ meal_name: 'Chicken', calories: 600 }],
    snack: [],
  },
  calories_current: 1400,
};
const mockFavoriteMeal: FavoriteMeal = {
  meal_name: 'Fried Rice',
  calories: 750,
};

// ชุดทดสอบสำหรับฟังก์ชันใน api.ts
describe('Firebase API Functions', () => {
  beforeEach(() => {
    (db as any)._collections = {};
});

  // ทดสอบสร้างผู้ใช้ใหม่
  test('createUser should create a new user document', async () => {
    await createUser(mockUid, mockUserData);
    const userDoc = await db.collection('users').doc(mockUid).get();
    expect(userDoc.exists).toBe(true);
    expect(userDoc.data()).toEqual(mockUserData);
  });

  // ทดสอบดึงข้อมูลแคลอรี่ผู้ใช้
  test('getCalories should fetch calorie data for the current day', async () => {
    // จำลองการสร้างข้อมูลในฐานข้อมูลที่ฟังก์ชันจะดึงไปใช้ 
    await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).set(mockDailyMealPlan);

    const result = await getCalories(mockUid);
    
    // ตรวจสอบผลลัพธ์ที่ได้
    expect(result).toEqual({
      date: mockDate,
      calories_target: mockDailyMealPlan.calories_target,
      calories_current: mockDailyMealPlan.calories_current,
    });
  });

  // ทดสอบสร้างมื้อโปรดใหม่
  test('createFavoriteMeals should add a new favorite meal document', async () => {
    await createFavoriteMeals(mockUid, mockFavoriteMeal);
    
    const favoriteMeals = await db.collection('users').doc(mockUid).collection('meal_favourite_histories').get();
    expect(favoriteMeals.docs.length).toBe(1);
    expect(favoriteMeals.docs[0].data()).toEqual(mockFavoriteMeal);
  });

  // ทดสอบดึงข้อมูลมื้อโปรดของผู้ใช้
  test('getFavoriteMeals should fetch all favorite meals for a user', async () => {
    // จำลองการสร้างข้อมูล 2 มื้อ
    const favoriteMeal2: FavoriteMeal = { meal_name: 'Pizza', calories: 1200 };
    await db.collection('users').doc(mockUid).collection('meal_favourite_histories').add(mockFavoriteMeal);
    await db.collection('users').doc(mockUid).collection('meal_favourite_histories').add(favoriteMeal2);

    const result = await getFavoriteMeals(mockUid);
    
    // ตรวจสอบผลลัพธ์ที่ได้
    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockFavoriteMeal),
        expect.objectContaining(favoriteMeal2),
      ]),
    ); // ตรวจสอบว่าข้อมูลที่ดึงมา มีทั้ง 2 มื้อ
  });

  // ทดสอบสร้างแผนการกินรายวันใหม่
  test('createDailyMealPlan should create a new daily meal plan document', async () => {
    await createDailyMealPlan(mockUid, mockDate, mockDailyMealPlan);

    const mealPlanDoc = await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).get();
    expect(mealPlanDoc.exists).toBe(true);
    expect(mealPlanDoc.data()).toEqual(mockDailyMealPlan);
  });

  // ทดสอบดึงข้อมูลแผนการกินรายวัน
  test('getDailyMealPlan should fetch a specific daily meal plan document', async () => {
    // จำลองการสร้างข้อมูล
    await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).set(mockDailyMealPlan);

    const result = await getDailyMealPlan(mockUid, mockDate);
    
    expect(result).toEqual(mockDailyMealPlan);
  });

  // ทดสอบอัปเดตแผนการกินรายวัน
  test('updateDailyMealPlan should update an existing meal plan document', async () => {
    // สร้างเอกสารเริ่มต้น
    await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).set({
      ...mockDailyMealPlan,
      calories_current: 1000,
    });

    const updatedData: DailyMealPlan = {
      ...mockDailyMealPlan,
      calories_current: 1500,
    };
    await updateDailyMealPlan(mockUid, mockDate, updatedData);

    const mealPlanDoc = await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).get();
    expect(mealPlanDoc.data()).toEqual(updatedData); // ตรวจสอบว่าข้อมูลถูกอัปเดตอย่างถูกต้อง
  });

  // ทดสอบดึงข้อมูลน้ำหนักและแคลอรี่เป้าหมาย
  test('getWeightAndCalories should fetch user profile and calorie data', async () => {
    // จำลองการสร้างข้อมูลที่จำเป็น คือ ข้อมูลผู้ใช้และแผนการกินรายวัน
    await db.collection('users').doc(mockUid).set(mockUserData);
    await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).set(mockDailyMealPlan);

    const result = await getWeightAndCalories(mockUid, mockDate);
    
    // ตรวจสอบผลลัพธ์ที่ได้
    expect(result).toEqual({
      weight_start: mockUserData.profile.weight_start,
      weight_current: mockUserData.profile.weight_current,
      weight_target: mockUserData.profile.weight_target,
      calories_target: mockDailyMealPlan.calories_current,
    });
  });

  test('updateTargetGoal should update weight and calorie goals', async () => {
    // First, set up the necessary data
    await db.collection('users').doc(mockUid).set(mockUserData);
    await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).set(mockDailyMealPlan);

    const newWeightTarget = 60;
    const newCaloriesTarget = 1800;
    
    await updateTargetGoal(mockUid, newWeightTarget, newCaloriesTarget);

    const userDoc = await db.collection('users').doc(mockUid).get();
    const mealPlanDoc = await db.collection('users').doc(mockUid).collection('daily_meal_plans').doc(mockDate).get();

    expect(userDoc.data().profile.weight_target).toBe(newWeightTarget);
    expect(mealPlanDoc.data().total_calories_target).toBe(newCaloriesTarget);
  });
});