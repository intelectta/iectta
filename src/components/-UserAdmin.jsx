import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
export default function UserAdmin() {
  const { createUser, users } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    await createUser(form.name, form.email, form.password, form.role);
    setForm({ name: "", email: "", password: "", role: "user" });
  };
  return (
    <div className="bg-neutral-800 p-4 rounded-xl">
      <form onSubmit={submit} className="flex flex-wrap gap-2 mb-3">
        <input className="p-2 rounded bg-neutral-900 border border-neutral-700" placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
        <input className="p-2 rounded bg-neutral-900 border border-neutral-700" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
        <input className="p-2 rounded bg-neutral-900 border border-neutral-700" placeholder="Senha" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
        <select className="p-2 rounded bg-neutral-900 border border-neutral-700" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="user">Usuário</option>
          <option value="manager">Gerente</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white">Adicionar</button>
      </form>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-neutral-700"><th>Nome</th><th>Email</th><th>Papel</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-neutral-700">
              <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}