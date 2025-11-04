import Dexie from "dexie";
export const db = new Dexie("stellar_collab_db");
db.version(1).stores({
  users: "++id, name, email, password, role",
  projects: "++id, name, status, priority",
  tasks: "++id, title, projectId, status, priority"
});
export async function addSampleData() {
  const count = await db.projects.count();
  if (count === 0) {
    await db.projects.bulkAdd([
      { name: "Projeto A", status: "Em andamento", priority: "Alta" },
      { name: "Projeto B", status: "Concluído", priority: "Média" }
    ]);
  }
}