import React, { createContext, useContext, useEffect, useState } from "react";
import { predefinedThemes } from "../styles/theme";

const ThemeContext = createContext();
function safeJSONParse(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Couldn’t parse "${key}" from localStorage:`, err);
    return fallback;
  }
}

export const ThemeProvider = ({ children }) => {
  const [themes] = useState(() => {
    const parsed = safeJSONParse("themes", []);
    return Array.isArray(parsed) && parsed.length 
      ? parsed 
      : predefinedThemes;
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return safeJSONParse("selectedTheme", themes[0]);
  });

  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Toggle dark mode class for Tailwind
    if (theme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Inject any custom CSS variables from the theme definition
    if (theme.colors) {
      for (let key in theme.colors) {
        root.style.setProperty(`--color-${key}`, theme.colors[key]);
      }
    }
    
    localStorage.setItem("selectedTheme", JSON.stringify(theme));
  };

  const value = {
    themes,
    selectedTheme,
    setSelectedTheme,
    applyTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
