import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [senha, setSenha] = useState('');
  const [peso, setPeso] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [faixa, setFaixa] = useState('');
  const [graus, setGraus] = useState('');

  const handleRegister = async () => {
    if (!nickname || !senha || !peso || !dataNascimento || !faixa || !graus) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos antes de continuar.');
      return;
    }

    const pesoNum = parseFloat(peso);
    const grausNum = parseInt(graus);

    if (isNaN(pesoNum) || pesoNum <= 0) {
      Alert.alert('Peso inválido', 'Informe um peso válido e maior que zero.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.133:8000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          senha,
          peso: pesoNum,
          data_nascimento: dataNascimento.toISOString().split('T')[0],
          faixa,
          graus: grausNum,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.detail?.includes('Nickname já está em uso')) {
          Alert.alert('Erro', 'Este nickname já está sendo usado. Escolha outro.');
          return;
        }
        throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
      }

      Alert.alert('Sucesso', 'Usuário registrado');
      navigation.navigate('Main');
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nickname" style={styles.input} value={nickname} onChangeText={setNickname} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={senha} onChangeText={setSenha} />
      <TextInput placeholder="Peso (kg)" keyboardType="numeric" style={styles.input} value={peso} onChangeText={setPeso} />

      <Button title="Selecionar Data de Nascimento" onPress={() => setMostrarPicker(true)} />
      {mostrarPicker && (
        <DateTimePicker
          value={dataNascimento}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDataNascimento(selectedDate);
            setMostrarPicker(false);
          }}
          maximumDate={new Date()} // impede data futura
        />
      )}
      <Text style={styles.dateText}>Nascimento: {dataNascimento.toLocaleDateString()}</Text>

      <View style={styles.pickerWrapper}>
        <Text>Faixa:</Text>
        <Picker selectedValue={faixa} onValueChange={(itemValue) => setFaixa(itemValue)}>
          <Picker.Item label="Selecione a faixa" value="" />
          <Picker.Item label="Branca" value="Branca" />
          <Picker.Item label="Cinza" value="Cinza" />
          <Picker.Item label="Amarela" value="Amarela" />
          <Picker.Item label="Laranja" value="Laranja" />
          <Picker.Item label="Verde" value="Verde" />
          <Picker.Item label="Azul" value="Azul" />
          <Picker.Item label="Roxa" value="Roxa" />
          <Picker.Item label="Marrom" value="Marrom" />
          <Picker.Item label="Preta" value="Preta" />
        </Picker>
      </View>

      <View style={styles.pickerWrapper}>
        <Text>Graus:</Text>
        <Picker selectedValue={graus} onValueChange={(itemValue) => setGraus(itemValue)}>
          <Picker.Item label="0" value="0" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
        </Picker>
      </View>

      <Button title="Registrar" onPress={handleRegister} />
      <Button title="Cancelar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 10 },
  pickerWrapper: { borderWidth: 1, borderColor: '#aaa', borderRadius: 4, marginTop: 5, marginBottom: 10, paddingHorizontal: 5 },
  dateText: { marginVertical: 10, fontSize: 16, fontWeight: 'bold' },
});
