import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MessageBubble({ text }) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: "#e5e5ea",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
  },
});