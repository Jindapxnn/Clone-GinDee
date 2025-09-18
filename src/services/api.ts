import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
} from 'firebase/firestore';
import { db } from './firebase'; // นำเข้า Firestore instance จาก firebase.ts
import { UserData, DailyMealPlan, FavoriteMeal } from '../types/firestoreType';

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่ใน Firestore
export const createUser = async (uid: string, userData: UserData) => {
    try {
        // ใช้ setDoc เพื่อสร้างเอกสารผู้ใช้
        const usersCollection = collection(db, 'users');
        await setDoc(doc(usersCollection, uid), userData);
        console.log('User created with ID:', uid);
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error creating user:', err);
        throw err; 
    }
}

// ฟังก์ชันสำหรับดึงแคลลอรี่ผู้ใช้จาก Firestore
export const getCalories = async (uid: string) => {
    try {
        // ใช้ getDocs เพื่อดึงข้อมูลแคลอรี่ผู้ใช้
        let calories_current = 0; // ค่าเริ่มต้น

        const date = new Date().toISOString().split('T')[0]; // รูปแบบ YYYY-MM-DD
        const dailyMealPlanDocRef = doc(db, 'users', uid, 'daily_meal_plans', date);
        const dailyMealPlanSnapshot = await getDoc(dailyMealPlanDocRef);

        // ตรวจสอบว่ามีเอกสารหรือไม่
        if (!dailyMealPlanSnapshot.exists()) {
            console.log('No daily meal plan found for date:', date);
            return null;
        }

        // ดึงข้อมูลแผนการกินรายวันที่ดึงมา
        const dailyMealPlanData = dailyMealPlanSnapshot.data() as DailyMealPlan;
        calories_current = dailyMealPlanData.calories_current; // ดึงค่าจากเอกสาร

        // ส่งคืนข้อมูลแคลอรี่ที่ดึงมา
        return {
            date: date,
            calories_target: dailyMealPlanData.calories_target,
            calories_current: calories_current
        };
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error fetching calories:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับาสร้างข้อมูลมื้อโปรดของผู้ใช้จาก Firestore
export const createFavoriteMeals = async (uid: string, favouriteMeal: FavoriteMeal) => {
    try {
        // ใช้ addDoc เพื่อสร้างเอกสารมื้อโปรดของผู้ใช้
        const favoriteMealCollection = collection(db, 'users', uid, ' meal_favourite_histories');
        await addDoc(favoriteMealCollection, favouriteMeal);
        console.log('Favorite meal created for user ID:', uid);
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error creating favorite meal:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับดึงข้อมูลมื้อโปรดของผู้ใช้จาก Firestore
export const getFavoriteMeals = async (uid: string) => {
    try {
        // ใช้ getDocs เพื่อดึงข้อมูลมื้อโปรดของผู้ใช้
        const favoriteMealCollection = collection(db, 'users', uid, 'meal_favourite_histories');
        const favoriteMealSnapShot = await getDocs(favoriteMealCollection);

        // ตรวจสอบว่ามีเอกสารหรือไม่
        if (favoriteMealSnapShot.empty) {
            console.log('No favorite meals found for user ID:', uid);
            return [];
        }
        // แปลงข้อมูลเอกสารเป็นอาร์เรย์ของ FavoriteMeal
        const favoriteMealData: FavoriteMeal[] = favoriteMealSnapShot.docs.map(doc => doc.data() as FavoriteMeal);

        // ส่งคืนข้อมูลมื้อโปรดที่ดึงมา
        return favoriteMealData;
    }
    catch (err) {
        console.error('Error fetching favorite meals:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับาสร้างข้อมูลการกินของผู้ใช้จาก Firestore
export const createDailyMealPlan = async (uid: string, date: string, dailyMealPlan: DailyMealPlan) => {
    try {
        // ใช้ setDoc เพื่อสร้างเอกสารแผนการกินรายวัน
        const dailyMealPlanDocRef = doc(db, 'users', uid, 'daily_meal_plans', date);
        await setDoc(dailyMealPlanDocRef, dailyMealPlan, { merge: true });
        console.log('Daily meal plan created for date:', date);
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error creating daily meal plan:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับดึงข้อมูลการกินของผู้ใช้จาก Firestore
export const getDailyMealPlan = async (uid: string, date: string) => {
    try {
        // ใช้ getDocs เพื่อดึงเอกสารแผนการกินรายวัน
        const dailyMealPlanDocRef = doc(db, 'users', uid, 'daily_meal_plans', date);
        const dailyMealPlanSnapshot = await getDoc(dailyMealPlanDocRef);

        // ตรวจสอบว่ามีเอกสารหรือไม่
        if (!dailyMealPlanSnapshot.exists()) {
            console.log('No daily meal plan found for date:', date);
            return null;
        }
        // ส่งคืนข้อมูลแผนการกินรายวันที่ดึงมา
        return dailyMealPlanSnapshot.data() as DailyMealPlan;
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error fetching daily meal plans:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับอัปเดตข้อมูลการกินของผู้ใช้ใน Firestore
export const updateDailyMealPlan = async (uid: string, date: string, dailyMealPlan: DailyMealPlan) => {
    try {
        // ใช้ setDoc เพื่ออัปเดตเอกสารแผนการกินรายวัน
        const dailyMealPlanDocRef = doc(db, 'users', uid, 'daily_meal_plans', date);
        await setDoc(dailyMealPlanDocRef, dailyMealPlan);

        // แจ้งว่าอัปเดตสำเร็จ
        console.log('Daily meal plan updated for date:', date);
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error creating daily meal plan:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับดึงข้อมูลน้ำหนักและแคลอรี่ของผู้ใช้จาก Firestore
export const getWeightAndCalories = async (uid: string, date: string) => {
    try {
        // ดึงข้อมูลโปรไฟล์ผู้ใช้
        const userDocRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);

        // ตรวจสอบว่ามีเอกสารหรือไม่
        if (!userSnapshot.exists()) {
            console.log('No user found with ID:', uid);
            return null;
        }
        // เก็บข้อมูลผู้ใช้ที่ดึงมา
        const userData = userSnapshot.data() as UserData;

        // ดึงข้อมูลแผนการกินรายวัน
        const dailyMealPlanDocRef = doc(db, 'users', uid, 'daily_meal_plans', date);
        const dailyMealPlanSnapshot = await getDoc(dailyMealPlanDocRef);

        // ตรวจสอบว่ามีเอกสารหรือไม่
        if (!dailyMealPlanSnapshot.exists()) {
            console.log('No daily meal plan found for date:', date);
            return null;
        }
        // เก็บข้อมูลแผนการกินรายวันที่ดึงมา
        const dailyMealPlanData = dailyMealPlanSnapshot.data() as DailyMealPlan;

        // ส่งคืนข้อมูลน้ำหนักและแคลอรี่ที่ดึงมา
        return {
            weight_start: userData.profile.weight_start,
            weight_current: userData.profile.weight_current,
            weight_target: userData.profile.weight_target,
            calories_target: dailyMealPlanData.calories_target
        }
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error fetching weight and calories:', err);
        throw err;
    }
}

// ฟังก์ชันสำหรับอัปเดตเป้าหมายน้ำหนักและแคลอรี่ของผู้ใช้ใน Firestore
export const updateTargetGoal = async (uid: string, weight_target: number, calories_target: number) => {
    try {
        // อัปเดตข้อมูลเป้าหมายน้ำหนักในโปรไฟล์ผู้ใช้
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
        profile: { weight_target }
        }, { merge: true });

        // อัปเดตข้อมูลเป้าหมายแคลอรี่ในแผนการกินรายวันของวันนี้
        const date = new Date().toISOString().split('T')[0]; // รูปแบบ YYYY-MM-DD
        const dailyMealPlanDocRef = doc(db, 'users', uid, 'daily_meal_plans', date);
        await setDoc(dailyMealPlanDocRef, {
            calories_target: calories_target
        })

        // แจ้งว่าอัปเดตสำเร็จ
        console.log('Target goal updated for user ID:', uid);
    }
    catch (err) {
        // ส่งข้อผิดพลาดไปยังฟังก์ชันที่เรียกใช้
        console.error('Error updating target goal:', err);
        throw err;
    }
}