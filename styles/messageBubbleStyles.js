import { StyleSheet } from "react-native";

const messageBubbleStyles = StyleSheet.create({
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
    backgroundColor: "#DCF8C6",
    borderTopRightRadius: 2,
  },
  /* Received bubble: white, tail on top-left */
  bubbleOther: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 2,
  },
  text: {
    fontSize: 15,
    color: "#111111",
    lineHeight: 20,
  },
  textOwn: {
    color: "#111111",
  },
  senderName: {
    fontSize: 12,
    color: "#128C7E",
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
    color: "#667781",
  },
  timeOwn: {
    color: "#667781",
  },
  tick: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "700",
  },
  tickDelivered: {
    color: "#667781",
  },
  tickRead: {
    color: "#34B7F1",
  },
});

export default messageBubbleStyles;
