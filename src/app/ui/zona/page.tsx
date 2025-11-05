'use client';

import { useState, useEffect } from 'react';
import { 
  Table,
  Button,
  Modal,
  TextInput,
  Stack,
  Title,
  Paper,
  ActionIcon,
  Group
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useApi } from '@/hooks/useApi';

interface Zona {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function GestionZonas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [zonaActual, setZonaActual] = useState<Zona>({
    id: 0,
    nombre: '',
    descripcion: ''
  });

  const { 
    data: zonas, 
    loading, 
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem 
  } = useApi<Zona>({
    endpoint: 'zone',
    errorMessages: {
      get: 'Error al cargar las zonas',
      create: 'Error al crear la zona',
      update: 'Error al actualizar la zona',
      delete: 'Error al eliminar la zona'
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveZona = async () => {
    if (!zonaActual.nombre.trim()) {
      notifications.show({
        title: 'Error',
        message: 'El nombre de la zona es requerido',
        color: 'red'
      });
      return;
    }

    try {
      if (zonaActual.id === 0) {
        await createItem({
          nombre: zonaActual.nombre,
          descripcion: zonaActual.descripcion
        });
      } else {
        await updateItem(zonaActual.id, zonaActual);
      }
      setModalOpen(false);
      setZonaActual({ id: 0, nombre: '', descripcion: '' });
    } catch (err) {
      // Los errores ya son manejados por el hook
    }
    finally {
      fetchData();
    }
  };

  const handleDeleteZona = async (id: number) => {
    try {
      await deleteItem(id);
    } catch (err) {
      // Los errores ya son manejados por el hook
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Stack p="md">
      <Group>
        <Title order={2}>Gestión de Zonas</Title>
        <Button 
          onClick={() => {
            setZonaActual({ id: 0, nombre: '', descripcion: '' });
            setModalOpen(true);
          }}
        >
          Nueva Zona
        </Button>
      </Group>

      <Paper shadow="xs">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {zonas.map((zona) => (
              <Table.Tr key={zona.id}>
                <Table.Td>{zona.id}</Table.Td>
                <Table.Td>{zona.nombre}</Table.Td>
                <Table.Td>{zona.descripcion}</Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon
                      color="blue"
                      onClick={() => {
                        setZonaActual(zona);
                        setModalOpen(true);
                      }}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDeleteZona(zona.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {zonas.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  No hay zonas registradas
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setZonaActual({ id: 0, nombre: '', descripcion: '' });
        }}
        title={zonaActual.id === 0 ? "Nueva Zona" : "Editar Zona"}
      >
        <Stack>
          <TextInput
            label="Nombre"
            placeholder="Ej: Zona Norte"
            value={zonaActual.nombre}
            onChange={(e) => setZonaActual({ ...zonaActual, nombre: e.target.value })}
            required
          />
          <TextInput
            label="Descripción"
            placeholder="Ej: Comprende los barrios..."
            value={zonaActual.descripcion}
            onChange={(e) => setZonaActual({ ...zonaActual, descripcion: e.target.value })}
          />
          <Group>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveZona}>
              {zonaActual.id === 0 ? 'Crear' : 'Guardar cambios'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}