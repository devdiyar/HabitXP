import api from '@/services/api';
import { NewSpace, Space } from '@/types/space';

export const getSpaces = async (): Promise<Space[]> => {
  const res = await api.get('/spaces');
  return res.data;
};

export const createSpace = async (space: NewSpace) => {
  const res = await api.post('/spaces', space);
  return res.data;
};

export const deleteSpace = async (id: string) => {
  try {
    await api.delete(`/spaces/${id}`);
  } catch (err) {
    console.error(`Fehler beim Löschen des Spaces mit ID ${id}:`, err);
  }
};

export const updateSpace = async (
  id: string,
  updatedData: Partial<NewSpace>,
) => {
  const res = await api.put(`/spaces/${id}`, updatedData);
  return res.data;
};
