import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import { db } from "../services/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import {
  normalizeUserId,
  parseParticipants,
  unique,
  buildChatId,
  humanizeConnectionType,
  getConnectionAccent,
} from "../utils/chatUtils";
import {
  normalizeConnectCode,
  generateConnectCode,
  getConnectCodeDetails,
} from "../services/connectCodeService";
import { runConnectionDiagnostics } from "../services/connectionDiagnosticsService";
import {
  CONNECTION_OPTIONS,
  DEFAULT_CONNECTION_TYPE,
  FIRESTORE_COLLECTIONS,
} from "../constants/appConstants";
import styles from "../styles/chatListStyles";

export default function ChatListScreen({ navigation }) {
  const [myName, setMyName] = useState("");
  const [participantsInput, setParticipantsInput] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const [connectionType, setConnectionType] = useState(DEFAULT_CONNECTION_TYPE);
  const [connectCodeInput, setConnectCodeInput] = useState("");
  const [myConnectCode, setMyConnectCode] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const currentUserId = normalizeUserId(myName);

    if (!currentUserId) {
      setRecentChats([]);
      return undefined;
    }

    const chatsQuery = query(
      collection(db, FIRESTORE_COLLECTIONS.CHATS),
      where("participants", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const chats = snapshot.docs
          .map((docItem) => {
            const data = docItem.data();
            const participantNames = data?.participantNames || {};
            const allParticipants = data?.participants || [];
            const otherParticipants = allParticipants.filter(
              (participantId) => participantId !== currentUserId
            );

            const otherNames = otherParticipants.map((participantId) => {
              return participantNames?.[participantId] || participantId;
            });

            return {
              id: docItem.id,
              chatId: docItem.id,
              title: data?.title || otherNames.join(", ") || "Untitled chat",
              participantCount: allParticipants.length,
              participants: allParticipants,
              participantNames,
              connectionType: data?.connectionType || DEFAULT_CONNECTION_TYPE,
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
    return !myName.trim() || !participantsInput.trim();
  }, [myName, participantsInput]);

  const openChat = () => {
    if (disabled) {
      Alert.alert("Missing details", "Enter your name and at least one participant.");
      return;
    }

    const currentUserId = normalizeUserId(myName);
    const parsedParticipants = parseParticipants(participantsInput);
    const participants = unique([currentUserId, ...parsedParticipants]);

    if (participants.length < 2) {
      Alert.alert(
        "Not enough people",
        "Add at least one other person. Separate names with commas."
      );
      return;
    }

    const participantNames = participants.reduce((accumulator, participantId) => {
      const isCurrentUser = participantId === currentUserId;

      return {
        ...accumulator,
        [participantId]: isCurrentUser ? myName.trim() : participantId,
      };
    }, {});

    const chatId = buildChatId(participants, connectionType);

    navigation.navigate("Chat", {
      chatId,
      currentUserId,
      currentUserName: myName.trim(),
      participants,
      participantNames,
      chatTitle: chatTitle.trim() || "Group Chat",
      connectionType,
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
      participants: item.participants,
      participantNames: item.participantNames,
      chatTitle: item.title,
      connectionType: item.connectionType,
    });
  };

  const handleGenerateConnectCode = async () => {
    const currentUserId = normalizeUserId(myName);
    const currentUserName = myName.trim();

    if (!currentUserId || !currentUserName) {
      Alert.alert("Add your name", "Enter your name before generating a connect code.");
      return;
    }

    try {
      const generatedCode = await generateConnectCode({
        currentUserId,
        currentUserName,
        preferredConnectionType: connectionType,
      });

      if (!generatedCode) {
        Alert.alert("Try again", "Could not create a unique code right now. Please retry.");
        return;
      }

      setMyConnectCode(generatedCode);
      Alert.alert("Code ready", `Share this code: ${generatedCode}`);
    } catch (error) {
      Alert.alert("Failed", "Could not generate code. Check your Firebase connection.");
      console.error("Generate connect code error:", error);
    }
  };

  const connectWithCode = async () => {
    const currentUserId = normalizeUserId(myName);
    const currentUserName = myName.trim();
    const code = normalizeConnectCode(connectCodeInput);

    if (!currentUserId || !currentUserName) {
      Alert.alert("Add your name", "Enter your name before using a code.");
      return;
    }

    if (!code) {
      Alert.alert("Enter code", "Paste or type a valid connect code.");
      return;
    }

    try {
      const codeData = await getConnectCodeDetails(code);

      if (!codeData) {
        Alert.alert("Invalid code", "Code not found. Ask your friend to generate a fresh code.");
        return;
      }

      const ownerUserId = codeData?.ownerUserId || "";
      const ownerUserName = codeData?.ownerUserName || "Friend";
      const mode = codeData?.preferredConnectionType || "internet";

      if (!ownerUserId) {
        Alert.alert("Invalid code", "This code is missing user details.");
        return;
      }

      if (ownerUserId === currentUserId) {
        Alert.alert("Your own code", "Use this code from another device to connect.");
        return;
      }

      const participants = unique([ownerUserId, currentUserId]);
      const chatId = buildChatId(participants, mode);

      navigation.navigate("Chat", {
        chatId,
        currentUserId,
        currentUserName,
        participants,
        participantNames: {
          [ownerUserId]: ownerUserName,
          [currentUserId]: currentUserName,
        },
        chatTitle: `${ownerUserName} + ${currentUserName}`,
        connectionType: mode,
      });
    } catch (error) {
      Alert.alert("Connect failed", "Unable to verify code. Check your internet and retry.");
      console.error("Connect with code error:", error);
    }
  };

  const runConnectionTest = async () => {
    const currentUserId = normalizeUserId(myName) || "anonymous-user";

    setIsTestingConnection(true);

    try {
      await runConnectionDiagnostics(currentUserId);

      Alert.alert("Connection test passed", "Firestore read/write is working on this device.");
    } catch (error) {
      Alert.alert(
        "Connection test failed",
        "Cannot reach Firestore. Check firebaseConfig keys, Firestore rules, and internet."
      );
      console.error("Connection test error:", error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Start a new chat</Text>
          <Text style={styles.subtitle}>Invite one or many people with comma-separated names.</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              value={myName}
              onChangeText={setMyName}
              placeholder="e.g. rohan"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Participants</Text>
            <TextInput
              value={participantsInput}
              onChangeText={setParticipantsInput}
              placeholder="e.g. ayaan, sara, alex"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Chat title (optional)</Text>
            <TextInput
              value={chatTitle}
              onChangeText={setChatTitle}
              placeholder="e.g. Team Room"
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

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Connection settings</Text>
            <Text style={styles.settingsSubtitle}>Choose mode and test device connectivity.</Text>

            <Text style={styles.label}>Connection mode</Text>
            <View style={styles.modeRow}>
              {CONNECTION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setConnectionType(option.id)}
                  style={[
                    styles.modeButton,
                    connectionType === option.id && styles.modeButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      connectionType === option.id && styles.modeButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.testButton, isTestingConnection && styles.testButtonDisabled]}
              onPress={runConnectionTest}
              disabled={isTestingConnection}
            >
              <Text style={styles.testButtonText}>
                {isTestingConnection ? "Testing..." : "Run Connection Test"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.connectCard}>
            <Text style={styles.connectTitle}>Connect with unique code</Text>
            <Text style={styles.connectSubtitle}>
              One person creates a code, the other person enters it.
            </Text>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleGenerateConnectCode}>
              <Text style={styles.secondaryButtonText}>Generate My Code</Text>
            </TouchableOpacity>

            {!!myConnectCode && (
              <View style={styles.codeBox}>
                <Text style={styles.codeLabel}>Your connect code</Text>
                <Text style={styles.codeValue}>{myConnectCode}</Text>
              </View>
            )}

            <Text style={styles.label}>Enter friend's code</Text>
            <TextInput
              value={connectCodeInput}
              onChangeText={(value) => setConnectCodeInput(normalizeConnectCode(value))}
              placeholder="e.g. A7K9Q2"
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
              maxLength={8}
              returnKeyType="done"
              onSubmitEditing={connectWithCode}
            />

            <Text style={styles.connectHint}>Press enter/done to connect with code.</Text>
          </View>

          {!!normalizeUserId(myName) && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent chats</Text>
              {recentChats.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyRecentText}>No recent chats yet.</Text>
                  <Text style={styles.emptyRecentSubtext}>Create your first room above.</Text>
                </View>
              ) : (
                <FlatList
                  data={recentChats}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.recentListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.recentItem}
                      onPress={() => openRecentChat(item)}
                    >
                      <View style={styles.recentTopRow}>
                        <View style={styles.recentAvatar}>
                          <Text style={styles.recentAvatarText}>
                            {item.title.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.recentTextWrap}>
                          <Text style={styles.recentName} numberOfLines={1}>{item.title}</Text>
                          <Text style={styles.recentMeta}>
                            {item.participantCount} participants
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.connectionBadge,
                            { backgroundColor: `${getConnectionAccent(item.connectionType)}22` },
                          ]}
                        >
                          <Text
                            style={[
                              styles.connectionBadgeText,
                              { color: getConnectionAccent(item.connectionType) },
                            ]}
                          >
                            {humanizeConnectionType(item.connectionType)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.recentMessage} numberOfLines={1}>
                        {item.lastMessageText || "Tap to continue chat"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}