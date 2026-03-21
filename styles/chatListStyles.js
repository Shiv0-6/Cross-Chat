import { StyleSheet } from "react-native";

const chatListStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 80,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 2,
  },
  headerActionText: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  connectionLauncher: {
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#E8F9F1",
    borderWidth: 1,
    borderColor: "#BDEFD0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  connectionLauncherLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionSign: {
    fontSize: 18,
    marginRight: 10,
  },
  connectionLauncherTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#075E54",
  },
  connectionLauncherSubtitle: {
    fontSize: 12,
    color: "#128C7E",
    marginTop: 1,
  },
  connectionLauncherArrow: {
    fontSize: 16,
    color: "#075E54",
    fontWeight: "700",
  },
  connectionPanel: {
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9EDEF",
  },
  settingsPanel: {
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9EDEF",
  },
  settingsPanelTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#075E54",
  },
  settingsPanelSubtitle: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 12,
    color: "#667781",
  },
  settingsActionButton: {
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  settingsActionText: {
    color: "#075E54",
    fontSize: 13,
    fontWeight: "700",
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  menuDropdown: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 190,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    zIndex: 11,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  menuItemText: {
    color: "#111111",
    fontSize: 14,
  },

  /* ── Section headers (WhatsApp-style ALL-CAPS grey label) ── */
  sectionHeader: {
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E9EDEF",
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667781",
    letterSpacing: 0.6,
  },

  /* ── Form inputs & labels ── */
  formSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#667781",
    marginBottom: 5,
    marginTop: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F0F2F5",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111111",
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: "#25D366",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 13,
    shadowColor: "#128C7E",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#a0d9b4",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  /* ── Connection mode chips ── */
  modeRow: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 4,
  },
  modeButton: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 22,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 6,
  },
  modeButtonSelected: {
    backgroundColor: "#075E54",
  },
  modeButtonText: {
    color: "#667781",
    fontSize: 13,
    fontWeight: "600",
  },
  modeButtonTextSelected: {
    color: "#FFFFFF",
  },

  /* ── Connection test button ── */
  testButton: {
    backgroundColor: "#E8F9F1",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 11,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#25D366",
  },
  testButtonDisabled: {
    opacity: 0.65,
  },
  testButtonText: {
    color: "#128C7E",
    fontWeight: "700",
    fontSize: 14,
  },

  /* ── Connect-by-code ── */
  secondaryButton: {
    backgroundColor: "#F0F2F5",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 11,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#075E54",
    fontWeight: "700",
    fontSize: 14,
  },
  quickActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  quickHalfButton: {
    flex: 1,
  },
  quickJoinButton: {
    flex: 1,
    backgroundColor: "#25D366",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 11,
    marginBottom: 10,
  },
  quickJoinButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  codeBox: {
    backgroundColor: "#E8F9F1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  codeLabel: {
    fontSize: 11,
    color: "#128C7E",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeValue: {
    color: "#075E54",
    fontWeight: "800",
    fontSize: 22,
    letterSpacing: 2,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  copyCodeButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDEFD0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  copyCodeText: {
    color: "#075E54",
    fontSize: 12,
    fontWeight: "700",
  },
  connectHint: {
    marginTop: 2,
    color: "#667781",
    fontSize: 12,
  },
  quickStatus: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  quickStatusSuccess: {
    color: "#0E8A58",
  },
  quickStatusError: {
    color: "#C62828",
  },

  /* ── Recent chats list ── */
  recentListContent: {
    paddingBottom: 4,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E9EDEF",
  },
  recentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#075E54",
    marginRight: 14,
    flexShrink: 0,
  },
  recentAvatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
  },
  recentTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  recentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  recentName: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  recentTime: {
    fontSize: 12,
    color: "#667781",
    flexShrink: 0,
  },
  recentBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentMessage: {
    color: "#667781",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  connectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    flexShrink: 0,
  },
  connectionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  /* ── Empty state ── */
  emptyCard: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyRecentText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyRecentSubtext: {
    color: "#667781",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },

  /* ── FAB ── */
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "400",
  },
});

export default chatListStyles;
