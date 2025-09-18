import { MockFirestore } from 'firebase-mock';

const mockFirestore = new MockFirestore();
mockFirestore.autoFlush(true);  // ✅ เปิด autoFlush

// สร้างตัวแปร mock สำหรับ db และ services อื่นๆ
export const app = null;
export const auth = null;
export const db = mockFirestore;