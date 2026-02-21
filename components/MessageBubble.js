import React from "react";
import { View, Text, StyleSheet } from "react-native";

function formatTime(createdAt) {
  if (!createdAt) return "";

  let dateValue = createdAt;

  if (typeof createdAt?.toDate === "function") {
    dateValue = createdAt.toDate();
  }

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ text, createdAt, isOwn = false }) {
  const timeText = formatTime(createdAt);

  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.text, isOwn && styles.textOwn]}>{text}</Text>
        {!!timeText && (
          <Text style={[styles.time, isOwn && styles.timeOwn]}>{timeText}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  wrapperOwn: {
    alignItems: "flex-end",
  },
  wrapperOther: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  bubbleOwn: {
    backgroundColor: "#2d6cdf",
    borderColor: "#2d6cdf",
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#ffffff",
    borderColor: "#e3e7ef",
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    color: "#1f2430",
    lineHeight: 20,
  },
  textOwn: {
    color: "#ffffff",
  },
  time: {
    marginTop: 6,
    fontSize: 11,
    color: "#7a7f8a",
    alignSelf: "flex-end",
  },
  timeOwn: {
    color: "#dbe7ff",
  },
});