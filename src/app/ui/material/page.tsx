'use client';
import React, { useState } from 'react';
import {
  AppShell,
  Container,
  Title,
  Button,
  Table,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Group,
  ActionIcon,
  Badge,
  Card,
  Grid,
  Text,
  Stack,
  Flex,
  Notification
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconCheck,
  IconX
} from '@tabler/icons-react';

interface MaterialElectronico {
  id: number;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  estado: string;
  peso: number;
  descripcion: string;
  fechaIngreso: string;
  procesado: boolean;
}

const tiposMaterial = [
  { value: 'computadora', label: 'Computadora' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'celular', label: 'Celular' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'television', label: 'Televisión' },
  { value: 'electrodomestico', label: 'Electrodoméstico' },
  { value: 'componente', label: 'Componente' },
  { value: 'otro', label: 'Otro' }
];

const estadosMaterial = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
  { value: 'no-funciona', label: 'No Funciona' }
];

export default function MaterialElectronicoABM() {
  const [materiales, setMateriales] = useState<MaterialElectronico[]>([
    {
      id: 1,
      nombre: 'Laptop HP',
      tipo: 'laptop',
      marca: 'HP',
      modelo: 'Pavilion 15',
      estado: 'bueno',
      peso: 2.3,
      descripcion: 'Laptop en buen estado, pantalla funcionando',
      fechaIngreso: '2024-01-15',
      procesado: false
    }
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<MaterialElectronico | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    marca: '',
    modelo: '',
    estado: '',
    peso: 0,
    descripcion: '',
    fechaIngreso: new Date().toISOString().split('T')[0]
  });

  const limpiarForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      marca: '',
      modelo: '',
      estado: '',
      peso: 0,
      descripcion: '',
      fechaIngreso: new Date().toISOString().split('T')[0]
    });
  };

  const abrirModalCrear = () => {
    limpiarForm();
    setEditando(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (material: MaterialElectronico) => {
    setFormData({
      nombre: material.nombre,
      tipo: material.tipo,
      marca: material.marca,
      modelo: material.modelo,
      estado: material.estado,
      peso: material.peso,
      descripcion: material.descripcion,
      fechaIngreso: material.fechaIngreso
    });
    setEditando(material);
    setModalAbierto(true);
  };

  const guardarMaterial = () => {
    if (!formData.nombre || !formData.tipo || !formData.marca || !formData.estado) {
      setNotification({message: 'Por favor completa todos los campos obligatorios', type: 'error'});
      return;
    }

    if (editando) {
      setMateriales(prev => prev.map(m => 
        m.id === editando.id 
          ? { ...m, ...formData }
          : m
      ));
      setNotification({message: 'Material actualizado exitosamente', type: 'success'});
    } else {
      const nuevoMaterial: MaterialElectronico = {
        id: Date.now(),
        ...formData,
        procesado: false
      };
      setMateriales(prev => [...prev, nuevoMaterial]);
      setNotification({message: 'Material registrado exitosamente', type: 'success'});
    }

    setModalAbierto(false);
    limpiarForm();
    setEditando(null);
  };

  const eliminarMaterial = (id: number) => {
    setMateriales(prev => prev.filter(m => m.id !== id));
    setNotification({message: 'Material eliminado', type: 'success'});
  };

  const toggleProcesado = (id: number) => {
    setMateriales(prev => prev.map(m => 
      m.id === id ? { ...m, procesado: !m.procesado } : m
    ));
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'laptop': return <IconDeviceLaptop size={16} />;
      case 'celular': return <IconDeviceMobile size={16} />;
      case 'computadora': return <IconDeviceDesktop size={16} />;
      default: return <IconDeviceLaptop size={16} />;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'excelente': return 'green';
      case 'bueno': return 'blue';
      case 'regular': return 'yellow';
      case 'malo': return 'orange';
      case 'no-funciona': return 'red';
      default: return 'gray';
    }
  };

  // Estadísticas
  const totalMateriales = materiales.length;
  const materialesProcesados = materiales.filter(m => m.procesado).length;
  const pesoTotal = materiales.reduce((sum, m) => sum + m.peso, 0);

  return (
    <AppShell padding="md">
      <Container size="xl">
        {notification && (
          <Notification
            icon={notification.type === 'success' ? <IconCheck size="1.1rem" /> : <IconX size="1.1rem" />}
            color={notification.type === 'success' ? 'teal' : 'red'}
            title={notification.type === 'success' ? 'Éxito' : 'Error'}
            onClose={() => setNotification(null)}
            mb="md"
          >
            {notification.message}
          </Notification>
        )}

        <Stack gap="lg">
          <Flex justify="space-between" align="center">
            <Title order={1}>Gestión de Material Electrónico Reciclable</Title>
            <Button leftSection={<IconPlus size="1rem" />} onClick={abrirModalCrear}>
              Registrar Material
            </Button>
          </Flex>

          {/* Estadísticas */}
          <Grid>
            <Grid.Col span={4}>
              <Card withBorder>
                <Text size="sm" c="dimmed">Total de Materiales</Text>
                <Text size="xl" fw={700}>{totalMateriales}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Text size="sm" c="dimmed">Procesados</Text>
                <Text size="xl" fw={700} c="green">{materialesProcesados}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Text size="sm" c="dimmed">Peso Total (kg)</Text>
                <Text size="xl" fw={700}>{pesoTotal.toFixed(1)}</Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabla de materiales */}
          <Card withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Marca/Modelo</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Peso (kg)</Table.Th>
                  <Table.Th>Fecha Ingreso</Table.Th>
                  <Table.Th>Estado Proceso</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {materiales.map((material) => (
                  <Table.Tr key={material.id}>
                    <Table.Td>
                      <Flex align="center" gap="xs">
                        {getIconoTipo(material.tipo)}
                        <Text size="sm" tt="capitalize">{material.tipo}</Text>
                      </Flex>
                    </Table.Td>
                    <Table.Td>{material.nombre}</Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {material.marca} {material.modelo}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getColorEstado(material.estado)} variant="light">
                        {material.estado}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{material.peso} kg</Table.Td>
                    <Table.Td>{material.fechaIngreso}</Table.Td>
                    <Table.Td>
                      <Badge 
                        color={material.procesado ? 'green' : 'gray'} 
                        variant="light"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleProcesado(material.id)}
                      >
                        {material.procesado ? 'Procesado' : 'Pendiente'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon 
                          variant="subtle" 
                          color="blue"
                          onClick={() => abrirModalEditar(material)}
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                        <ActionIcon 
                          variant="subtle" 
                          color="red"
                          onClick={() => eliminarMaterial(material.id)}
                        >
                          <IconTrash size="1rem" />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Stack>

        {/* Modal para crear/editar */}
        <Modal
          opened={modalAbierto}
          onClose={() => setModalAbierto(false)}
          title={editando ? 'Editar Material' : 'Registrar Nuevo Material'}
          size="lg"
        >
          <Stack gap="md">
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Nombre del Material"
                  placeholder="Ej: Laptop HP Pavilion"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Tipo de Material"
                  placeholder="Selecciona el tipo"
                  data={tiposMaterial}
                  value={formData.tipo}
                  onChange={(value) => setFormData({...formData, tipo: value || ''})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Estado"
                  placeholder="Selecciona el estado"
                  data={estadosMaterial}
                  value={formData.estado}
                  onChange={(value) => setFormData({...formData, estado: value || ''})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Marca"
                  placeholder="Ej: HP, Samsung, Apple"
                  value={formData.marca}
                  onChange={(e) => setFormData({...formData, marca: e.target.value})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Modelo"
                  placeholder="Ej: Pavilion 15"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Peso (kg)"
                  placeholder="0.0"
                  min={0}
                  step={0.1}
                  decimalScale={2}
                  value={formData.peso}
                  onChange={(value) => setFormData({...formData, peso: Number(value) || 0})}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Fecha de Ingreso"
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => setFormData({...formData, fechaIngreso: e.target.value})}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Descripción"
                  placeholder="Descripción adicional del material..."
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarMaterial}>
                {editando ? 'Actualizar' : 'Guardar'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </AppShell>
  );
}