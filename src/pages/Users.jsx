import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
export default function Users() {
  const { users } = useAuth();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-3">👥 Usuários</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-700 text-left">
            <th>Nome</th><th>Email</th><th>Papel</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-neutral-700">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}