import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route, navigation }) {
  const { userName, chatId } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const flatListRef = useRef(null);

  // Set dynamic header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: userName || 'Chat',
    });
  }, [navigation]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Fake auto reply
    setTimeout(() => {
      const reply = {
        id: Date.now().toString(),
        text: 'Auto reply 🤖',
        sender: 'other',
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            sender={item.sender}
            time={item.time}
          />
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
        />

        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginLeft: 5,
    backgroundColor: '#4e8cff',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});