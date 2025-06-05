import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from './MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export default function HomeScreen({ uid, setUid }) {
  const navigation = useNavigation();

  const logout = async () => {
    await AsyncStorage.removeItem('uid');
    setUid(null);
  };

  return (
    <Drawer.Navigator initialRouteName="Main" screenOptions={{ unmountOnBlur: true }}>
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        initialParams={{ uid }}
      />
      
      <Drawer.Screen
        name="Sair"
        component={MainScreen}
        options={{ drawerLabel: 'Sair' }}
        listeners={{
          focus: () => logout(),
        }}
      />
    </Drawer.Navigator>
  );
}
