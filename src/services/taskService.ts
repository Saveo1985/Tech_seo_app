import { FirestoreService } from './firestore';
import { Task } from '@/types';

const COLLECTION = 'tasks';

export const TaskService = {
    createTask: async (task: Omit<Task, 'id' | 'createdAt'>) => {
        return await FirestoreService.add(COLLECTION, task);
    },

    updateTaskStatus: async (id: string, status: Task['status']) => {
        return await FirestoreService.update(COLLECTION, id, { status });
    },

    deleteTask: async (id: string) => {
        return await FirestoreService.delete(COLLECTION, id);
    },

    subscribeToTasks: (callback: (tasks: Task[]) => void) => {
        return FirestoreService.subscribe(COLLECTION, (data) => callback(data as Task[]));
    }
};
