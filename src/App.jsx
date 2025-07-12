import "./App.css";

import { useEffect, useState } from "react";
import Hero from "./Components/Hero";
import Demo from "./Components/Demo";

function App() {
  // Theme state and effect
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white  duration-300">
      <div className="main">
        <div className="gradient"></div>
      </div>

      <div className="app">
        <Hero theme={theme} onToggleTheme={handleToggleTheme} />
        <Demo />
      </div>
    </main>
  );
}

export default App;
