import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
export default function LoginForm() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (user)
    return (
      <div className="p-4 bg-neutral-800 rounded-xl mb-6">
        <p className="text-lg">
          Olá, <b>{user.name}</b> ({user.role})
        </p>
        <button
          onClick={logout}
          className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white"
        >
          Sair
        </button>
      </div>
    );
  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) setError("Credenciais inválidas");
  };
  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto bg-neutral-800 p-4 rounded-xl mb-6"
    >
      <h2 className="text-lg mb-2 font-semibold">Entrar</h2>
      <input
        className="w-full mb-2 p-2 rounded bg-neutral-900 border border-neutral-700"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 rounded bg-neutral-900 border border-neutral-700"
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white"
      >
        Entrar
      </button>
    </form>
  );
}