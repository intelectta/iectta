// src/components/ProjectTable.jsx
import React, { useEffect, useState } from "react";
import { db } from "../data/db.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Trash2, Check, X, Folder, CheckCircle2 } from "lucide-react";

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("Novo");
  const [newPriority, setNewPriority] = useState("Média");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const { user } = useAuth();

  const loadProjects = async () => {
    const data = await db.projects.toArray();
    setProjects(data);
  };

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  const addProject = async () => {
    if (!newName.trim()) return;
    await db.projects.add({
      name: newName.trim(),
      status: newStatus,
      priority: newPriority,
    });
    setNewName("");
    setNewStatus("Novo");
    setNewPriority("Média");
    loadProjects();
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Excluir projeto e TODAS as suas tarefas?")) return;
    await db.tasks.where({ projectId: id }).delete();
    await db.projects.delete(id);
    loadProjects();
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditStatus(project.status);
    setEditPriority(project.priority);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditStatus("");
    setEditPriority("");
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    await db.projects.update(editingId, {
      name: editName.trim(),
      status: editStatus,
      priority: editPriority,
    });
    cancelEdit();
    loadProjects();
  };

  if (!user) return null;

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Folder className="text-green-500" size={28} />
          Projetos
        </h2>
      </div>

      {/* FORMULÁRIO DE NOVO PROJETO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
        <input
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nome do projeto..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addProject()}
        />
        <select
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Novo">Novo</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
        </select>
        <select
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
        <button
          onClick={addProject}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          + Adicionar
        </button>
      </div>

      {/* LISTA DE PROJETOS COM CARDS MODERNOS */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <div className="bg-neutral-800 rounded-xl p-8 border border-dashed border-neutral-700">
              <p className="text-lg italic">Nenhum projeto cadastrado ainda.</p>
            </div>
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="group bg-gradient-to-br from-neutral-800 to-neutral-850 p-5 rounded-xl border border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                {editingId === p.id ? (
                  /* MODO EDIÇÃO */
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                    />
                    <select
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="Novo">Novo</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                    <select
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="Alta">Alta</option>
                      <option value="Média">Média</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                  </div>
                ) : (
                  /* MODO VISUALIZAÇÃO */
                  <div
                    className="flex-1 cursor-pointer pr-4"
                    onClick={() => startEdit(p)}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* STATUS */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "Concluído"
                            ? "bg-green-900 text-green-300"
                            : p.status === "Em andamento"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-indigo-900 text-indigo-300"
                        }`}
                      >
                        {p.status}
                      </span>
                      {/* PRIORIDADE */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          p.priority === "Alta"
                            ? "bg-red-900 text-red-300"
                            : p.priority === "Média"
                            ? "bg-orange-900 text-orange-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {p.priority}
                      </span>
                    </div>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === p.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all"
                        title="Salvar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition-all"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}