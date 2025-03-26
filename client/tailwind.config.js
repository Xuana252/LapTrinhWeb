/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        primary: "rgba(var(--primary))",
        'primary-variant': "rgba(var(--primary-variant))",
        secondary: "rgba(var(--secondary))",
        'secondary-variant': "rgba(var(--secondary-variant))",
        surface: "rgba(var(--surface))",
        error: "rgba(var(--error))",
        'on-primary': "rgba(var(--on-primary))",
        'on-secondary': "rgba(var(--on-secondary))",
        'on-background': "rgba(var(--on-background))",
        'on-surface': "rgba(var(--on-surface))",
        'on-error': "rgba(var(--on-error))",
      },
    },
  },
  plugins: [],
};
