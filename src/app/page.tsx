"use client";
import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Divider,
  Stack,
  Group,
  Anchor,
  Checkbox,
  Container,
} from "@mantine/core";
import { IconBrandGoogle, IconRecycle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
export default function WastechSSOLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría tu lógica de login real
      console.log("Logging in with:", email, password);

      // Ejemplo: await loginAPI(email, password);

      // Solo redirigir si el login fue exitoso
      router.push("/ui/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
      // setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    setLoading(true);

    try {
      // Aquí iría tu lógica de login real
      console.log("Logging in with:", email, password);

      // Ejemplo: await loginAPI(email, password);

      // Solo redirigir si el login fue exitoso
      router.push("/ui/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
      // setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #248b69ff 0%, #126d50ff 100%)',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container size={420}>
        <Paper
          radius="md"
          p="xl"
          shadow="xl"
          style={{ backgroundColor: "white" }}
        >
          {/* Logo y Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                 background: 'linear-gradient(135deg, #248b69ff 0%, #126d50ff 100%)',
                marginBottom: "16px",
              }}
            >
              <IconRecycle size={36} color="white" />
            </div>
            <Title
              order={2}
              style={{
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "8px",
              }}
            >
              Wastech
            </Title>
            <Text size="sm" c="dimmed">
              Reciclado Tecnológico
            </Text>
          </div>

          {/* Botón SSO Google */}
          <Stack gap="md" mb="xl">
            <Button
              leftSection={<IconBrandGoogle size={20} />}
              variant="filled"
              fullWidth
              onClick={handleGoogleSSO}
              loading={googleLoading}
              size="md"
              styles={{
                root: {
                  "&:hover": {
                    backgroundColor: "#030303ff",
                  },
                },
              }}
            >
              Continuar con Google
            </Button>
          </Stack>

          <Divider
            label="O continúa con email"
            labelPosition="center"
            my="lg"
          />

          {/* Formulario de login */}
          <div>
            <Stack gap="md">
              <TextInput
                required
                label="Email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                radius="md"
                size="md"
              />

              <PasswordInput
                required
                label="Contraseña"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                radius="md"
                size="md"
              />

              <Group justify="space-between">
                <Checkbox
                  label="Recordarme"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.currentTarget.checked)}
                />
                <Anchor size="sm" href="#" style={{ color: "#dc2626" }}>
                  ¿Olvidaste tu contraseña?
                </Anchor>
              </Group>

              <Button
                onClick={handleLogin}
                fullWidth
                mt="md"
                size="md"
                loading={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                }}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </div>

          {/* Footer */}
          <Text ta="center" mt="xl" size="sm" c="dimmed">
            ¿No tienes una cuenta?{" "}
            <Anchor
              size="sm"
              href="#"
              style={{ color: "#dc2626", fontWeight: 600 }}
            >
              Regístrate
            </Anchor>
          </Text>
        </Paper>

        {/* Copyright */}
        <Text ta="center" mt="md" size="xs" c="white">
          © 2025 Wastech. Todos los derechos reservados.
        </Text>
      </Container>
    </div>
  );
}
