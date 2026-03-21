import { StyleSheet } from "react-native";

const createMessageBubbleStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      marginVertical: 2,
      paddingHorizontal: 8,
    },
    wrapperOwn: {
      alignItems: "flex-end",
    },
    wrapperOther: {
      alignItems: "flex-start",
    },
    bubble: {
      maxWidth: "80%",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    /* Sent bubble: WhatsApp light-green, tail on top-right */
    bubbleOwn: {
      backgroundColor: colors.sentBubbleBackground,
      borderTopRightRadius: 2,
    },
    /* Received bubble: white, tail on top-left */
    bubbleOther: {
      backgroundColor: colors.receivedBubbleBackground,
      borderTopLeftRadius: 2,
    },
    text: {
      fontSize: 15,
      color: colors.messageBubbleText,
      lineHeight: 20,
    },
    textOwn: {
      color: colors.messageBubbleText,
    },
    senderName: {
      fontSize: 12,
      color: colors.darkGreen,
      fontWeight: "700",
      marginBottom: 3,
    },
    metaRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    time: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    timeOwn: {
      color: colors.textSecondary,
    },
    tick: {
      marginLeft: 4,
      fontSize: 11,
      fontWeight: "700",
    },
    tickDelivered: {
      color: colors.tickDelivered,
    },
    tickRead: {
      color: colors.tickRead,
    },
  });

export default createMessageBubbleStyles;
