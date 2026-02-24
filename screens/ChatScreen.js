import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import * as Network from "expo-network";

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
import { humanizeConnectionType } from "../utils/chatUtils";
import styles from "../styles/chatScreenStyles";

export default function ChatScreen({ route }) {
  const currentUserId = route?.params?.currentUserId || "demo-user";
  const currentUserName = route?.params?.currentUserName || "You";
  const chatId = route?.params?.chatId || "internet__demo-user__friend";
  const participants = route?.params?.participants || [currentUserId, "friend"];
  const participantNames = route?.params?.participantNames || {
    [currentUserId]: currentUserName,
    friend: "Friend",
  };
  const chatTitle = route?.params?.chatTitle || "Group Chat";
  const connectionType = route?.params?.connectionType || "internet";

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const refreshAndValidateNetwork = async () => {
    const state = await Network.getNetworkStateAsync();

    if (connectionType === "bluetooth") {
      Alert.alert(
        "Bluetooth mode",
        "Bluetooth transport is not available in Expo Go for this app. Use a development build with a BLE transport service to enable cross-device Bluetooth chat."
      );
      return false;
    }

    if (connectionType === "wifi" && state.type !== Network.NetworkStateType.WIFI) {
      Alert.alert("Wi-Fi required", "Switch to Wi-Fi to send messages in Wi-Fi mode.");
      return false;
    }

    const online =
      state.isConnected &&
      state.type !== Network.NetworkStateType.NONE &&
      state.type !== Network.NetworkStateType.UNKNOWN;

    if (!online) {
      Alert.alert(
        "No network",
        "You appear offline. Connect to Wi-Fi or mobile internet and retry."
      );
      return false;
    }

    return true;
  };

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
      const canSend = await refreshAndValidateNetwork();

      if (!canSend) {
        return;
      }

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
          participants,
          participantNames,
          title: chatTitle,
          connectionType,
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
              {chatTitle.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.chatTitle} numberOfLines={1}>{chatTitle}</Text>
            <Text style={styles.chatSubtitle} numberOfLines={1}>
              {participants.length} participants · You: {currentUserName}
            </Text>
          </View>
          <View style={styles.modePill}>
            <Text style={styles.modePillText}>{humanizeConnectionType(connectionType)}</Text>
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
              senderName={item.senderName}
              showSender={participants.length > 2}
              isOwn={item.senderId === currentUserId}
            />
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            placeholderTextColor="#8494ab"
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