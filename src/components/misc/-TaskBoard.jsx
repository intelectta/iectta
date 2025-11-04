import React, { useEffect, useState } from "react";
import { db } from "../data/db.js";
export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const load = async () => setTasks(await db.tasks.toArray());
  useEffect(() => { load(); }, []);
  const add = async () => {
    if (!title) return;
    await db.tasks.add({ title, status: "Aberta", priority: "Normal" });
    setTitle(""); load();
  };
  return (
    <div className="bg-neutral-800 p-4 rounded-xl">
      <div className="flex mb-2">
        <input
          className="flex-1 mr-2 p-2 rounded bg-neutral-900 border border-neutral-700"
          placeholder="Nova tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={add} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">
          +
        </button>
      </div>
      <ul>
        {tasks.map(t => (
          <li key={t.id} className="border-b border-neutral-700 py-1">
            {t.title} — <span className="text-xs text-neutral-400">{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}