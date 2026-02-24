import { StyleSheet } from "react-native";

const messageBubbleStyles = StyleSheet.create({
  wrapper: {
    marginVertical: 5,
    paddingHorizontal: 2,
  },
  wrapperOwn: {
    alignItems: "flex-end",
  },
  wrapperOther: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#0f2c5c",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bubbleOwn: {
    backgroundColor: "#2d6cdf",
    borderColor: "#2d6cdf",
    borderTopRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#ffffff",
    borderColor: "#e3e7ef",
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    color: "#1f2430",
    lineHeight: 20,
  },
  senderName: {
    fontSize: 12,
    color: "#5b6f8d",
    fontWeight: "600",
    marginBottom: 5,
  },
  textOwn: {
    color: "#ffffff",
  },
  time: {
    marginTop: 6,
    fontSize: 11,
    color: "#7a7f8a",
    alignSelf: "flex-end",
  },
  timeOwn: {
    color: "#dbe7ff",
  },
});

export default messageBubbleStyles;
