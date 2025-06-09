import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditarUsuarioScreen from './src/screens/EditarUsuarioScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const savedUid = await AsyncStorage.getItem('uid');
      setUid(savedUid);
    };

    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {uid ? (
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} uid={uid} setUid={setUid} />}
            </Stack.Screen>

            <Stack.Screen name="EditarUsuario" component={EditarUsuarioScreen} />

            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUid={setUid} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
