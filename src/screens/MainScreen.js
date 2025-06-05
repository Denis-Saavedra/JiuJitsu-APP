import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function MainScreen({ route }) {
  const { uid } = route.params || {};

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarStatus = async () => {
      try {
        const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || 'Erro ao buscar status');

        setStatus(data);
      } catch (err) {
        console.error(err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      carregarStatus();
    } else {
      setLoading(false);
    }
  }, []);

  if (!uid) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Usuário desconectado</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (!status) return <Text style={styles.error}>Erro ao carregar status do aluno.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status do Aluno</Text>
      <Text style={styles.item}>Aluno: {status.nickname}</Text>
      <Text style={styles.item}>Faixa: {status.faixa}</Text>
      <Text style={styles.item}>Graus: {status.graus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 18, marginBottom: 10 },
  error: { color: 'red', marginTop: 40 },
});
