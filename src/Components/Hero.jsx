function Hero({ theme, onToggleTheme }) {
  return (
    <header className="w-full justify-center items-center flex flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <img src="/logo.png" className="w-36 object-contain" />
        {/* Theme toggle button */}
        <button
          onClick={onToggleTheme}
          className="ml-auto px-4 py-2 rounded border border-gray-300 text-sm font-medium bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>

      <h1 className="head_text">
        <span className="blue_gradient">Simplify</span>
        <span className={theme === "dark" ? "blue_gradient" : ""}>Your</span>
        <br className="max-md:hidden" />
        <span className={theme === "dark" ? "blue_gradient" : ""}>Reading with RapidRead</span>
      </h1>

      <h2 className="desc">
        Unlock a new level of efficiency and comprehension with RapidRead, your
        AI-powered article summarization tool. Spend less time reading and more
        time understanding, with summaries that capture the essence of the text
        in seconds
      </h2>
    </header>
  );
}

export default Hero;
