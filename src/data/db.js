// src/data/db.js
import Dexie from "dexie";

export const db = new Dexie("stellar_collab_db");
db.version(1).stores({
  users: "++id, name, email, password, role",
  projects: "++id, name, status, priority",
  tasks: "++id, title, projectId, status, priority",
});