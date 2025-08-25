import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Dating app specific colors
        pink: {
          400: "hsl(350 100% 70%)",
          500: "hsl(346 87% 63%)",
          600: "hsl(340 85% 55%)",
        },
        red: {
          400: "hsl(356 75% 65%)",
          500: "hsl(356 90% 54%)",
          600: "hsl(356 85% 45%)",
        },
        purple: {
          400: "hsl(280 80% 70%)",
          500: "hsl(270 75% 60%)",
          600: "hsl(260 70% 50%)",
        },
        blue: {
          400: "hsl(210 90% 65%)",
          500: "hsl(195 100% 50%)",
          600: "hsl(185 95% 45%)",
        },
        orange: {
          400: "hsl(25 95% 65%)",
          500: "hsl(20 90% 60%)",
          600: "hsl(15 85% 55%)",
        },
        yellow: {
          400: "hsl(50 95% 65%)",
          500: "hsl(45 90% 60%)",
          600: "hsl(40 85% 55%)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        heartBeat: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "heart-beat": "heartBeat 0.6s ease-in-out",
        "fade-in": "fadeIn 0.5s ease-in",
      },
      backgroundImage: {
        "gradient-pink": "linear-gradient(135deg, hsl(350 100% 65%), hsl(335 90% 70%))",
        "gradient-purple": "linear-gradient(135deg, hsl(260 70% 60%), hsl(280 80% 70%))",
        "gradient-blue": "linear-gradient(135deg, hsl(195 100% 50%), hsl(210 90% 60%))",
        "gradient-orange": "linear-gradient(135deg, hsl(25 95% 65%), hsl(20 90% 60%))",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
