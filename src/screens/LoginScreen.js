import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setUid }) {
  const [nickname, setNickname] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.133:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, senha }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Erro no login');

      await AsyncStorage.setItem('uid', data.uid);
      setUid(data.uid); // aciona navegação no App.js
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nickname"
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 10 },
});
