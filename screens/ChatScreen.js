import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

import { db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

import MessageBubble from "../components/MessageBubble";

export default function ChatScreen({ route }) {
  const currentUserId = route?.params?.currentUserId || "demo-user";
  const currentUserName = route?.params?.currentUserName || "You";
  const otherUserId = route?.params?.otherUserId || "friend";
  const otherUserName = route?.params?.otherUserName || "Friend";
  const chatId = route?.params?.chatId || "demo-user__friend";

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      },
      (error) => {
        Alert.alert(
          "Connection Error",
          "Unable to connect to Firestore. Check Firebase config, Firestore rules, and internet connection."
        );
        console.error("Firestore listener error:", error);
      }
    );

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const textToSend = message.trim();

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: textToSend,
        senderId: currentUserId,
        senderName: currentUserName,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "chats", chatId),
        {
          participants: [currentUserId, otherUserId],
          participantNames: {
            [currentUserId]: currentUserName,
            [otherUserId]: otherUserName,
          },
          lastMessageText: textToSend,
          lastMessageSenderId: currentUserId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("");
    } catch (error) {
      Alert.alert(
        "Send Failed",
        "Message could not be sent. Verify Firebase setup and internet connection."
      );
      console.error("Send message error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherUserName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.chatTitle}>{otherUserName}</Text>
            <Text style={styles.chatSubtitle}>You: {currentUserName}</Text>
          </View>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet. Start the chat.</Text>
          }
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              createdAt={item.createdAt}
              isOwn={item.senderId === currentUserId}
            />
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            style={styles.input}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#f5f7fb",
  },
  listContent: {
    paddingBottom: 10,
    paddingTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e3e7ef",
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2d6cdf",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  chatTitle: {
    fontSize: 16,
    color: "#1f2430",
    fontWeight: "600",
  },
  chatSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6a7180",
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#7a7f8a",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e3e7ef",
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#20242c",
  },
  sendButton: {
    backgroundColor: "#2d6cdf",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#9db7ea",
  },
  sendText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});