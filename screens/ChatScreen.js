import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
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
import NetInfo from "@react-native-community/netinfo";

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
  increment,
} from "firebase/firestore";

import MessageBubble from "../components/MessageBubble";
import { humanizeConnectionType } from "../utils/chatUtils";
import {
  DEFAULT_CONNECTION_TYPE,
  FIRESTORE_COLLECTIONS,
} from "../constants/appConstants";
import styles from "../styles/chatScreenStyles";

export default function ChatScreen({ route, navigation }) {
  const currentUserId = route?.params?.currentUserId || "demo-user";
  const currentUserName = route?.params?.currentUserName || "You";
  const chatId =
    route?.params?.chatId || `${DEFAULT_CONNECTION_TYPE}__demo-user__friend`;
  const participants = route?.params?.participants || [currentUserId, "friend"];
  const participantNames = route?.params?.participantNames || {
    [currentUserId]: currentUserName,
    friend: "Friend",
  };
  const chatTitle = route?.params?.chatTitle || "Group Chat";
  const connectionType = route?.params?.connectionType || DEFAULT_CONNECTION_TYPE;

  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState(null);
  const [message, setMessage] = useState("");
  const listRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const isFirstLoadRef = useRef(true);

  const chatDocRef = useMemo(
    () => doc(db, FIRESTORE_COLLECTIONS.CHATS, chatId),
    [chatId]
  );

  const markChatAsSeen = useCallback(async () => {
    try {
      await setDoc(
        chatDocRef,
        {
          [`lastSeenBy.${currentUserId}`]: serverTimestamp(),
          [`unreadBy.${currentUserId}`]: 0,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Mark seen error:", error);
    }
  }, [chatDocRef, currentUserId]);

  const refreshAndValidateNetwork = async () => {
    const state = await NetInfo.fetch();

    if (connectionType === "bluetooth") {
      Alert.alert(
        "Bluetooth mode",
        "Bluetooth transport is not implemented yet in this app. Add a BLE transport service (for example react-native-ble-plx) to enable cross-device Bluetooth chat."
      );
      return false;
    }

    if (connectionType === "wifi" && state.type !== "wifi") {
      Alert.alert("Wi-Fi required", "Switch to Wi-Fi to send messages in Wi-Fi mode.");
      return false;
    }

    const online = Boolean(state.isConnected) && state.isInternetReachable !== false;

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
    const unsubscribeMeta = onSnapshot(
      chatDocRef,
      (snapshot) => {
        setChatMeta(snapshot.data() || null);
      },
      (error) => {
        console.error("Chat meta listener error:", error);
      }
    );

    return unsubscribeMeta;
  }, [chatDocRef]);

  useEffect(() => {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.CHATS, chatId, "messages"),
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
        markChatAsSeen();
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
  }, [chatId, markChatAsSeen]);

  const getTimestampMillis = (value) => {
    if (!value) return 0;
    if (typeof value?.toDate === "function") {
      return value.toDate().getTime();
    }
    const date = value instanceof Date ? value : new Date(value);
    const millis = date.getTime();
    return Number.isNaN(millis) ? 0 : millis;
  };

  const toDateKey = (value) => {
    const millis = getTimestampMillis(value);
    if (!millis) return "unknown";
    const date = new Date(millis);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (value) => {
    const millis = getTimestampMillis(value);
    if (!millis) return "Today";
    const date = new Date(millis);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const readByAllOthers = (messageCreatedAt) => {
    const messageTime = getTimestampMillis(messageCreatedAt);
    if (!messageTime || !chatMeta?.lastSeenBy) return false;

    const others = participants.filter((participantId) => participantId !== currentUserId);
    if (others.length === 0) return false;

    return others.every((participantId) => {
      const seenAt = chatMeta.lastSeenBy?.[participantId];
      return getTimestampMillis(seenAt) >= messageTime;
    });
  };

  const messageRows = useMemo(() => {
    const rows = [];
    let lastDateKey = "";

    messages.forEach((item) => {
      const dateKey = toDateKey(item.createdAt);

      if (dateKey !== lastDateKey) {
        rows.push({
          id: `date-${dateKey}`,
          type: "date",
          label: formatDateLabel(item.createdAt),
        });
        lastDateKey = dateKey;
      }

      const isOwn = item.senderId === currentUserId;
      let tickStatus = "";

      if (isOwn) {
        tickStatus = item.createdAt
          ? readByAllOthers(item.createdAt)
            ? "read"
            : "delivered"
          : "sent";
      }

      rows.push({
        ...item,
        type: "message",
        tickStatus,
      });
    });

    return rows;
  }, [messages, currentUserId, chatMeta, participants]);

  const scrollToLatest = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd?.({ animated });
    });
  }, []);

  const handleListScroll = useCallback((event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    isNearBottomRef.current = distanceFromBottom < 80;
  }, []);

  const lastMessageIsOwn = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.senderId === currentUserId;
  }, [messages, currentUserId]);

  useEffect(() => {
    if (messageRows.length === 0) return;

    if (isFirstLoadRef.current) {
      scrollToLatest(false);
      isFirstLoadRef.current = false;
      return;
    }

    if (isNearBottomRef.current || lastMessageIsOwn) {
      scrollToLatest(true);
    }
  }, [messages.length, messageRows.length, lastMessageIsOwn, scrollToLatest]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const canSend = await refreshAndValidateNetwork();

      if (!canSend) {
        return;
      }

      const textToSend = message.trim();

      await addDoc(collection(db, FIRESTORE_COLLECTIONS.CHATS, chatId, "messages"), {
        text: textToSend,
        senderId: currentUserId,
        senderName: currentUserName,
        createdAt: serverTimestamp(),
      });

      const unreadUpdates = {
        [`unreadBy.${currentUserId}`]: 0,
        [`lastSeenBy.${currentUserId}`]: serverTimestamp(),
      };

      participants
        .filter((participantId) => participantId !== currentUserId)
        .forEach((participantId) => {
          unreadUpdates[`unreadBy.${participantId}`] = increment(1);
        });

      await setDoc(
        chatDocRef,
        {
          participants,
          participantNames,
          title: chatTitle,
          connectionType,
          lastMessageText: textToSend,
          lastMessageSenderId: currentUserId,
          lastMessageCreatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...unreadUpdates,
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
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{chatTitle.charAt(0).toUpperCase()}</Text>
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
          ref={listRef}
          data={messageRows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            messageRows.length === 0 && styles.emptyListContent,
          ]}
          onContentSizeChange={() => {
            if (isNearBottomRef.current) {
              scrollToLatest(false);
            }
          }}
          onScroll={handleListScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet. Start the chat.</Text>
          }
          renderItem={({ item }) => {
            if (item.type === "date") {
              return (
                <View style={styles.dateSeparatorWrap}>
                  <Text style={styles.dateSeparatorText}>{item.label}</Text>
                </View>
              );
            }

            return (
              <MessageBubble
                text={item.text}
                createdAt={item.createdAt}
                senderName={item.senderName}
                showSender={participants.length > 2}
                isOwn={item.senderId === currentUserId}
                tickStatus={item.tickStatus}
              />
            );
          }}
        />

        <View style={styles.inputBarWrap}>
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message"
              placeholderTextColor="#9E9E9E"
              style={styles.input}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendText}>▶</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}