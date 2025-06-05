import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.1.133:8000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, senha }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Erro no registro:', data); // útil para ver no console
        throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
       }


      Alert.alert('Sucesso', 'Usuário registrado');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nickname" style={styles.input} value={nickname} onChangeText={setNickname} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />
      <Button title="Registrar" onPress={handleRegister} />
      <Button title="Já tem conta? Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 20 }, input: { borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 10 } });
