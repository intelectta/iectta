// src/components/ProjectTable.jsx
import React, { useEffect, useState } from "react";
import { db } from "../data/db.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const { user } = useAuth(); // Só mostra se estiver logado

  // Carregar projetos
  const loadProjects = async () => {
    const data = await db.projects.toArray();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Adicionar projeto
  const addProject = async () => {
    if (!newName.trim()) return;
    await db.projects.add({
      name: newName,
      status: "Novo",
      priority: "Média",
    });
    setNewName("");
    loadProjects();
  };

  // DELETAR PROJETO + TAREFAS VINCULADAS
  const deleteProject = async (id) => {
    if (!window.confirm("Excluir este projeto?\nTodas as tarefas associadas também serão removidas.")) return;

    // 1. Deletar tarefas vinculadas
    await db.tasks.where({ projectId: id }).delete();

    // 2. Deletar o projeto
    await db.projects.delete(id);

    // 3. Atualizar lista
    loadProjects();
  };

  // Só mostra se estiver logado
  if (!user) return null;

  return (
    <div className="bg-neutral-800 p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Projetos</h2>

      {/* Input + botão de adicionar */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded bg-neutral-900 border border-neutral-700 text-sm"
          placeholder="Novo projeto..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addProject()}
        />
        <button
          onClick={addProject}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white text-sm"
        >
          Adicionar
        </button>
      </div>

      {/* Tabela de projetos */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-neutral-700">
            <th>Nome</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th className="w-20">Ação</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-neutral-500 italic py-2 text-center">
                Nenhum projeto ainda.
              </td>
            </tr>
          ) : (
            projects.map((p) => (
              <tr key={p.id} className="border-b border-neutral-700">
                <td className="font-medium">{p.name}</td>
                <td>{p.status}</td>
                <td>{p.priority}</td>
                <td>
                  
				  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-medium"
                    title="Excluir projeto"
                  >
                    Excluir
                  </button>
				  
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}