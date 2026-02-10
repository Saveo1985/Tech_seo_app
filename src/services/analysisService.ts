import { FirestoreService } from './firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'scans';
const APP_ID = '2h_web_solutions_tech_seo_app_v1';

export interface ScanResult {
    id?: string;
    url: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    score?: number;
    issues?: string[];
    reportData?: any;
    createdAt: number;
}

export const AnalysisService = {
    // 1. Start Analysis: Schreibt in DB und ruft (optional) Webhook
    startScan: async (url: string) => {
        // A. Create Document placeholder
        const docRef = await FirestoreService.add(COLLECTION, {
            url,
            status: 'pending',
            createdAt: Date.now()
        });

        // B. Call n8n Webhook (If configured)
        const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
        if (webhookUrl) {
            try {
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scanId: docRef.id, url, appId: APP_ID })
                });
            } catch (e) {
                console.error("Webhook Trigger Failed", e);
            }
        }

        return docRef.id;
    },

    // 2. Realtime Listener for a specific Scan
    subscribeToScan: (scanId: string, callback: (data: ScanResult) => void) => {
        const path = `apps/${APP_ID}/${COLLECTION}/${scanId}`;
        return onSnapshot(doc(db, path), (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() } as ScanResult);
            }
        });
    },

    // 3. Get History
    getHistory: async () => {
        // In production, use a query with orderBy
        return await FirestoreService.getAll(COLLECTION);
    }
};
