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
          primary: "#2d6cdf",
          background: "#eef3fb",
          card: "#ffffff",
          text: "#1f2430",
          border: "#dce6f4",
          notification: "#2d6cdf",
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            color: "#1f2430",
            fontWeight: "700",
          },
          headerShadowVisible: false,
          headerTintColor: "#1f2430",
          contentStyle: {
            backgroundColor: "#eef3fb",
          },
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
          options={{
            title: "Conversation",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}