import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

export default function UsuariosScreen({ uid }) {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();

  const buscarUsuarios = async (termo = '') => {
    try {
      setCarregando(true);
      const response = await fetch(`http://192.168.1.133:8000/usuarios${termo ? `?q=${termo}` : ''}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Erro ao buscar usuários');
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
        buscarUsuarios(filtro);
    }, [filtro])
    );


  useEffect(() => {
    const delay = setTimeout(() => buscarUsuarios(filtro), 300);
    return () => clearTimeout(delay);
  }, [filtro]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.usuarioItem}
      onPress={() => navigation.navigate('EditarUsuario', { uid: item.uid })}
    >
      <Image
        source={item.fotoURL ? { uri: item.fotoURL } : require('../../assets/placeholder.png')}
        style={styles.avatar}
      />
      <Text style={styles.nome}>{item.nickname}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários</Text>

      <TextInput
        placeholder="Buscar usuário..."
        value={filtro}
        onChangeText={setFiltro}
        style={styles.input}
      />

      {carregando ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.botaoTexto}>+ Adicionar Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  usuarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  nome: { fontSize: 16 },
  botaoNovo: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
