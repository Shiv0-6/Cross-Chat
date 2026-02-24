import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/messageBubbleStyles";

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

export default function MessageBubble({
  text,
  createdAt,
  senderName,
  showSender = false,
  isOwn = false,
}) {
  const timeText = formatTime(createdAt);

  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {showSender && !isOwn && !!senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text style={[styles.text, isOwn && styles.textOwn]}>{text}</Text>
        {!!timeText && (
          <Text style={[styles.time, isOwn && styles.timeOwn]}>{timeText}</Text>
        )}
      </View>
    </View>
  );
}