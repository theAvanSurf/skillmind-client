"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { validateEmail } from "src/utils/validators";
import { useAuth } from "src/hooks/useAuth";

export default function LoginForm() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    if (!password) {
      setError("La contraseña es obligatoria");
      return;
    }

    setError("");
    await login(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
    >
      <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>

      <Input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
