import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ChatListScreen({ navigation }) {
  return (
      <View style={styles.container}>
            <TouchableOpacity
  style={styles.chatItem}
  onPress={() =>
    navigation.navigate('Chat', {
      userName: 'Shivam',
      chatId: '1',
    })
  }
>
  <Text>Open Chat 💬</Text>
</TouchableOpacity>
                                                    </View>
                                                      );
                                                      }

                                                      const styles = StyleSheet.create({
                                                        container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
                                                          chatItem: {
                                                              padding: 15,
                                                                  backgroundColor: '#ddd',
                                                                      borderRadius: 8,
                                                                        },
                                                                        });