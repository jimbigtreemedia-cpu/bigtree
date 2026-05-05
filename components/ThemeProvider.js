import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const initialState = {
    theme: "light",
    setTheme: () => null
};
const ThemeProviderContext = createContext(initialState);
export function ThemeProvider({ children, defaultTheme = "light", storageKey = "snapiums-theme" }) {
    const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);
    return (_jsx(ThemeProviderContext.Provider, { value: { theme, setTheme }, children: children }));
}
export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
