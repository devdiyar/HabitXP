import api from '@/services/api';
import { NewTask, Task } from '@/types/task';

export const createTask = async (task: NewTask) => {
  try {
    const res = await api.post('/tasks', task);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      console.error('Backend-Fehler:', err.response.data);
      if (err.response.data.message?.includes('Task Limit reached')) {
        throw new Error(
          'Du hast dein aktuelles Aufgabenlimit erreicht. Steige im Level auf, um mehr Aufgaben erstellen zu können!',
        );
      }
    }
    throw err;
  }
};

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get('/tasks');
  return res.data;
};

export const getTasksByUser = async (userId: string) => {
  try {
    const res = await api.get(`/tasks?userId=${userId}`);
    return res.data;
  } catch (err) {
    console.error(`Fehler beim Abrufen der Tasks für Benutzer ${userId}:`, err);
  }
};

export const getTaskById = async (id: string) => {
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Fehler beim Laden des Tasks mit ID ${id}:`, err);
  }
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  try {
    const res = await api.put(`/tasks/${id}`, task);
    return res.data;
  } catch (err) {
    console.error(
      `Fehler beim Aktualisieren des Tasks mit ID ${task.id}:`,
      err,
    );
  }
};

export const deleteTask = async (id: string) => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (err) {
    console.error(`Fehler beim Löschen des Tasks mit ID ${id}:`, err);
  }
};

export const completeTask = async (id: string) => {
  try {
    const res = await api.post(`/tasks/${id}/complete`);
    return res.data;
  } catch (err) {
    console.error(`Fehler beim Abschließen des Tasks mit ID ${id}:`, err);
    throw err;
  }
};

export const getTaskStatus = async (id: string) => {
  try {
    const res = await api.get(`/tasks/${id}/status`);
    return res.data;
  } catch (err) {
    console.error(`Fehler beim Laden des Status für Task mit ID ${id}:`, err);
    throw err;
  }
};
