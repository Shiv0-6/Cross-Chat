import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ text, sender }) {
  const isMe = sender === 'me';

  return (
    <View style={[
      styles.bubble,
      isMe ? styles.myMessage : styles.otherMessage
    ]}>
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#4e8cff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#ccc',
    alignSelf: 'flex-start',
  }
}); 