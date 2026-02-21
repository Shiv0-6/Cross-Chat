import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ChatListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat List Screen</Text>

      <Button
        title="Open Chat"
        onPress={() => navigation.navigate("Chat")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});