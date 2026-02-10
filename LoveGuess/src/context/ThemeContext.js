import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultTheme } from "../theme/defaultTheme";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  // carregar tema salvo
  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const saved = await AsyncStorage.getItem("APP_THEME");

    if (saved) {
      setTheme(JSON.parse(saved));
    }
  }

  async function updateTheme(newTheme) {
    setTheme(newTheme);
    await AsyncStorage.setItem(
      "APP_THEME",
      JSON.stringify(newTheme)
    );
  }

  async function resetTheme() {
    setTheme(defaultTheme);
    await AsyncStorage.setItem("APP_THEME", JSON.stringify(defaultTheme));
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: updateTheme, resetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
