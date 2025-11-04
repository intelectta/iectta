import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProjectTable from "./ProjectTable.jsx";
import TaskBoard from "./TaskBoard.jsx";
import UserAdmin from "./UserAdmin.jsx";
export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Projetos</h2>
        <ProjectTable />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Tarefas</h2>
        <TaskBoard />
      </div>
      {user.role === "admin" && (
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Usuários</h2>
          <UserAdmin />
        </div>
      )}
    </div>
  );
}