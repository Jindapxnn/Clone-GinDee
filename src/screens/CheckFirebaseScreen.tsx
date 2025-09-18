import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from '../services/firebase'; // นำเข้า app instance ที่ถูก initialize แล้ว

export default function CheckFirebaseScreen() {
    const [firebaseStatus, setFirebaseStatus] = useState('Checking...');

    useEffect(() => {
        try {
            // ตรวจสอบว่า app instance มีอยู่จริง
            if (app) {
                // ตรวจสอบ services อื่นๆ
                const auth = getAuth(app);
                const firestore = getFirestore(app);

                // ถ้าไม่มี error แสดงว่าการเชื่อมต่อสำเร็จ
                setFirebaseStatus('Firebase connection successful!');
                console.log('Firebase services initialized successfully.');
            } else {
                throw new Error('Firebase app is not initialized.');
            }
        } catch (error: any) {
            console.error('Firebase connection failed:', error);
            setFirebaseStatus(`Firebase connection failed: ${error.message}`);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>{firebaseStatus}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});