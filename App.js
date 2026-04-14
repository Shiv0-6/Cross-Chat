import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatListScreen from "./screens/ChatListScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

const Stack = createNativeStackNavigator();

function AppContent() {
  const { colors, isDark } = useContext(ThemeContext);

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primaryGreen,
          background: colors.backgroundColor,
          card: colors.headerBackground,
          text: colors.headerText,
          border: colors.borderColor,
          notification: colors.primaryGreen,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTitleStyle: {
            color: colors.headerText,
            fontWeight: "700",
            fontSize: 20,
          },
          headerShadowVisible: false,
          headerTintColor: colors.headerText,
          contentStyle: { backgroundColor: colors.backgroundColor },
        }}
      >
        <Stack.Screen
          name="Chats"
          component={ChatListScreen}
          options={{
            title: "Cross-Chat",
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}