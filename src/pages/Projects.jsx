import React, { useEffect, useState } from "react";
import { db } from "../data/db.js";
export default function Projects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    db.projects.toArray().then(setProjects);
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-3">📁 Projetos</h2>
      {projects.length === 0 ? (
        <p className="text-neutral-400">Nenhum projeto cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map(p => (
            <li key={p.id} className="bg-neutral-800 p-3 rounded-lg border border-neutral-700">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-neutral-400">
                Status: {p.status} • Prioridade: {p.priority}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}