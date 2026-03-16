import { StyleSheet } from "react-native";

const chatScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#075E54",
  },
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },

  /* ── Custom WhatsApp header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#075E54",
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingTop: 14,
  },
  backButton: {
    marginRight: 4,
    padding: 4,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "300",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#128C7E",
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
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chatSubtitle: {
    marginTop: 1,
    fontSize: 12,
    color: "#B2DFDB",
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
    color: "#6B8068",
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateSeparatorWrap: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 8,
  },
  dateSeparatorText: {
    color: "#667781",
    fontSize: 11,
    fontWeight: "600",
  },

  /* ── Input bar (WhatsApp bottom bar) ── */
  inputBarWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
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
    color: "#111111",
    fontSize: 15,
    lineHeight: 20,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#128C7E",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#A5D6A7",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default chatScreenStyles;
