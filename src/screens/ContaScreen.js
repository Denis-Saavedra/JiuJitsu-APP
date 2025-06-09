import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function ContaScreen({ uid: uidProp, route }) {
  const uid = uidProp || route?.params?.uid;
  const [nickname, setNickname] = useState('');
  const [peso, setPeso] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [fotoURL, setFotoURL] = useState(null);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`);
        const data = await response.json();
if (!response.ok) {
  if (Array.isArray(data)) {
    const mensagens = data.map((e) => `• ${e.loc.join('.')}: ${e.msg}`).join('\n');
    throw new Error(mensagens);
  } else {
    throw new Error(data.detail || JSON.stringify(data, null, 2));
  }
}


        setNickname(data.nickname);
        setPeso(String(data.peso));
        setFotoURL(data.fotoURL || null);
      } catch (err) {
        Alert.alert('Erro', err.message);
      }
    };

    if (uid) carregarDados();
  }, [uid]);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imagemSelecionada = result.assets[0];
      setFotoSelecionada(imagemSelecionada.uri);
    }
  };

  const salvar = async () => {
    const payload = {};

    const pesoValido = parseFloat(peso);
    if (!isNaN(pesoValido)) {
      payload.peso = pesoValido;
    }

    if (novaSenha && novaSenha.length > 0) {
      payload.nova_senha = novaSenha;
    }

    try {
      // 1. Atualizar dados principais
      console.log('Payload enviado para PUT /usuarios:', payload);

    const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    });


      const data = await response.json();
      if (!response.ok) {
        let msg;
        if (Array.isArray(data)) {
          msg = data.map(e => `• ${e.loc.join('.')}: ${e.msg}`).join('\n');
        } else {
          msg = data.detail || JSON.stringify(data, null, 2);
        }
        throw new Error(msg);
      }

      // 2. Se imagem foi selecionada, enviar
      if (fotoSelecionada) {
        const base64 = await FileSystem.readAsStringAsync(fotoSelecionada, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fotoResp = await fetch(`http://192.168.1.133:8000/usuarios/${uid}/foto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagem_base64: base64 }),
        });

        const fotoData = await fotoResp.json();
        if (!fotoResp.ok) throw new Error(fotoData.detail || 'Erro ao enviar imagem');

        setFotoURL(fotoData.fotoURL);
        setFotoSelecionada(null);
      }

      Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const imagemFinal = fotoSelecionada || fotoURL;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>

      <TouchableOpacity onPress={escolherImagem}>
        <Image
          source={imagemFinal ? { uri: imagemFinal } : require('../../assets/placeholder.png')}
          style={styles.avatar}
        />
        <Text style={{ color: '#007AFF', marginBottom: 10 }}>Alterar Foto</Text>
      </TouchableOpacity>

      <Text>Nickname:</Text>
      <Text style={styles.readonly}>{nickname}</Text>

      <Text>Peso (kg):</Text>
      <TextInput
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Nova Senha:</Text>
      <TextInput
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Salvar Alterações" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  readonly: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    width: '100%',
    borderRadius: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    backgroundColor: '#eee',
  },
});
