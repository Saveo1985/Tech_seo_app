import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Client } from '../types';

const APP_ID = '2h_web_solutions_tech_seo_app_v1';
const CLIENTS_PATH = `apps/${APP_ID}/clients`;

export const getClients = async (): Promise<Client[]> => {
    try {
        const q = query(collection(db, CLIENTS_PATH), orderBy('name'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

export const saveClient = async (client: Client) => {
    try {
        const docRef = doc(db, CLIENTS_PATH, client.id);
        const sanitizedClient = {
            ...client,
            seoMemory: {
                brand: client.seoMemory?.brand || '',
                tone: client.seoMemory?.tone || '',
                targetAudience: client.seoMemory?.targetAudience || '',
                allowedCities: client.seoMemory?.allowedCities || [],
                servicesTaxonomy: client.seoMemory?.servicesTaxonomy || [],
                forbiddenTerms: client.seoMemory?.forbiddenTerms || [],
                uniqueSellingPoints: client.seoMemory?.uniqueSellingPoints || []
            },
            createdAt: client.createdAt || serverTimestamp()
        };
        await setDoc(docRef, sanitizedClient, { merge: true });
    } catch (error) {
        console.error("Error saving client:", error);
        throw error;
    }
};

export const deleteClient = async (clientId: string) => {
    try {
        await deleteDoc(doc(db, CLIENTS_PATH, clientId));
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
};
