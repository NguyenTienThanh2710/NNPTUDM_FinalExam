import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
        "colors": {
            "on-tertiary": "#ffffff",
            "on-surface": "#1a1c1d",
            "tertiary": "#952200",
            "primary-fixed-dim": "#b7c4ff",
            "surface-container-lowest": "#ffffff",
            "on-error": "#ffffff",
            "on-primary-container": "#dfe3ff",
            "primary": "#003ec7",
            "inverse-primary": "#b7c4ff",
            "on-error-container": "#93000a",
            "background": "#f9f9fb",
            "outline-variant": "#c3c5d9",
            "on-primary": "#ffffff",
            "on-secondary-container": "#636264",
            "inverse-on-surface": "#f0f0f2",
            "surface-container": "#eeeef0",
            "on-surface-variant": "#434656",
            "on-secondary-fixed": "#1b1b1d",
            "outline": "#737688",
            "on-secondary-fixed-variant": "#474649",
            "on-tertiary-container": "#ffddd5",
            "surface": "#f9f9fb",
            "on-primary-fixed-variant": "#0038b6",
            "error": "#ba1a1a",
            "surface-variant": "#e2e2e4",
            "on-background": "#1a1c1d",
            "surface-container-high": "#e8e8ea",
            "secondary-container": "#e2dfe1",
            "on-tertiary-fixed-variant": "#891e00",
            "on-primary-fixed": "#001452",
            "inverse-surface": "#2f3132",
            "surface-tint": "#004ced",
            "secondary-fixed-dim": "#c8c6c8",
            "primary-container": "#0052ff",
            "tertiary-container": "#bf3003",
            "on-secondary": "#ffffff",
            "secondary": "#5f5e60",
            "surface-dim": "#d9dadc",
            "on-tertiary-fixed": "#3c0800",
            "tertiary-fixed-dim": "#ffb4a1",
            "secondary-fixed": "#e4e2e4",
            "surface-container-highest": "#e2e2e4",
            "tertiary-fixed": "#ffdbd2",
            "primary-fixed": "#dde1ff",
            "surface-bright": "#f9f9fb",
            "error-container": "#ffdad6",
            "surface-container-low": "#f3f3f5"
        },
        "borderRadius": {
            "DEFAULT": "0.125rem",
            "lg": "0.25rem",
            "xl": "0.5rem",
            "full": "0.75rem"
        },
        "fontFamily": {
            "headline": ["Inter", "sans-serif"],
            "body": ["Inter", "sans-serif"],
            "label": ["Inter", "sans-serif"]
        }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
