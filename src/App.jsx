import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ThemeSelector from "./components/ThemeSelector.jsx";
import { seedSampleData } from "./data/sampleData.js"; // <-- IMPORTANTE

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Aplica o tema e popula o banco na primeira visita
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    seedSampleData(); // <-- SEM ESSA LINHA, NÃO TERÁ DADOS!
  }, [darkMode]);

  return (
    <AuthProvider>
      <div
        className={`min-h-screen transition-colors duration-500 ${
          darkMode
            ? "bg-neutral-900 text-neutral-100"
            : "bg-neutral-100 text-neutral-900"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h1 className="text-xl font-bold">Stellar Collab</h1>
          <ThemeSelector darkMode={darkMode} setDarkMode={setDarkMode} />
        </header>

        {/* Main Content */}
        <main className="p-4">
          <LoginForm />
          <Dashboard />
        </main>
      </div>
    </AuthProvider>
  );
}