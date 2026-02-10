import React, { useState, useEffect } from 'react';
import { TaskService } from '@/services/taskService';
import { Task } from '@/types';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = TaskService.subscribeToTasks((data: any[]) => {
            // Sortieren nach Erstellungsdatum (neu zuerst)
            const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
            setTasks(sorted);
        });
        return () => unsubscribe();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await TaskService.createTask({
                title,
                priority,
                status: 'open',
                dueDate: new Date().toISOString(),
                // createdAt wird im Service gesetzt
            } as any);
            setTitle('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (task: Task) => {
        if (!task.id) return;
        const newStatus = task.status === 'done' ? 'open' : 'done';
        await TaskService.updateTaskStatus(task.id, newStatus);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (confirm('Aufgabe wirklich löschen?')) {
            await TaskService.deleteTask(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* ADD TASK CARD */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-serif text-brand-dark mb-4">Neue Aufgabe</h3>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Was muss erledigt werden?"
                        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-brand-primary"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-brand-primary bg-white"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-dark text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            {/* TASK LIST */}
            <div className="grid gap-4">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group hover:border-brand-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleStatus(task)}
                                className={clsx(
                                    "transition-colors",
                                    task.status === 'done' ? "text-green-500" : "text-gray-300 hover:text-brand-primary"
                                )}
                            >
                                {task.status === 'done' ? <CheckCircle /> : <Circle />}
                            </button>

                            <div>
                                <p className={clsx(
                                    "font-medium text-lg",
                                    task.status === 'done' && "line-through text-gray-400"
                                )}>
                                    {task.title}
                                </p>
                                <span className={clsx(
                                    "text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider",
                                    task.priority === 'high' ? "bg-red-100 text-red-600" :
                                        task.priority === 'medium' ? "bg-yellow-100 text-yellow-600" :
                                            "bg-green-100 text-green-600"
                                )}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p>Keine Aufgaben gefunden.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
