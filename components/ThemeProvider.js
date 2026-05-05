import { jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useState } from "react";
const initialState = {
  theme: "light",
  setTheme: () => null
};
const ThemeProviderContext = createContext(initialState);
function ThemeProvider({ children, defaultTheme = "light", storageKey = "snapiums-theme" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);
  return /* @__PURE__ */ jsx(ThemeProviderContext.Provider, { value: { theme, setTheme }, children });
}
const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === void 0)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
export {
  ThemeProvider,
  useTheme
};
