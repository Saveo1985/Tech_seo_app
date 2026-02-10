export interface Task {
    id?: string;
    title: string;
    status: 'open' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate: string; // ISO Date String
    createdAt: number;
}

// Generischer Typ für API-Antworten
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}
