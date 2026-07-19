import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Scan", icon: "🔍" },
  { to: "/map", label: "Map", icon: "📍" },
  { to: "/history", label: "History", icon: "🕓" },
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
];

export default function Navbar() {
  const { isDemoMode, logOut, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  if (!isAuthenticated) return null;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
      isActive
        ? "bg-accent-light text-accent border border-accent"
        : "text-text-muted hover:text-text-primary hover:bg-bg-surface-hover border border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-bg-surface/95 backdrop-blur border-b border-border-color shadow-sm text-text-primary transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌳</span>
          <span className="font-condensed font-bold text-lg tracking-wide">
            EcoSprout <span className="text-accent">AI</span>
          </span>
          {isDemoMode && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-warn-light text-warn text-[10px] font-mono uppercase border border-warn">
              Demo Mode
            </span>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => setIsDark(!isDark)}
            className="ml-2 px-3 py-2 rounded-lg text-sm font-mono text-text-muted hover:text-accent border border-transparent hover:border-accent hover:bg-accent-light transition-colors"
            title="Toggle Dark Mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={logOut}
            className="ml-2 px-3 py-2 rounded-lg text-sm font-mono text-text-muted hover:text-danger border border-transparent hover:border-danger hover:bg-danger-light transition-colors"
          >
            Logout
          </button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-xl text-text-muted"
            title="Toggle Dark Mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            className="text-2xl text-text-muted"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 border-t border-border-color bg-bg-surface shadow-md">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
          <button
            onClick={logOut}
            className="text-left px-3 py-2 rounded-lg text-sm font-mono text-danger hover:bg-danger-light"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
