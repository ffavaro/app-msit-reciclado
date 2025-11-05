'use client';
import React, { useEffect, useState } from 'react';
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
import { useApi } from '@/hooks/useApi';

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

interface TiposMateriales {
  id: number;
  descripcion: string;
}
interface EstadoMaterial {
  id: number;
  descripcion: string;
}

export default function MaterialElectronicoABM() {
  const { 
      data: tiposMaterial, 
      loading, 
      error,
      fetchData
    } = useApi<TiposMateriales>({
      endpoint: 'tipoMaterial',
      errorMessages: {
        get: 'Error al cargar las tipos de material',
      }
    });

     const { 
      data: estadoMaterial, 
      loading: loadingEstados, 
      error: errorEstados,
      fetchData: fetchEstados
    } = useApi<EstadoMaterial>({
      endpoint: 'estadoMaterial',
      errorMessages: {
        get: 'Error al cargar las tipos de material',
      }
    });

      const { 
      data: materialesList, 
      loading: loadingMateriales, 
      error: errorMateriales,
      fetchData: fetchMateriales,
      createItem,
      updateItem,
      deleteItem 
    } = useApi<MaterialElectronico>({
      endpoint: 'materiales',
      errorMessages: {
        get: 'Error al cargar la material',
        create: 'Error al cargar las material',
        update: 'Error al cargar las  material',
        delete: 'Error al cargar las material',
      }
    });

     useEffect(() => {
        fetchData();
        fetchEstados();
        fetchMateriales();
      }, []);

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
     let tipoEdito = tiposMaterial.find(t => t.id.toString() == material.tipo)
     let estadoEdito = estadoMaterial.find(e => e.id.toString() == material.estado)
    setFormData({
      nombre: material.nombre,
      tipo: tipoEdito?.descripcion || '',
      marca: material.marca,
      modelo: material.modelo,
      estado: estadoEdito?.descripcion || '',
      peso: material.peso,
      descripcion: material.descripcion,
      fechaIngreso: material.fechaIngreso
    });
    setEditando(material);
    setModalAbierto(true);
  };

  const guardarMaterial = async () => {
    if (!formData.nombre || !formData.tipo || !formData.marca || !formData.estado) {
      setNotification({message: 'Por favor completa todos los campos obligatorios', type: 'error'});
      return;
    }

    try {
      if (editando) {
        // Actualizar material existente
        await updateItem(editando.id, {
          ...formData,
          procesado: editando.procesado
        });
        setNotification({message: 'Material actualizado exitosamente', type: 'success'});
      } else {
        // Crear nuevo material
        await createItem({
          ...formData,
          procesado: false
        });
        setNotification({message: 'Material registrado exitosamente', type: 'success'});
      }

      setModalAbierto(false);
      limpiarForm();
      setEditando(null);
      fetchMateriales(); // Recargar la lista
    } catch (error) {
      setNotification({
        message: 'Error al guardar el material: ' + (error as Error).message,
        type: 'error'
      });
    }
  };

  const eliminarMaterial = async (id: number) => {
    try {
      await deleteItem(id);
      setNotification({message: 'Material eliminado exitosamente', type: 'success'});
      fetchMateriales(); // Recargar la lista
    } catch (error) {
      setNotification({
        message: 'Error al eliminar el material: ' + (error as Error).message,
        type: 'error'
      });
    }
  };

  const toggleProcesado = async (id: number) => {
    const material = materialesList.find(m => m.id === id);
    if (!material) return;

    try {
      await updateItem(id, {
        ...material,
        procesado: !material.procesado
      });
      fetchMateriales(); // Recargar la lista
      setNotification({
        message: `Material marcado como ${!material.procesado ? 'procesado' : 'pendiente'}`,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Error al actualizar el estado: ' + (error as Error).message,
        type: 'error'
      });
    }
  };

  // Loading state handler
  if (loadingMateriales) {
    return (
      <Container size="xl">
        <Text>Cargando materiales...</Text>
      </Container>
    );
  }

  // Error state handler
  if (errorMateriales) {
    return (
      <Container size="xl">
        <Notification color="red" title="Error">
          {errorMateriales}
        </Notification>
      </Container>
    );
  }

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
  const totalMateriales = materialesList.length;
  const materialesProcesados = materialesList.filter(m => m.procesado).length;
  const pesoTotal = materialesList.reduce((sum, m) => sum + m.peso, 0);

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
                <Text size="xl" fw={700}>{pesoTotal}</Text>
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
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {materialesList.map((material) => (
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
                  data={tiposMaterial?.map(tipo => ({ value: tipo.id.toString(), label: tipo.descripcion }))}
                  value={formData.tipo}
                  onChange={(value) => setFormData({...formData, tipo: value || ''})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Estado"
                  placeholder="Selecciona el estado"
                  data={estadoMaterial?.map(tipo => ({ value: tipo.id.toString(), label: tipo.descripcion }))}
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
                  display={"none"}
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