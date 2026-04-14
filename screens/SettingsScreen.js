import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    section: {
      marginTop: 12,
      marginHorizontal: 12,
      borderRadius: 14,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.borderColor,
      overflow: "hidden",
    },
    sectionHeader: {
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 8,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    row: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rowText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },
    rowValue: {
      color: colors.textSecondary,
      fontSize: 13,
      marginLeft: 10,
    },
    footer: {
      marginTop: 16,
      marginHorizontal: 12,
      marginBottom: 20,
      alignItems: "center",
    },
    footerText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [appLanguage, setAppLanguage] = useState("English");

  const openAbout = () => {
    Alert.alert(
      "About Cross Chat",
      "Cross Chat helps you quickly connect and chat with friends using connect codes and group chats."
    );
  };

  const openLanguageSettings = () => {
    Alert.alert("Language", "Choose your preferred app language.", [
      {
        text: "English",
        onPress: () => setAppLanguage("English"),
      },
      {
        text: "Hindi",
        onPress: () => setAppLanguage("Hindi"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const openFeedback = () => {
    Alert.alert(
      "Feedback",
      "We’d love your feedback. Share your suggestions and issues at support@crosschat.app"
    );
  };

  const openSecuritySettings = () => {
    Alert.alert(
      "Security & Privacy",
      "Your chats rely on Firebase security rules and your account identity. Keep your connect code private and avoid sharing personal details in public chats."
    );
  };

  const openHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "For help with connection or chat issues, run Connection Test and contact support if needed."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SETTINGS</Text>

          <TouchableOpacity style={styles.row} onPress={openAbout}>
            <Text style={styles.rowText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={openLanguageSettings}>
            <Text style={styles.rowText}>Language</Text>
            <Text style={styles.rowValue}>{appLanguage}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={openFeedback}>
            <Text style={styles.rowText}>Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={openSecuritySettings}>
            <Text style={styles.rowText}>Security & Privacy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={openHelpSupport}>
            <Text style={styles.rowText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={toggleTheme}>
            <Text style={styles.rowText}>{isDark ? "Light Mode" : "Dark Mode"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Cross Chat v1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}