'use client';
import React from 'react';
import { AppShell,Text, NavLink } from '@mantine/core';
import { IconHome, IconUser, IconSettings, IconMapCode } from '@tabler/icons-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      navbar={{ width: 250, breakpoint: 'sm' }}
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Text size="xl" fw={500} p="md">WasTec</Text>
      </AppShell.Header>
      
      <AppShell.Navbar p="md">
        {/* <NavLink
          href="/"
          label="Inicio"
          leftSection={<IconHome size="1rem" />}
        /> */}
     {/*    <NavLink
          href="/profile"
          label="Perfil"
          leftSection={<IconUser size="1rem" />}
        /> */}
       
          <NavLink
          href="/ui/turno"
          label="Turnos"
          leftSection={<IconUser size="1rem" />}
        />
        <NavLink
          href="/ui/material"
          label="Materiales"
          leftSection={<IconSettings size="1rem" />}
        />
      {/*   <NavLink
          href="/ui/material/list"
          label="Listado Materiales"
          leftSection={<IconSettings size="1rem" />}
        /> */}
         <NavLink
          href="/ui/donante"
          label="Donantes"
          leftSection={<IconUser size="1rem" />}
        />
         <NavLink
          href="/ui/zona"
          label="Zonas"
          leftSection={<IconMapCode size="1rem" />}
        />
      </AppShell.Navbar>
      
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}