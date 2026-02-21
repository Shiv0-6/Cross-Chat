import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
                <NavigationContainer>
                        <Stack.Navigator>
                                <Stack.Screen
                                        name="ChatList"
                                        component={ChatListScreen}
                                        options={{ title: 'Chats' }}
                                />
                                <Stack.Screen name="Chat" component={ChatScreen} />
                        </Stack.Navigator>
                </NavigationContainer>
        );
}