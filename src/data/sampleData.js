// src/data/sampleData.js
import { db } from "./db.js";
import CryptoJS from "crypto-js";

const ENCRYPTED_1234 =
  "U2FsdGVkX1+9k2vJ9i9e6k4s6r2s5t3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m";

async function seedUsers() {
  if ((await db.users.count()) > 0) return;

  await db.users.bulkAdd([
    {
      name: "Administrador",
      email: "admin@stellar.com",
      password: ENCRYPTED_1234,
      role: "admin",
    },
    {
      name: "Gerente Ana",
      email: "ana@stellar.com",
      password: ENCRYPTED_1234,
      role: "manager",
    },
    {
      name: "Usuário Carlos",
      email: "carlos@stellar.com",
      password: ENCRYPTED_1234,
      role: "user",
    },
  ]);
}

async function seedProjects() {
  if ((await db.projects.count()) > 0) return;
  await db.projects.bulkAdd([
    { name: "Site da Empresa", status: "Em andamento", priority: "Alta" },
    { name: "App Mobile", status: "Planejamento", priority: "Média" },
    { name: "Campanha de Marketing", status: "Concluído", priority: "Baixa" },
  ]);
}

async function seedTasks() {
  if ((await db.tasks.count()) > 0) return;
  const [siteId, appId] = await db.projects
    .where("name")
    .anyOf(["Site da Empresa", "App Mobile"])
    .primaryKeys();

  await db.tasks.bulkAdd([
    { title: "Criar wireframes", projectId: siteId, status: "Aberta", priority: "Alta" },
    { title: "Desenvolver API", projectId: appId, status: "Em andamento", priority: "Média" },
    { title: "Testes de usabilidade", projectId: siteId, status: "Concluída", priority: "Baixa" },
  ]);
}

export async function seedSampleData() {
  try {
    await seedUsers();
    await seedProjects();
    await seedTasks();
    console.info("Dados de exemplo carregados com sucesso");
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
  }
}