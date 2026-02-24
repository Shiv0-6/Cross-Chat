import { StyleSheet } from "react-native";

const chatScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef3fb",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "#eef3fb",
  },
  listContent: {
    paddingBottom: 12,
    paddingTop: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dce6f4",
    padding: 12,
    marginBottom: 12,
    shadowColor: "#0f2c5c",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  headerTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  chatTitle: {
    fontSize: 17,
    color: "#1f2430",
    fontWeight: "600",
  },
  chatSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#6b7c95",
  },
  modePill: {
    backgroundColor: "#e9f0ff",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modePillText: {
    color: "#2d6cdf",
    fontWeight: "700",
    fontSize: 11,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#73839b",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dce6f4",
    padding: 9,
    shadowColor: "#0f2c5c",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#20242c",
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: "#2d6cdf",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 11,
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

export default chatScreenStyles;
