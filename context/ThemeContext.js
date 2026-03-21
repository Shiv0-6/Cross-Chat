import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const lightColors = {
  // Background
  backgroundColor: "#FFFFFF",
  surfaceColor: "#F5F5F5",
  cardBackground: "#FFFFFF",

  // Text
  textPrimary: "#111111",
  textSecondary: "#667781",
  textTertiary: "#A9ADAF",

  // Header
  headerBackground: "#075E54",
  headerText: "#FFFFFF",

  // Bubbles
  sentBubbleBackground: "#DCF8C6",
  receivedBubbleBackground: "#FFFFFF",
  messageBubbleText: "#111111",

  // UI Elements
  borderColor: "#E9EDEF",
  buttonBackground: "#F0F2F5",
  buttonText: "#075E54",
  primaryGreen: "#25D366",
  darkGreen: "#128C7E",
  lightGreen: "#E8F9F1",
  lightGreenBorder: "#BDEFD0",

  // Status
  tickDelivered: "#667781",
  tickRead: "#34B7F1",
  successText: "#31A24C",
  errorText: "#D32F2F",
  dateTextColor: "#667781",
  dateBackgroundColor: "#FFFFFF",

  // Connection/Status
  connectionBackground: "#E8F9F1",
  connectionBorder: "#BDEFD0",
  connectionText: "#075E54",
  connectionSubtext: "#128C7E",

  // Menu
  menuBackground: "#FFFFFF",
  menuItemText: "#111111",
  menuBorder: "#E9EDEF",
};

export const darkColors = {
  // Background
  backgroundColor: "#0A0E27",
  surfaceColor: "#111928",
  cardBackground: "#1F2937",

  // Text
  textPrimary: "#E5E7EB",
  textSecondary: "#9CA3AF",
  textTertiary: "#6B7280",

  // Header
  headerBackground: "#065F46",
  headerText: "#E5E7EB",

  // Bubbles
  sentBubbleBackground: "#166534",
  receivedBubbleBackground: "#1F2937",
  messageBubbleText: "#E5E7EB",

  // UI Elements
  borderColor: "#374151",
  buttonBackground: "#1F2937",
  buttonText: "#34D399",
  primaryGreen: "#10B981",
  darkGreen: "#059669",
  lightGreen: "#064E3B",
  lightGreenBorder: "#047857",

  // Status
  tickDelivered: "#9CA3AF",
  tickRead: "#60A5FA",
  successText: "#34D399",
  errorText: "#F87171",
  dateTextColor: "#9CA3AF",
  dateBackgroundColor: "#111928",

  // Connection/Status
  connectionBackground: "#064E3B",
  connectionBorder: "#047857",
  connectionText: "#D1FAE5",
  connectionSubtext: "#A7F3D0",

  // Menu
  menuBackground: "#1F2937",
  menuItemText: "#E5E7EB",
  menuBorder: "#374151",
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("@app_theme");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Error loading theme preference:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem("@app_theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.log("Error saving theme preference:", error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
