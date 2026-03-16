import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from "react";
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
import Clipboard from "@react-native-clipboard/clipboard";
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
  const [showConnectionPanel, setShowConnectionPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAdvancedChat, setShowAdvancedChat] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [quickStatusText, setQuickStatusText] = useState("");
  const [quickStatusType, setQuickStatusType] = useState("success");
  const [recentChats, setRecentChats] = useState([]);
  const connectCodeInputRef = useRef(null);

  const resetDraftFields = () => {
    setParticipantsInput("");
    setChatTitle("");
    setConnectCodeInput("");
    setMyConnectCode("");
    setShowAdvancedChat(false);
    setShowComposer(false);
    setQuickStatusText("");
    Alert.alert("Reset", "Draft chat fields were cleared.");
  };

  const openSettings = () => {
    Alert.alert("Settings", "More settings features can be added here.");
  };

  const openMoreFeatures = () => {
    Alert.alert("More features", "You can add more options in this 3-dots menu panel.");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => {
              setShowConnectionPanel((prev) => !prev);
              setShowSettingsPanel(false);
            }}
            style={styles.headerActionButton}
          >
            <Text style={styles.headerActionText}>📶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowSettingsPanel((prev) => !prev);
              setShowConnectionPanel(false);
            }}
            style={styles.headerActionButton}
          >
            <Text style={styles.headerActionText}>⋮</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

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
              lastMessageCreatedAt: data?.lastMessageCreatedAt,
              lastMessageSenderId: data?.lastMessageSenderId || "",
              unreadBy: data?.unreadBy || {},
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
      setConnectCodeInput("");
      requestAnimationFrame(() => {
        connectCodeInputRef.current?.focus?.();
      });
      setQuickStatusType("success");
      setQuickStatusText("Code generated. Share it and ask your friend to enter it.");
    } catch (error) {
      Alert.alert("Failed", "Could not generate code. Check your Firebase connection.");
      console.error("Generate connect code error:", error);
    }
  };

  const copyConnectCode = async () => {
    if (!myConnectCode) {
      setQuickStatusType("error");
      setQuickStatusText("Generate a code first, then tap Copy.");
      return;
    }

    Clipboard.setString(myConnectCode);
    setQuickStatusType("success");
    setQuickStatusText("Code copied. Share it with your friend.");
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
        chatTitle: ownerUserName + " + " + currentUserName,
        connectionType: mode,
      });
      setQuickStatusType("success");
      setQuickStatusText("Connected successfully. Opening chat...");
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showSettingsPanel && (
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelTitle}>More options</Text>
              <Text style={styles.settingsPanelSubtitle}>
                Settings and extra features.
              </Text>
              <TouchableOpacity style={styles.settingsActionButton} onPress={openSettings}>
                <Text style={styles.settingsActionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsActionButton} onPress={resetDraftFields}>
                <Text style={styles.settingsActionText}>Clear draft fields</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsActionButton} onPress={openMoreFeatures}>
                <Text style={styles.settingsActionText}>More features</Text>
              </TouchableOpacity>
            </View>
          )}

          {showConnectionPanel && (
            <View style={styles.connectionPanel}>
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
          )}

          {/* RECENT CHATS — WhatsApp-style primary list */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>RECENT CHATS</Text>
          </View>
          {recentChats.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyRecentText}>No chats yet</Text>
              <Text style={styles.emptyRecentSubtext}>Tap + to start a quick or new chat.</Text>
            </View>
          ) : (
            <FlatList
              data={recentChats}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.recentListContent}
              renderItem={({ item }) => {
                const timeSource = item.lastMessageCreatedAt || item.updatedAt;
                const time = timeSource?.toDate?.()
                  ? timeSource.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";
                const unreadCount =
                  item.lastMessageSenderId === normalizeUserId(myName)
                    ? 0
                    : Number(item.unreadBy?.[normalizeUserId(myName)] || 0);
                return (
                  <TouchableOpacity
                    style={styles.recentItem}
                    onPress={() => openRecentChat(item)}
                  >
                    <View style={styles.recentAvatar}>
                      <Text style={styles.recentAvatarText}>
                        {item.title.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.recentTextWrap}>
                      <View style={styles.recentTopRow}>
                        <Text style={styles.recentName} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.recentTime}>{time}</Text>
                      </View>
                      <View style={styles.recentBottomRow}>
                        <Text style={styles.recentMessage} numberOfLines={1}>
                          {item.lastMessageText || "Tap to open chat"}
                        </Text>
                        <View
                          style={[
                            styles.connectionBadge,
                            { backgroundColor: getConnectionAccent(item.connectionType) + "22" },
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
                        {unreadCount > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {showComposer && (
            <>
              {/* QUICK CONNECT */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>QUICK CONNECT</Text>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.label}>Your name</Text>
                <TextInput
                  value={myName}
                  onChangeText={setMyName}
                  placeholder="e.g. rohan"
                  placeholderTextColor="#9E9E9E"
                  autoCapitalize="none"
                  style={styles.input}
                />

                <View style={styles.quickActionRow}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, styles.quickHalfButton]}
                    onPress={handleGenerateConnectCode}
                  >
                    <Text style={styles.secondaryButtonText}>Generate My Code</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickJoinButton} onPress={connectWithCode}>
                    <Text style={styles.quickJoinButtonText}>Join with Code</Text>
                  </TouchableOpacity>
                </View>

                {!!myConnectCode && (
                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>YOUR CONNECT CODE</Text>
                    <View style={styles.codeRow}>
                      <Text style={styles.codeValue}>{myConnectCode}</Text>
                      <TouchableOpacity style={styles.copyCodeButton} onPress={copyConnectCode}>
                        <Text style={styles.copyCodeText}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <Text style={styles.label}>Enter friend's code</Text>
                <TextInput
                  ref={connectCodeInputRef}
                  value={connectCodeInput}
                  onChangeText={(value) => setConnectCodeInput(normalizeConnectCode(value))}
                  placeholder="e.g. A7K9Q2"
                  placeholderTextColor="#9E9E9E"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  style={styles.input}
                  maxLength={8}
                  returnKeyType="done"
                  onSubmitEditing={connectWithCode}
                />
                <Text style={styles.connectHint}>Generate a code or enter one to connect instantly.</Text>
                {!!quickStatusText && (
                  <Text
                    style={[
                      styles.quickStatus,
                      quickStatusType === "success" ? styles.quickStatusSuccess : styles.quickStatusError,
                    ]}
                  >
                    {quickStatusText}
                  </Text>
                )}
              </View>

              {/* ADVANCED GROUP CHAT */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowAdvancedChat((prev) => !prev)}
              >
                <Text style={styles.sectionHeaderText}>
                  {showAdvancedChat ? "ADVANCED GROUP CHAT ▴" : "ADVANCED GROUP CHAT ▾"}
                </Text>
              </TouchableOpacity>
              {showAdvancedChat && (
                <View style={styles.formSection}>
                  <Text style={styles.label}>Participants</Text>
                  <TextInput
                    value={participantsInput}
                    onChangeText={setParticipantsInput}
                    placeholder="e.g. ayaan, sara, alex"
                    placeholderTextColor="#9E9E9E"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  <Text style={styles.label}>Chat title (optional)</Text>
                  <TextInput
                    value={chatTitle}
                    onChangeText={setChatTitle}
                    placeholder="e.g. Team Room"
                    placeholderTextColor="#9E9E9E"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={[styles.button, disabled && styles.buttonDisabled]}
                    onPress={openChat}
                    disabled={disabled}
                  >
                    <Text style={styles.buttonText}>Open Group Chat</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* FAB — green WhatsApp-style floating action button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowComposer((prev) => !prev)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
