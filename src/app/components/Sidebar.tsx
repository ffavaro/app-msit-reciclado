"use client";
import React from "react";
import { AppShell, Text, NavLink, Group } from "@mantine/core";
import {
  IconHome,
  IconUser,
  IconSettings,
  IconMapCode,
  IconCalendar,
} from "@tabler/icons-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      navbar={{ width: 250, breakpoint: "sm" }}
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header
        style={{
          background: "linear-gradient(135deg, #248b69ff 0%, #126d50ff 100%)",
        }}
      >
        <Group
          align="center"
          justify="space-between"
          style={{ height: "100%", paddingLeft: 20, paddingRight: 20 }}
        >
          <Text size="xl">WasTec</Text>
          <img src="/wastech.png" alt="WasTec Logo" width={80} height={80} />
          <Text size="xl">Perfil</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          background: "linear-gradient(135deg, #248b69ff 0%, #126d50ff 100%)",
        }}
      >
        <NavLink
          href="/ui/dashboard"
          label="Dashboard"
          leftSection={<IconHome size="1.5rem" />}
        />
        <NavLink
          href="/ui/turno"
          label="Turnos"
          leftSection={<IconCalendar size="1.5rem" />}
        />
        <NavLink
          href="/ui/material"
          label="Materiales"
          leftSection={<IconSettings size="1.5rem" />}
        />
        <NavLink
          href="/ui/donante"
          label="Donantes"
          leftSection={<IconUser size="1.5rem" />}
        />
        <NavLink
          href="/ui/zona"
          label="Zonas"
          leftSection={<IconMapCode size="1.5rem" />}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
