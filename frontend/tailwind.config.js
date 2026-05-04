/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        page: "#F7F6F3",
        card: "#FFFFFF",
        sidebar: "#1C1C1E",
        "sidebar-active": "#FFFFFF",
        "sidebar-inactive": "#A0A09C",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6B6B",
        "text-tertiary": "#A0A0A0",
        accent: "#2563EB",
        "accent-hover": "#1D4ED8",
        border: "#E4E4E0",
        danger: "#DC2626",
        "danger-hover": "#B91C1C",
        status: {
          "todo-bg": "#F0F0ED",
          "todo-text": "#5C5C58",
          "progress-bg": "#EBF0FF",
          "progress-text": "#1D3FAB",
          "done-bg": "#EDFAF3",
          "done-text": "#1A7A4A",
        },
        priority: {
          low: "#6B9B37",
          medium: "#C07B28",
          high: "#B93C3C",
        },
      },
      spacing: {
        sidebar: "240px",
        navbar: "56px",
      },
    },
  },
  plugins: [],
};
