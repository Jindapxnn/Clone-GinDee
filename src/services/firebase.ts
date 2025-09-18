// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCG_IFys_SJ_TDrgYVFALwlBDrwCY_-FKQ",
    authDomain: "gindee-system.firebaseapp.com",
    projectId: "gindee-system",
    storageBucket: "gindee-system.firebasestorage.app",
    messagingSenderId: "316236909015",
    appId: "1:316236909015:web:7664e30477c952752a6392",
    measurementId: "G-ZYL5X394FK"
};

// Initialize Firebase and export the app instance
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ถ้าใช้ analytics ด้วยก็ export เพิ่ม
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);