import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function MainScreen({ route }) {
  const { uid } = route.params || {};
  const [status, setStatus] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (!uid) return;
      const carregarDados = async () => {
        try {
          const [userResp, aulasResp] = await Promise.all([
            fetch(`http://192.168.1.133:8000/usuarios/${uid}`),
            fetch(`http://192.168.1.133:8000/aulas/${uid}`),
          ]);

          const userData = await userResp.json();
          const aulasData = await aulasResp.json();

          if (!userResp.ok) throw new Error(userData.detail || 'Erro ao buscar status');
          if (!aulasResp.ok) throw new Error(aulasData.detail || 'Erro ao buscar aulas');

          setStatus(userData);
          setAulas(aulasData);
        } catch (err) {
          console.error(err);
          setStatus(null);
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      carregarDados();
    }, [uid])
  );

  if (!uid) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Usuário desconectado</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (!status) return <Text style={styles.error}>Erro ao carregar status do aluno.</Text>;

  const aulasFeitas = aulas.length;
  const progresso = (aulasFeitas % 50) / 50;

  // 🔸 Calcular idade com base na data de nascimento
  let idade = '';
  if (status.data_nascimento) {
    const nasc = new Date(status.data_nascimento);
    const hoje = new Date();
    idade = hoje.getFullYear() - nasc.getFullYear();
    if (
      hoje.getMonth() < nasc.getMonth() ||
      (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())
    ) {
      idade--;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status do Aluno</Text>
      <Text style={styles.item}>Apelido: {status.nickname}</Text>
      <Text style={styles.item}>Idade: {idade} anos</Text>
      <Text style={styles.item}>Peso: {status.peso} kg</Text>
      <Text style={styles.item}>Faixa: {status.faixa}</Text>
      <Text style={styles.item}>Graus: {status.graus}/4</Text>

      <Text style={styles.subtitle}>Próxima graduação:</Text>
      <Text style={styles.item}>{aulasFeitas % 50}/50 aulas registradas</Text>

      {Platform.OS === 'android' ? (
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progresso}
          color="#3b82f6"
          style={styles.progressBar}
        />
      ) : (
        <ProgressViewIOS progress={progresso} style={styles.progressBar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  item: { fontSize: 16, marginBottom: 8 },
  error: { color: 'red', marginTop: 40 },
  progressBar: { width: 250, height: 10, marginTop: 10 },
});
