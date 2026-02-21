import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  FlatList,
} from "react-native";
import { db } from "../services/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

function normalizeUserId(value) {
  return value.trim().toLowerCase();
}

function buildChatId(userA, userB) {
  return [normalizeUserId(userA), normalizeUserId(userB)].sort().join("__");
}

export default function ChatListScreen({ navigation }) {
  const [myName, setMyName] = useState("");
  const [friendName, setFriendName] = useState("");
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const currentUserId = normalizeUserId(myName);

    if (!currentUserId) {
      setRecentChats([]);
      return undefined;
    }

    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const chats = snapshot.docs
          .map((docItem) => {
            const data = docItem.data();
            const participantNames = data?.participantNames || {};
            const otherUserId = (data?.participants || []).find(
              (participantId) => participantId !== currentUserId
            );

            return {
              id: docItem.id,
              chatId: docItem.id,
              otherUserId: otherUserId || "",
              otherUserName:
                participantNames?.[otherUserId] || otherUserId || "Unknown",
              updatedAt: data?.updatedAt,
              lastMessageText: data?.lastMessageText || "",
            };
          })
          .sort((a, b) => {
            const aTime = a.updatedAt?.toDate?.()?.getTime?.() || 0;
            const bTime = b.updatedAt?.toDate?.()?.getTime?.() || 0;
            return bTime - aTime;
          });

        setRecentChats(chats);
      },
      (error) => {
        console.error("Recent chats listener error:", error);
      }
    );

    return unsubscribe;
  }, [myName]);

  const disabled = useMemo(() => {
    return !myName.trim() || !friendName.trim();
  }, [myName, friendName]);

  const openChat = () => {
    if (disabled) {
      Alert.alert("Missing names", "Enter both names to start chatting.");
      return;
    }

    if (normalizeUserId(myName) === normalizeUserId(friendName)) {
      Alert.alert("Invalid users", "Use two different names for a 1-to-1 chat.");
      return;
    }

    const chatId = buildChatId(myName, friendName);

    navigation.navigate("Chat", {
      chatId,
      currentUserId: normalizeUserId(myName),
      currentUserName: myName.trim(),
      otherUserId: normalizeUserId(friendName),
      otherUserName: friendName.trim(),
    });
  };

  const openRecentChat = (item) => {
    const currentUserId = normalizeUserId(myName);
    const currentUserName = myName.trim();

    if (!currentUserId || !currentUserName) {
      Alert.alert("Add your name", "Enter your name to open recent chats.");
      return;
    }

    navigation.navigate("Chat", {
      chatId: item.chatId,
      currentUserId,
      currentUserName,
      otherUserId: item.otherUserId,
      otherUserName: item.otherUserName,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Start a 1-to-1 chat</Text>
        <Text style={styles.subtitle}>Use the same two names on both phones.</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            value={myName}
            onChangeText={setMyName}
            placeholder="e.g. rohan"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Friend name</Text>
          <TextInput
            value={friendName}
            onChangeText={setFriendName}
            placeholder="e.g. ayaan"
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={openChat}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Open Chat</Text>
          </TouchableOpacity>
        </View>

        {!!normalizeUserId(myName) && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent chats</Text>
            {recentChats.length === 0 ? (
              <Text style={styles.emptyRecentText}>No recent chats yet.</Text>
            ) : (
              <FlatList
                data={recentChats}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.recentListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recentItem}
                    onPress={() => openRecentChat(item)}
                  >
                    <Text style={styles.recentName}>{item.otherUserName}</Text>
                    <Text style={styles.recentMessage} numberOfLines={1}>
                      {item.lastMessageText || "Tap to continue chat"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>
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
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2430",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: "#6a7180",
    fontSize: 14,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e3e7ef",
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 13,
    color: "#4e5563",
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe1ec",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1f2430",
    marginBottom: 10,
  },
  button: {
    marginTop: 6,
    backgroundColor: "#2d6cdf",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: "#9db7ea",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  recentSection: {
    marginTop: 18,
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2430",
    marginBottom: 10,
  },
  emptyRecentText: {
    color: "#7a7f8a",
    fontSize: 13,
  },
  recentListContent: {
    paddingBottom: 12,
  },
  recentItem: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e3e7ef",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  recentName: {
    color: "#1f2430",
    fontWeight: "600",
    fontSize: 14,
  },
  recentMessage: {
    color: "#6a7180",
    marginTop: 3,
    fontSize: 13,
  },
});