'use client';
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { AppLayout } from "../components/Sidebar";
import "@mantine/notifications/styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
            <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
