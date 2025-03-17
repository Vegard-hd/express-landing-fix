/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        clifford: "#da373d",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        nord: {
          "color-scheme": "light",
          "base-100": "oklch(95.127% 0.007 260.731)",
          "base-200": "oklch(93.299% 0.01 261.788)",
          "base-300": "oklch(89.925% 0.016 262.749)",
          "base-content": "oklch(32.437% 0.022 264.182)",
          "primary": "oklch(59.435% 0.077 254.027)",
          "primary-content": "oklch(11.887% 0.015 254.027)",
          "secondary": "oklch(69.651% 0.059 248.687)",
          "secondary-content": "oklch(13.93% 0.011 248.687)",
          "accent": "oklch(77.464% 0.062 217.469)",
          "accent-content": "oklch(15.492% 0.012 217.469)",
          "neutral": "oklch(45.229% 0.035 264.131)",
          "neutral-content": "oklch(89.925% 0.016 262.749)",
          "info": "oklch(69.207% 0.062 332.664)",
          "info-content": "oklch(13.841% 0.012 332.664)",
          "success": "oklch(76.827% 0.074 131.063)",
          "success-content": "oklch(15.365% 0.014 131.063)",
          "warning": "oklch(85.486% 0.089 84.093)",
          "warning-content": "oklch(17.097% 0.017 84.093)",
          "error": "oklch(60.61% 0.12 15.341)",
          "error-content": "oklch(12.122% 0.024 15.341)",
          "--radius-selector": "0.25rem",
          "--radius-field": "0.25rem",
          "--radius-box": "0.25rem",
          "--size-selector": "0.25rem",
          "--size-field": "0.25rem",
          "--border": "1.5px",
          "--depth": "1",
          "--noise": "0",
        },
      },
    ],
    defaultTheme: "nord",
    darkTheme: false,
  },
};
