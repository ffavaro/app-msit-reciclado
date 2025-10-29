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

interface Zona {
  id: number;
  nombre: string;
  descripcion: string;
}

const ZONAS_EJEMPLO: Zona[] = [
  {
    id: 1,
    nombre: 'Zona Capital',
    descripcion: 'Centro de la ciudad y alrededores: Nueva Córdoba, Alberdi, Centro, Güemes'
  },
  {
    id: 2,
    nombre: 'Zona Norte',
    descripcion: 'Incluye barrios: Rivera Indarte, Villa Belgrano, Argüello, La Calera'
  },
  {
    id: 3,
    nombre: 'Zona Sur',
    descripcion: 'Comprende: Villa El Libertador, Santa Isabel, Residencial Sud, Deán Funes'
  },
  {
    id: 4,
    nombre: 'Zona Este',
    descripcion: 'Abarca: San Vicente, General Pueyrredón, Primero de Mayo, Empalme'
  },
  {
    id: 5,
    nombre: 'Zona Oeste',
    descripcion: 'Incluye: Cerro de las Rosas, Villa Cabrera, Alto Verde, Los Naranjos'
  }
];

export default function GestionZonas() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [zonaActual, setZonaActual] = useState<Zona>({
    id: 0,
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    // Simulamos carga inicial de datos
    setZonas(ZONAS_EJEMPLO);
  }, []);

  const handleSaveZona = () => {
    if (!zonaActual.nombre.trim()) {
      notifications.show({
        title: 'Error',
        message: 'El nombre de la zona es requerido',
        color: 'red',
        position: 'top-right'
      });
      return;
    }

    if (zonaActual.id === 0) {
      // Nueva zona
      setZonas([...zonas, { ...zonaActual, id: Date.now() }]);
    } else {
      // Modificar zona existente
      setZonas(zonas.map(z => z.id === zonaActual.id ? zonaActual : z));
    }

    setModalOpen(false);
    setZonaActual({ id: 0, nombre: '', descripcion: '' });
  };

  const handleDeleteZona = (id: number) => {
    setZonas(zonas.filter(z => z.id !== id));
    notifications.show({
      title: 'Éxito',
      message: 'Zona eliminada correctamente',
      color: 'green'
    });
  };

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