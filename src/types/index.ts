export interface Task {
    id: string;
    title: string;
    status: 'open' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: any;
    createdAt: any;
}

export interface SeoMemory {
    brand: string;
    tone: string;
    targetAudience: string;
    allowedCities: string[];
    servicesTaxonomy: string[];
    forbiddenTerms: string[];
    uniqueSellingPoints: string[];
}

export interface Client {
    id: string;
    name: string;
    website: string;
    wordpressUrl: string;
    n8nWebhookMeta: string;
    n8nWebhookAltText: string;
    seoMemory: SeoMemory;
    createdAt: any;
}

export interface ScanResult {
    url: string;
    score: number;
    // ... other fields
}
