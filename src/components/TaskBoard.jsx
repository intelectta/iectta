// src/components/TaskBoard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../data/db.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Trash2, Check, X, FolderOpen, CheckCircle2 } from "lucide-react";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Aberta");
  const [priority, setPriority] = useState("Normal");
  const [projectId, setProjectId] = useState("");
  const [filterProjectId, setFilterProjectId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const { user } = useAuth();

  const loadData = async () => {
    const [taskData, projectData] = await Promise.all([
      db.tasks.toArray(),
      db.projects.toArray(),
    ]);
    setTasks(taskData);
    setProjects(projectData);
    if (projectData.length > 0 && !projectId) {
      setProjectId(projectData[0].id);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const addTask = async () => {
    if (!title.trim() || !projectId) return;
    await db.tasks.add({
      title: title.trim(),
      status,
      priority,
      projectId: Number(projectId),
    });
    setTitle("");
    setStatus("Aberta");
    setPriority("Normal");
    loadData();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Excluir esta tarefa?")) return;
    await db.tasks.delete(id);
    loadData();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditProjectId(task.projectId?.toString() || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditStatus("");
    setEditPriority("");
    setEditProjectId("");
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editProjectId) return;
    await db.tasks.update(editingId, {
      title: editTitle.trim(),
      status: editStatus,
      priority: editPriority,
      projectId: Number(editProjectId),
    });
    cancelEdit();
    loadData();
  };

  const getProjectName = (id) => {
    const p = projects.find(p => p.id === id);
    return p ? p.name : "Sem projeto";
  };

  const filteredTasks = filterProjectId
    ? tasks.filter(t => t.projectId === Number(filterProjectId))
    : tasks;

  if (!user) return null;

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="text-blue-500" size={28} />
          Tarefas
        </h2>

        {/* FILTRO POR PROJETO */}
        <select
          className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={filterProjectId}
          onChange={(e) => setFilterProjectId(e.target.value)}
        >
          <option value="">Todas as tarefas</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* FORMULÁRIO DE NOVA TAREFA */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
        <input
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <select
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Aberta">Aberta</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluída">Concluída</option>
        </select>
        <select
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Alta">Alta</option>
          <option value="Normal">Normal</option>
          <option value="Baixa">Baixa</option>
        </select>
        <select
          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Selecione projeto</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          + Adicionar
        </button>
      </div>

      {/* LISTA DE TAREFAS COM CARD MODERNO */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <div className="bg-neutral-800 rounded-xl p-8 border border-dashed border-neutral-700">
              <p className="text-lg italic">
                {filterProjectId ? "Nenhuma tarefa neste projeto." : "Nenhuma tarefa cadastrada ainda."}
              </p>
            </div>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className="group bg-gradient-to-br from-neutral-800 to-neutral-850 p-5 rounded-xl border border-neutral-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                {editingId === t.id ? (
                  /* MODO EDIÇÃO */
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                    />
                    <select
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="Aberta">Aberta</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluída">Concluída</option>
                    </select>
                    <select
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="Alta">Alta</option>
                      <option value="Normal">Normal</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                    <select
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editProjectId}
                      onChange={(e) => setEditProjectId(e.target.value)}
                    >
                      <option value="">Sem projeto</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* MODO VISUALIZAÇÃO */
                  <div
                    className="flex-1 cursor-pointer pr-4"
                    onClick={() => startEdit(t)}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {t.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* PROJETO */}
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-900 text-blue-300 text-xs font-medium">
                        <FolderOpen size={12} />
                        {getProjectName(t.projectId)}
                      </span>
                      {/* STATUS */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          t.status === "Concluída"
                            ? "bg-green-900 text-green-300"
                            : t.status === "Em andamento"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-indigo-900 text-indigo-300"
                        }`}
                      >
                        {t.status}
                      </span>
                      {/* PRIORIDADE */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          t.priority === "Alta"
                            ? "bg-red-900 text-red-300"
                            : t.priority === "Normal"
                            ? "bg-orange-900 text-orange-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === t.id ? (
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
                      onClick={() => deleteTask(t.id)}
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