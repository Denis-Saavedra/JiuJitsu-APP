import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Image, Alert, TouchableOpacity, Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditarUsuarioScreen({ route, navigation }) {
  const { uid } = route.params || {};
  const [dados, setDados] = useState({
    nickname: '',
    peso: '',
    faixa: '',
    graus: '',
    data_nascimento: '',
    admin: false,
    novaSenha: '',
  });
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [fotoURL, setFotoURL] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Erro ao carregar dados');
        setDados({
          nickname: data.nickname,
          peso: String(data.peso),
          faixa: data.faixa,
          graus: String(data.graus),
          data_nascimento: data.data_nascimento,
          admin: data.admin,
          novaSenha: '',
        });
        setFotoURL(data.fotoURL || null);
      } catch (err) {
        Alert.alert('Erro', err.message);
      }
    };

    if (uid) carregarDados();
  }, [uid]);

  const salvar = async () => {
    try {
      const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peso: parseFloat(dados.peso),
          nova_senha: dados.novaSenha || undefined,
          faixa: dados.faixa,
          graus: parseInt(dados.graus),
          data_nascimento: dados.data_nascimento,
          admin: dados.admin,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Erro ao salvar alterações');

      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>
      <Image
        source={fotoURL ? { uri: fotoURL } : require('../../assets/placeholder.png')}
        style={styles.avatar}
      />
      <Text>Apelido:</Text>
      <Text style={styles.readonly}>{dados.nickname}</Text>

      <Text>Peso (kg):</Text>
      <TextInput
        value={dados.peso}
        onChangeText={(t) => setDados({ ...dados, peso: t })}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Nova Senha:</Text>
      <TextInput
        value={dados.novaSenha}
        onChangeText={(t) => setDados({ ...dados, novaSenha: t })}
        secureTextEntry
        style={styles.input}
      />

      <Text>Faixa:</Text>
      <TextInput
        value={dados.faixa}
        onChangeText={(t) => setDados({ ...dados, faixa: t })}
        style={styles.input}
      />

      <Text>Graus:</Text>
      <TextInput
        value={dados.graus}
        onChangeText={(t) => setDados({ ...dados, graus: t })}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Data de Nascimento:</Text>
      <TouchableOpacity onPress={() => setMostrarPicker(true)}>
        <Text style={styles.readonly}>{dados.data_nascimento}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker
          value={new Date(dados.data_nascimento)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDados({ ...dados, data_nascimento: selectedDate.toISOString().split('T')[0] });
            }
            setMostrarPicker(false);
          }}
        />
      )}

      <View style={styles.switchRow}>
        <Text>Administrador:</Text>
        <Switch
          value={dados.admin}
          onValueChange={(v) => setDados({ ...dados, admin: v })}
        />
      </View>

      <Button title="Salvar Alterações" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  readonly: { marginBottom: 15, fontWeight: 'bold', fontSize: 16, color: 'gray' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
});
