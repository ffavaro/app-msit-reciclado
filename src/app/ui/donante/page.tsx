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
  Textarea,
  Group,
  ActionIcon,
  Badge,
  Card,
  Grid,
  Text,
  Stack,
  Flex,
  Notification,
  Avatar,
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconUser,
  IconBuilding,
  IconCheck,
  IconX,
  IconPhone,
  IconMail,
  IconMapPin
} from '@tabler/icons-react';

interface Donante {
  id: number;
  nombre: string;
  apellido: string;
  tipoPersona: 'fisica' | 'juridica';
  razonSocial?: string;
  documento: string;
  tipoDocumento: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  tipoContribuyente: string;
  observaciones: string;
  fechaRegistro: string;
  activo: boolean;
  totalDonaciones: number;
}

const tiposDocumento = [
  { value: 'dni', label: 'DNI' },
  { value: 'cuit', label: 'CUIT' },
  { value: 'cuil', label: 'CUIL' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'cedula', label: 'Cédula' }
];

const tiposContribuyente = [
  { value: 'monotributista', label: 'Monotributista' },
  { value: 'responsable-inscripto', label: 'Responsable Inscripto' },
  { value: 'exento', label: 'Exento' },
  { value: 'consumidor-final', label: 'Consumidor Final' },
  { value: 'no-categorizado', label: 'No Categorizado' }
];

const provinciasArgentinas = [
  { value: 'buenos-aires', label: 'Buenos Aires' },
  { value: 'catamarca', label: 'Catamarca' },
  { value: 'chaco', label: 'Chaco' },
  { value: 'chubut', label: 'Chubut' },
  { value: 'cordoba', label: 'Córdoba' },
  { value: 'corrientes', label: 'Corrientes' },
  { value: 'entre-rios', label: 'Entre Ríos' },
  { value: 'formosa', label: 'Formosa' },
  { value: 'jujuy', label: 'Jujuy' },
  { value: 'la-pampa', label: 'La Pampa' },
  { value: 'la-rioja', label: 'La Rioja' },
  { value: 'mendoza', label: 'Mendoza' },
  { value: 'misiones', label: 'Misiones' },
  { value: 'neuquen', label: 'Neuquén' },
  { value: 'rio-negro', label: 'Río Negro' },
  { value: 'salta', label: 'Salta' },
  { value: 'san-juan', label: 'San Juan' },
  { value: 'san-luis', label: 'San Luis' },
  { value: 'santa-cruz', label: 'Santa Cruz' },
  { value: 'santa-fe', label: 'Santa Fe' },
  { value: 'santiago-del-estero', label: 'Santiago del Estero' },
  { value: 'tierra-del-fuego', label: 'Tierra del Fuego' },
  { value: 'tucuman', label: 'Tucumán' },
  { value: 'caba', label: 'CABA' }
];

export default function DonantesABM() {
  const [donantes, setDonantes] = useState<Donante[]>([
    {
      id: 1,
      nombre: 'Juan Carlos',
      apellido: 'Pérez',
      tipoPersona: 'fisica',
      documento: '12345678',
      tipoDocumento: 'dni',
      telefono: '+54 11 1234-5678',
      email: 'juan.perez@email.com',
      direccion: 'Av. Corrientes 1234',
      ciudad: 'Buenos Aires',
      provincia: 'caba',
      codigoPostal: '1043',
      tipoContribuyente: 'monotributista',
      observaciones: 'Donante frecuente',
      fechaRegistro: '2024-01-15',
      activo: true,
      totalDonaciones: 5
    },
    {
      id: 2,
      nombre: 'TechCorp',
      apellido: '',
      tipoPersona: 'juridica',
      razonSocial: 'TechCorp S.A.',
      documento: '30123456789',
      tipoDocumento: 'cuit',
      telefono: '+54 11 9876-5432',
      email: 'contacto@techcorp.com',
      direccion: 'Av. Santa Fe 5678',
      ciudad: 'Buenos Aires',
      provincia: 'caba',
      codigoPostal: '1425',
      tipoContribuyente: 'responsable-inscripto',
      observaciones: 'Empresa tecnológica, dona equipos regularmente',
      fechaRegistro: '2024-02-01',
      activo: true,
      totalDonaciones: 12
    }
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Donante | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoPersona: 'fisica' as 'fisica' | 'juridica',
    razonSocial: '',
    documento: '',
    tipoDocumento: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    tipoContribuyente: '',
    observaciones: '',
    fechaRegistro: new Date().toISOString().split('T')[0]
  });

  const limpiarForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      tipoPersona: 'fisica',
      razonSocial: '',
      documento: '',
      tipoDocumento: '',
      telefono: '',
      email: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      codigoPostal: '',
      tipoContribuyente: '',
      observaciones: '',
      fechaRegistro: new Date().toISOString().split('T')[0]
    });
  };

  const abrirModalCrear = () => {
    limpiarForm();
    setEditando(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (donante: Donante) => {
    setFormData({
      nombre: donante.nombre,
      apellido: donante.apellido,
      tipoPersona: donante.tipoPersona,
      razonSocial: donante.razonSocial || '',
      documento: donante.documento,
      tipoDocumento: donante.tipoDocumento,
      telefono: donante.telefono,
      email: donante.email,
      direccion: donante.direccion,
      ciudad: donante.ciudad,
      provincia: donante.provincia,
      codigoPostal: donante.codigoPostal,
      tipoContribuyente: donante.tipoContribuyente,
      observaciones: donante.observaciones,
      fechaRegistro: donante.fechaRegistro
    });
    setEditando(donante);
    setModalAbierto(true);
  };

  const guardarDonante = () => {
    const camposObligatorios = ['nombre', 'documento', 'tipoDocumento', 'telefono', 'email'];
    const faltanCampos = camposObligatorios.some(campo => !formData[campo as keyof typeof formData]);
    
    if (faltanCampos) {
      setNotification({message: 'Por favor completa todos los campos obligatorios', type: 'error'});
      return;
    }

    if (editando) {
      setDonantes(prev => prev.map(d => 
        d.id === editando.id 
          ? { 
              ...d, 
              ...formData,
              razonSocial: formData.tipoPersona === 'juridica' ? formData.razonSocial : undefined
            }
          : d
      ));
      setNotification({message: 'Donante actualizado exitosamente', type: 'success'});
    } else {
      const nuevoDonante: Donante = {
        id: Date.now(),
        ...formData,
        razonSocial: formData.tipoPersona === 'juridica' ? formData.razonSocial : undefined,
        activo: true,
        totalDonaciones: 0
      };
      setDonantes(prev => [...prev, nuevoDonante]);
      setNotification({message: 'Donante registrado exitosamente', type: 'success'});
    }

    setModalAbierto(false);
    limpiarForm();
    setEditando(null);
  };

  const eliminarDonante = (id: number) => {
    setDonantes(prev => prev.filter(d => d.id !== id));
    setNotification({message: 'Donante eliminado', type: 'success'});
  };

  const toggleActivo = (id: number) => {
    setDonantes(prev => prev.map(d => 
      d.id === id ? { ...d, activo: !d.activo } : d
    ));
  };

  // Estadísticas
  const totalDonantes = donantes.length;
  const donantesActivos = donantes.filter(d => d.activo).length;
  const totalDonacionesRealizadas = donantes.reduce((sum, d) => sum + d.totalDonaciones, 0);

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
            <Title order={1}>Gestión de Donantes</Title>
            <Button leftSection={<IconPlus size="1rem" />} onClick={abrirModalCrear}>
              Registrar Donante
            </Button>
          </Flex>

          {/* Estadísticas */}
          <Grid>
            <Grid.Col span={4}>
              <Card withBorder>
                <Text size="sm" c="dimmed">Total de Donantes</Text>
                <Text size="xl" fw={700}>{totalDonantes}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Text size="sm" c="dimmed">Donantes Activos</Text>
                <Text size="xl" fw={700} c="green">{donantesActivos}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Text size="sm" c="dimmed">Total Donaciones</Text>
                <Text size="xl" fw={700}>{totalDonacionesRealizadas}</Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabla de donantes */}
          <Card withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Donante</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Documento</Table.Th>
                  <Table.Th>Contacto</Table.Th>
                  <Table.Th>Ubicación</Table.Th>
                  <Table.Th>Donaciones</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {donantes.map((donante) => (
                  <Table.Tr key={donante.id}>
                    <Table.Td>
                      <Flex align="center" gap="sm">
                        <Avatar 
                          color={donante.tipoPersona === 'fisica' ? 'blue' : 'orange'} 
                          radius="xl"
                        >
                          {donante.tipoPersona === 'fisica' ? <IconUser size="1rem" /> : <IconBuilding size="1rem" />}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>
                            {donante.tipoPersona === 'fisica' 
                              ? `${donante.nombre} ${donante.apellido}`
                              : donante.razonSocial || donante.nombre
                            }
                          </Text>
                          <Text size="xs" c="dimmed">
                            {donante.tipoPersona === 'fisica' ? 'Persona Física' : 'Persona Jurídica'}
                          </Text>
                        </div>
                      </Flex>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={donante.tipoPersona === 'fisica' ? 'blue' : 'orange'} variant="light">
                        {donante.tipoPersona === 'fisica' ? 'Física' : 'Jurídica'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{donante.tipoDocumento.toUpperCase()}: {donante.documento}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap="xs">
                        <Flex align="center" gap="xs">
                          <IconPhone size="0.8rem" />
                          <Text size="xs">{donante.telefono}</Text>
                        </Flex>
                        <Flex align="center" gap="xs">
                          <IconMail size="0.8rem" />
                          <Text size="xs">{donante.email}</Text>
                        </Flex>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Flex align="center" gap="xs">
                        <IconMapPin size="0.8rem" />
                        <Text size="xs">{donante.ciudad}, {donante.provincia}</Text>
                      </Flex>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>{donante.totalDonaciones}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={donante.activo ? 'green' : 'red'} 
                        variant="light"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleActivo(donante.id)}
                      >
                        {donante.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon 
                          variant="subtle" 
                          color="blue"
                          onClick={() => abrirModalEditar(donante)}
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                        <ActionIcon 
                          variant="subtle" 
                          color="red"
                          onClick={() => eliminarDonante(donante.id)}
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
          title={editando ? 'Editar Donante' : 'Registrar Nuevo Donante'}
          size="xl"
        >
          <Stack gap="md">
            {/* Tipo de persona */}
            <Select
              label="Tipo de Persona"
              data={[
                { value: 'fisica', label: 'Persona Física' },
                { value: 'juridica', label: 'Persona Jurídica' }
              ]}
              value={formData.tipoPersona}
              onChange={(value) => setFormData({...formData, tipoPersona: value as 'fisica' | 'juridica'})}
              required
            />

            <Grid>
              {/* Campos específicos según el tipo */}
              {formData.tipoPersona === 'fisica' ? (
                <>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Nombre"
                      placeholder="Juan Carlos"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Apellido"
                      placeholder="Pérez"
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      required
                    />
                  </Grid.Col>
                </>
              ) : (
                <>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Razón Social"
                      placeholder="TechCorp S.A."
                      value={formData.razonSocial}
                      onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Nombre de Fantasía"
                      placeholder="TechCorp"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </Grid.Col>
                </>
              )}

              {/* Documento */}
              <Grid.Col span={6}>
                <Select
                  label="Tipo de Documento"
                  data={tiposDocumento}
                  value={formData.tipoDocumento}
                  onChange={(value) => setFormData({...formData, tipoDocumento: value || ''})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Número de Documento"
                  placeholder="12345678"
                  value={formData.documento}
                  onChange={(e) => setFormData({...formData, documento: e.target.value})}
                  required
                />
              </Grid.Col>

              {/* Contacto */}
              <Grid.Col span={6}>
                <TextInput
                  label="Teléfono"
                  placeholder="+54 11 1234-5678"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  placeholder="contacto@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Grid.Col>

              {/* Dirección */}
              <Grid.Col span={12}>
                <TextInput
                  label="Dirección"
                  placeholder="Av. Corrientes 1234"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Ciudad"
                  placeholder="Buenos Aires"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Provincia"
                  data={provinciasArgentinas}
                  value={formData.provincia}
                  onChange={(value) => setFormData({...formData, provincia: value || ''})}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Código Postal"
                  placeholder="1043"
                  value={formData.codigoPostal}
                  onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                />
              </Grid.Col>

              {/* Datos fiscales */}
              <Grid.Col span={6}>
                <Select
                  label="Tipo de Contribuyente"
                  data={tiposContribuyente}
                  value={formData.tipoContribuyente}
                  onChange={(value) => setFormData({...formData, tipoContribuyente: value || ''})}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Fecha de Registro"
                  type="date"
                  value={formData.fechaRegistro}
                  onChange={(e) => setFormData({...formData, fechaRegistro: e.target.value})}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Textarea
                  label="Observaciones"
                  placeholder="Notas adicionales sobre el donante..."
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarDonante}>
                {editando ? 'Actualizar' : 'Guardar'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </AppShell>
  );
}