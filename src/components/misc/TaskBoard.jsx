// src/components/TaskBoard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../data/db.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Trash2 } from "lucide-react";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  const loadTasks = async () => {
    const data = await db.tasks.toArray();
    setTasks(data);
  };

  useEffect(() => { if (user) loadTasks(); }, [user]);

  const addTask = async () => {
    if (!title.trim()) return;
    await db.tasks.add({ title: title.trim(), status: "Aberta", priority: "Normal" });
    setTitle("");
    loadTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Excluir esta tarefa?")) return;
    await db.tasks.delete(id);
    loadTasks();
  };

  if (!user) return null;

  return (
    <div className="bg-neutral-800 p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Tarefas</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded bg-neutral-900 border border-neutral-700 text-sm"
          placeholder="Nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white text-sm">
          Adicionar
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.length === 0 ? (
          <li className="text-neutral-500 italic text-sm text-center py-4">Nenhuma tarefa</li>
        ) : (
          tasks.map(t => (
            <li key={t.id} className="flex justify-between items-center bg-neutral-900 p-3 rounded border border-neutral-700">
              <div>
                <span className="font-medium">{t.title}</span>
                <span className="ml-2 text-xs text-neutral-400">[{t.status} • {t.priority}]</span>
              </div>
              <button onClick={() => deleteTask(t.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}