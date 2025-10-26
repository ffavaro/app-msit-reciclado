'use client';

import { useState } from 'react';
import { 
  Button, 
  TextInput, 
  NumberInput, 
  Paper, 
  Table, 
  Title, 
  Stack,
  Group,
  Text,
  ActionIcon,
  Modal,
  Select
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/es'; // Para español
import { IconMail, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Material {
  id: number;
  nombre: string;
  cantidad: number;
  tipo: string;
}

interface Turno {
  id: number;
  donanteId: number;
  fecha: Date;
  materiales: Material[];
}

interface Donante {
  id: number;
  nombre: string;
  email: string;
}

const DONANTES: Donante[] = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com' },
  { id: 2, nombre: 'María García', email: 'maria@email.com' },
];

const TIPOS_MATERIALES = [
  { value: 'COMPUTADORA', label: 'Computadora/Laptop' },
  { value: 'CELULAR', label: 'Celular/Tablet' },
  { value: 'MONITOR', label: 'Monitor/TV' },
  { value: 'PERIFERICO', label: 'Periféricos (Mouse, Teclado, etc)' },
  { value: 'IMPRESORA', label: 'Impresora/Scanner' },
  { value: 'COMPONENTE', label: 'Componentes (RAM, CPU, etc)' },
  { value: 'CABLE', label: 'Cables/Conectores' },
  { value: 'BATERIA', label: 'Baterías' },
  { value: 'OTRO', label: 'Otros Electrónicos' }
];

export default function GestionTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedTurnoForEmail, setSelectedTurnoForEmail] = useState<Turno | null>(null);
  
  const [turnoActual, setTurnoActual] = useState<Turno>({
    id: 0,
    donanteId: 0,
    fecha: new Date(),
    materiales: []
  });

  const [materialActual, setMaterialActual] = useState<Material>({
    id: 0,
    nombre: '',
    cantidad: 0,
    tipo: ''
  });

  const handleAddMaterial = () => {
    if (!materialActual.nombre || !materialActual.cantidad || !materialActual.tipo) {
      notifications.show({
        title: 'Error',
        message: 'Por favor complete todos los campos del material',
        color: 'red'
      });
      return;
    }

    setTurnoActual({
      ...turnoActual,
      materiales: [...turnoActual.materiales, { ...materialActual, id: Date.now() }]
    });
    setMaterialActual({ id: 0, nombre: '', cantidad: 0, tipo: '' });
  };

  const handleSaveTurno = () => {
    if (!turnoActual.donanteId || turnoActual.materiales.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Por favor seleccione un donante y agregue al menos un material',
        color: 'red'
      });
      return;
    }

    if (turnoActual.id === 0) {
      setTurnos([...turnos, { ...turnoActual, id: Date.now() }]);
    } else {
      setTurnos(turnos.map(t => t.id === turnoActual.id ? turnoActual : t));
    }
    
    setModalOpen(false);
    setTurnoActual({ id: 0, donanteId: 0, fecha: new Date(), materiales: [] });
  };

  const handleDeleteTurno = (id: number) => {
    setTurnos(turnos.filter(t => t.id !== id));
  };

  const handleSendEmail = async (turno: Turno) => {
    try {
      const donante = DONANTES.find(d => d.id === turno.donanteId);
      if (!donante) throw new Error('Donante no encontrado');

      await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          email: donante.email,
          subject: 'Confirmación de Turno',
          content: `Su turno ha sido confirmado para el día ${turno.fecha.toLocaleDateString()} 
                   a las ${turno.fecha.toLocaleTimeString()}`
        })
      });

      notifications.show({
        title: 'Éxito',
        message: 'Email de confirmación enviado',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo enviar el email',
        color: 'red'
      });
    }
    setEmailModalOpen(false);
  };

  return (
    <Stack p="md">
      <Group position="apart">
        <Title order={2}>Gestión de Turnos</Title>
        <Button onClick={() => setModalOpen(true)}>Nuevo Turno</Button>
      </Group>

      <Paper shadow="xs">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Donante</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Materiales</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {turnos.map((turno) => (
              <Table.Tr key={turno.id}>
                <Table.Td>{turno.id}</Table.Td>
                <Table.Td>
                  {DONANTES.find(d => d.id === turno.donanteId)?.nombre || 'Desconocido'}
                </Table.Td>
                <Table.Td>{turno.fecha.toLocaleString()}</Table.Td>
                <Table.Td>{turno.materiales.length} items</Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon 
                      variant="filled" 
                      color="blue" 
                      onClick={() => {
                        setTurnoActual(turno);
                        setModalOpen(true);
                      }}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="filled" 
                      color="red" 
                      onClick={() => handleDeleteTurno(turno.id)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="filled" 
                      color="green" 
                      onClick={() => {
                        setSelectedTurnoForEmail(turno);
                        setEmailModalOpen(true);
                      }}
                    >
                      <IconMail size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal de creación/edición de turno */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTurnoActual({ id: 0, donanteId: 0, fecha: new Date(), materiales: [] });
        }}
        title={turnoActual.id === 0 ? "Nuevo Turno" : "Editar Turno"}
        size="xl"
      >
        <Stack>
          <Group grow>
            <Select
              label="Donante"
              data={DONANTES.map(d => ({ value: d.id.toString(), label: d.nombre }))}
              value={turnoActual.donanteId.toString() || null}
              onChange={(val) => setTurnoActual({...turnoActual, donanteId: Number(val)})}
            />
            <DateTimePicker
              label="Fecha de retiro"
              value={turnoActual.fecha}
              onChange={(date) => setTurnoActual({...turnoActual, fecha: date || new Date()})}
              valueFormat="DD/MM/YYYY HH:mm"
              labelFormat="MMMM YYYY"
              firstDayOfWeek={1}
              locale="es"
              clearable={false}
              minDate={new Date()}
              weekendDays={[0, 6]}
              hideOutsideDates
              withAsterisk
              size="md"
              styles={(theme) => ({
                input: {
                  fontSize: '1rem',
                  '&:focus': {
                    borderColor: theme.colors.blue[5],
                  },
                },
                calendar: {
                  padding: theme.spacing.md,
                  backgroundColor: theme.white,
                },
                timeInput: {
                  marginTop: theme.spacing.sm,
                  borderTop: `1px solid ${theme.colors.gray[3]}`,
                  paddingTop: theme.spacing.sm,
                },
                day: {
                  '&[data-weekend]': {
                    color: theme.colors.red[6],
                  },
                },
                calendarHeader: {
                  marginBottom: theme.spacing.sm,
                }
              })}
              amountOfMonths={1}
              dropdownType="popover"
              placeholder="Seleccione fecha y hora de retiro"
              withTime
              hoursLabel="Hora"
              minutesLabel="Minutos"
              timePlaceholder="Seleccione hora"
            />
          </Group>

          <Paper withBorder p="md">
            <Title order={4}>Materiales</Title>
            <Group grow mt="md">
              <Select
                label="Tipo de Dispositivo"
                data={TIPOS_MATERIALES}
                value={materialActual.tipo}
                onChange={(val) => setMaterialActual({...materialActual, tipo: val || ''})}
                searchable
                clearable
                required
              />
              <TextInput
                label="Descripción/Modelo"
                placeholder="Ej: Laptop Dell Latitude E6440"
                value={materialActual.nombre}
                onChange={(e) => setMaterialActual({...materialActual, nombre: e.target.value})}
                required
              />
              <NumberInput
                label="Cantidad"
                value={materialActual.cantidad}
                onChange={(val) => setMaterialActual({...materialActual, cantidad: val || 0})}
                min={1}
                step={1}
                hideControls={false}
               // error={materialActual.cantidad < 1 ? 'La cantidad debe ser al menos 1' : null}
                required
              />
              <Button 
                onClick={handleAddMaterial} 
                mt={24}
                disabled={!materialActual.nombre || materialActual.cantidad < 1 || !materialActual.tipo}
              >
                Agregar Material
              </Button>
            </Group>

            <Table mt="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Cantidad</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {turnoActual.materiales.map((material) => (
                  <Table.Tr key={material.id}>
                    <Table.Td>{material.nombre}</Table.Td>
                    <Table.Td>{material.cantidad}</Table.Td>
                    <Table.Td>{material.tipo}</Table.Td>
                    <Table.Td>
                      <ActionIcon 
                        color="red" 
                        onClick={() => {
                          setTurnoActual({
                            ...turnoActual,
                            materiales: turnoActual.materiales.filter(m => m.id !== material.id)
                          });
                        }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTurno}>
              {turnoActual.id === 0 ? 'Crear Turno' : 'Guardar Cambios'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de email */}
      <Modal
        opened={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Confirmar envío de email"
      >
        <Stack>
          <Text>¿Desea enviar un email de confirmación al donante?</Text>
          <Text size="sm">
            Se enviará a: {DONANTES.find(d => d.id === selectedTurnoForEmail?.donanteId)?.email}
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setEmailModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedTurnoForEmail && handleSendEmail(selectedTurnoForEmail)}
            >
              Enviar Email
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}