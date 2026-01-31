import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../store/AuthStore";

type Mode = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { status, error, login, register, clearError } = useAuthStore();

  const isLoading = status === "loading";
  const isRegister = mode === "register";

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (isRegister && !username.trim()) return false;
    return true;
  }, [email, password, isRegister, username]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === "register") {
      await register({ username, email, password });
      setMode("login");
      return;
    }

    await login({ email, password });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <Container maxWidth="sm">
        <Card className="p-8">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" className="font-bold">
                {isRegister ? "Create account" : "Sign in"}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {isRegister
                  ? "Register to access products"
                  : "Login to access products"}
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                {isRegister && (
                  <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    disabled={isLoading}
                    required
                  />
                )}

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                  required
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  disabled={isLoading}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit || isLoading}
                >
                  {isRegister ? "Register" : "Login"}
                </Button>

                <Button
                  type="button"
                  variant="text"
                  onClick={() => {
                    clearError();
                    setMode((m) => (m === "login" ? "register" : "login"));
                  }}
                  disabled={isLoading}
                >
                  {isRegister
                    ? "Have an account? Sign in"
                    : "No account? Register"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Container>
    </div>
  );
}
