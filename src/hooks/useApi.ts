import { useState, useCallback } from 'react';
import { ApiService } from '../services/api.service';
import { notifications } from '@mantine/notifications';

interface UseApiOptions<T> {
  endpoint: string;
  initialData?: T[];
  errorMessages?: {
    get?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
}

export function useApi<T extends { id: number }>({ 
  endpoint, 
  initialData = [], 
  errorMessages = {}
}: UseApiOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const api = new ApiService();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<T[]>(endpoint);
      setData(result);
      setError(null);
    } catch (err) {
      setError(errorMessages.get || 'Error al cargar los datos');
      notifications.show({
        position: "top-right",
        title: 'Error',
        message: errorMessages.get || 'Error al cargar los datos',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const createItem = useCallback(async (item: Omit<T, 'id'>) => {
    try {
      const result = await api.post<T>(endpoint, item);
      setData(prev => [...prev, result]);
      notifications.show({
        position: "top-right",
        title: 'Éxito',
        message: 'Item creado correctamente',
        color: 'green'
      });
      return result;
    } catch (err) {
      notifications.show({
        position: "top-right",
        title: 'Error',
        message: errorMessages.create || 'Error al crear el item',
        color: 'red'
      });
      throw err;
    }
  }, [endpoint]);

  const updateItem = useCallback(async (id: number, item: Partial<T>) => {
    try {
      const result = await api.put<T>(`${endpoint}?id=${id}`, item);
      setData(prev => prev.map(i => i.id === id ? result : i));
      notifications.show({
        position: "top-right",
        title: 'Éxito',
        message: 'Item actualizado correctamente',
        color: 'green'
      });
      return result;
    } catch (err) {
      notifications.show({
        position: "top-right",
        title: 'Error',
        message: errorMessages.update || 'Error al actualizar el item',
        color: 'red'
      });
      throw err;
    }
  }, [endpoint]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      await api.delete(`${endpoint}?id=${id}`);
      setData(prev => prev.filter(i => i.id !== id));
      notifications.show({
        position: "top-right",
        title: 'Éxito',
        message: 'Item eliminado correctamente',
        color: 'green'
      });
    } catch (err) {
        console.log(err)
      notifications.show({
        position: "top-right",
        title: 'Error',
        message: errorMessages.delete || 'Error al eliminar el item',
        color: 'red'
      });
      throw err;
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem
  };
}