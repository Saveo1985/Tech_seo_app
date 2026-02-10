import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// *** SINGLE BACKEND LAW: APP ID CONSTANT ***
const APP_ID = '2h_web_solutions_tech_seo_app_v1';

// Helper um den vollen Pfad zu generieren
const getCollectionPath = (collectionName: string) => `apps/${APP_ID}/${collectionName}`;

export const FirestoreService = {
    // Generische 'Add' Funktion
    add: async (collectionName: string, data: any) => {
        const path = getCollectionPath(collectionName);
        const colRef = collection(db, path);
        return await addDoc(colRef, { ...data, createdAt: Date.now() });
    },

    // Generische 'Get All' Funktion
    getAll: async (collectionName: string) => {
        const path = getCollectionPath(collectionName);
        const snapshot = await getDocs(collection(db, path));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Generische 'Update' Funktion
    update: async (collectionName: string, id: string, data: any) => {
        const path = getCollectionPath(collectionName);
        const docRef = doc(db, path, id);
        await updateDoc(docRef, data);
    },

    // Generische 'Delete' Funktion
    delete: async (collectionName: string, id: string) => {
        const path = getCollectionPath(collectionName);
        const docRef = doc(db, path, id);
        await deleteDoc(docRef);
    },

    // Realtime Listener Helper
    subscribe: (collectionName: string, callback: (data: any[]) => void) => {
        const path = getCollectionPath(collectionName);
        const q = query(collection(db, path));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(data);
        });
    }
};
