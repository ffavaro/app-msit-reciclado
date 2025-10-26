'use client';

import { useState, useEffect } from 'react';
import { 
  Table,
  Paper,
  Title,
  Stack,
  Badge,
  Group,
  Text
} from '@mantine/core';

interface Material {
  id: number;
  tipo: string;
  nombre: string;
  marca: string;
  modelo: string;
  estado: 'NUEVO' | 'USADO' | 'PARA_REPUESTO';
  cantidad: number;
}

const MATERIALES_EJEMPLO: Material[] = [
  {
    id: 1,
    tipo: 'COMPUTADORA',
    nombre: 'Laptop Dell Latitude',
    marca: 'Dell',
    modelo: 'E6440',
    estado: 'USADO',
    cantidad: 3
  },
  {
    id: 2,
    tipo: 'CELULAR',
    nombre: 'iPhone 11',
    marca: 'Apple',
    modelo: 'A2111',
    estado: 'PARA_REPUESTO',
    cantidad: 5
  },
  {
    id: 3,
    tipo: 'MONITOR',
    nombre: 'Monitor LED Samsung',
    marca: 'Samsung',
    modelo: 'S24R350',
    estado: 'NUEVO',
    cantidad: 2
  },
  {
    id: 4,
    tipo: 'COMPONENTE',
    nombre: 'Memoria RAM DDR4',
    marca: 'Kingston',
    modelo: 'HyperX 8GB',
    estado: 'NUEVO',
    cantidad: 10
  },
  {
    id: 5,
    tipo: 'IMPRESORA',
    nombre: 'Impresora Láser',
    marca: 'HP',
    modelo: 'LaserJet P1102w',
    estado: 'USADO',
    cantidad: 1
  }
];

export default function ListadoMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);

  useEffect(() => {
    // Simulamos carga de datos
    setMateriales(MATERIALES_EJEMPLO);
  }, []);

  const getEstadoBadge = (estado: Material['estado']) => {
    const colors = {
      NUEVO: 'green',
      USADO: 'yellow',
      PARA_REPUESTO: 'red'
    };

    const labels = {
      NUEVO: 'Nuevo',
      USADO: 'Usado',
      PARA_REPUESTO: 'Para Repuesto'
    };

    return (
      <Badge color={colors[estado]}>
        {labels[estado]}
      </Badge>
    );
  };

  return (
    <Stack p="md">
      <Title order={2}>Listado de Materiales</Title>

      <Paper shadow="xs">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Marca/Modelo</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Cantidad</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {materiales.map((material) => (
              <Table.Tr key={material.id}>
                <Table.Td>
                  <Text fw={500}>{material.tipo}</Text>
                </Table.Td>
                <Table.Td>{material.nombre}</Table.Td>
                <Table.Td>
                  <Group spacing="xs">
                    <Text size="sm" fw={500}>{material.marca}</Text>
                    <Text size="sm" c="dimmed">{material.modelo}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{getEstadoBadge(material.estado)}</Table.Td>
                <Table.Td>{material.cantidad}</Table.Td>
              </Table.Tr>
            ))}
            {materiales.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  No hay materiales registrados
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}