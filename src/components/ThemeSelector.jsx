import React, { useState } from "react";
export default function ThemeSelector({ darkMode, setDarkMode }) {
  const [color, setColor] = useState("blue");
  const colors = ["blue", "purple", "green", "orange"];
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-3 py-1 border border-neutral-600 rounded"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
      {colors.map(c => (
        <button
          key={c}
          onClick={() => setColor(c)}
          className={`w-5 h-5 rounded-full bg-${c}-500`}
          title={c}
        />
      ))}
    </div>
  );
}