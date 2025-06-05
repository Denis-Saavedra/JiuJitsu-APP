import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ uid, setUid }) {
  const logout = async () => {
    await AsyncStorage.removeItem('uid');
    setUid(null); // isso faz o App.js redirecionar para Login
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>Logado como UID: {uid}</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
