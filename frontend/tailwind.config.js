/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-app": "var(--bg-app)",
        "bg-surface": "var(--bg-surface)",
        "bg-surface-hover": "var(--bg-surface-hover)",
        "border-color": "var(--border-color)",
        "border-hover": "var(--border-hover)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "accent": "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-light": "var(--accent-light)",
        
        "danger": "var(--danger)",
        "danger-light": "var(--danger-light)",
        "warn": "var(--warn)",
        "warn-light": "var(--warn-light)",
        "info": "var(--info)",
        "info-light": "var(--info-light)",
      },
      fontFamily: {
        mono: ["'Space Mono'", "monospace"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        condensed: ["'Barlow Condensed'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
