import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatListScreen from "./screens/ChatListScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: "#25D366",
          background: "#FFFFFF",
          card: "#075E54",
          text: "#FFFFFF",
          border: "#E9EDEF",
          notification: "#25D366",
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#075E54" },
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "700", fontSize: 20 },
          headerShadowVisible: false,
          headerTintColor: "#FFFFFF",
          contentStyle: { backgroundColor: "#FFFFFF" },
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}