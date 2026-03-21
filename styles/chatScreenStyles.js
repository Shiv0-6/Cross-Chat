import { StyleSheet } from "react-native";

const createChatScreenStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.headerBackground,
    },
    container: {
      flex: 1,
      backgroundColor: colors.surfaceColor,
    },

    /* ── Custom WhatsApp header ── */
    header: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.headerBackground,
      paddingHorizontal: 12,
      paddingVertical: 10,
      paddingTop: 14,
    },
    backButton: {
      marginRight: 4,
      padding: 4,
    },
    backButtonText: {
      color: colors.headerText,
      fontSize: 26,
      lineHeight: 28,
      fontWeight: "300",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.darkGreen,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    avatarText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },
    headerTextWrap: {
      flex: 1,
    },
    chatTitle: {
      fontSize: 17,
      color: colors.headerText,
      fontWeight: "600",
    },
    chatSubtitle: {
      marginTop: 1,
      fontSize: 12,
      color: colors.textSecondary,
      opacity: 0.8,
    },
    modePill: {
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 99,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    modePillText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 11,
    },

    /* ── Messages list ── */
    listContent: {
      paddingHorizontal: 8,
      paddingBottom: 10,
      paddingTop: 10,
    },
    emptyListContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
      backgroundColor: colors.cardBackground,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    dateSeparatorWrap: {
      alignSelf: "center",
      backgroundColor: colors.dateBackgroundColor,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 10,
      marginVertical: 8,
    },
    dateSeparatorText: {
      color: colors.dateTextColor,
      fontSize: 11,
      fontWeight: "600",
    },

    /* ── Input bar (WhatsApp bottom bar) ── */
    inputBarWrap: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: colors.buttonBackground,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: colors.cardBackground,
      borderRadius: 24,
      paddingHorizontal: 14,
      paddingVertical: 6,
      marginRight: 8,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    input: {
      flex: 1,
      minHeight: 36,
      maxHeight: 120,
      paddingVertical: 6,
      color: colors.textPrimary,
      fontSize: 15,
      lineHeight: 20,
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryGreen,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.darkGreen,
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    sendButtonDisabled: {
      backgroundColor: colors.darkGreen,
      shadowOpacity: 0,
      elevation: 0,
      opacity: 0.6,
    },
    sendText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },
  });

export default createChatScreenStyles;
