import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegistrarAulaScreen({ route }) {
  const { uid } = route.params;
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [faixaAtual, setFaixaAtual] = useState('');
  const [aulasDoDia, setAulasDoDia] = useState([]);

  const horariosPorDia = {
    2: [
      { titulo: 'Aula 1', hora: '08:00' },
      { titulo: 'Aula 2', hora: '18:30' },
      { titulo: 'Aula 3', hora: '19:30' },
    ],
    3: [{ titulo: 'Aula Kids', hora: '18:30' }],
    4: [
      { titulo: 'Aula 1', hora: '08:00' },
      { titulo: 'Aula 2', hora: '18:30' },
      { titulo: 'Aula 3', hora: '19:30' },
    ],
    5: [{ titulo: 'No Gi', hora: '19:30' }],
    6: [{ titulo: 'Rola', hora: '11:00' }],
  };

  const diaSemana = dataSelecionada.getDay();
  const aulasDisponiveis = horariosPorDia[diaSemana] || [];

  const hoje = new Date();
  const minDate = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const maxDate = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dataSelecionada;
    setMostrarPicker(false);
    setDataSelecionada(currentDate);
    setAulaSelecionada(null);
  };

  const carregarFaixaAtual = async () => {
    try {
      const response = await fetch(`http://192.168.1.133:8000/usuarios/${uid}`);
      const data = await response.json();
      if (response.ok) {
        setFaixaAtual(data.faixa);
      }
    } catch (err) {
      console.error('Erro ao buscar faixa:', err);
    }
  };

  const carregarAulasDoDia = async () => {
    try {
      const response = await fetch(`http://192.168.1.133:8000/aulas/${uid}`);
      const todasAulas = await response.json();
      const dataISO = dataSelecionada.toISOString().split('T')[0];
      const filtradas = todasAulas.filter((a) => a.data === dataISO);
      setAulasDoDia(filtradas.map((a) => a.titulo));
    } catch (err) {
      console.error('Erro ao buscar aulas do dia:', err);
    }
  };

  useEffect(() => {
    carregarAulasDoDia();
    carregarFaixaAtual();
  }, [dataSelecionada]);

  const registrarAula = async () => {
    if (!aulaSelecionada) {
      Alert.alert('Erro', 'Selecione uma aula.');
      return;
    }

    const dataISO = dataSelecionada.toISOString().split('T')[0];

    try {
      const response = await fetch(`http://192.168.1.133:8000/aulas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          data: dataISO,
          titulo: aulaSelecionada.titulo,
          faixaEsperada: faixaAtual || 'branca',
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Erro ao registrar aula');

      Alert.alert('Sucesso', 'Aula registrada com sucesso!');
      setAulaSelecionada(null);
      carregarAulasDoDia(); // atualizar lista
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Aula</Text>

      <Button title="Selecionar Data" onPress={() => setMostrarPicker(true)} />
      {mostrarPicker && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      <Text style={styles.selectedDate}>
        Data: {dataSelecionada.toLocaleDateString()}
      </Text>

      {aulasDisponiveis.length > 0 ? (
        <View style={styles.aulasContainer}>
          <Text style={styles.subtitle}>Aulas disponíveis:</Text>
          {aulasDisponiveis.map((aula, index) => {
            const jaFeita = aulasDoDia.includes(aula.titulo);
            const selecionada = aulaSelecionada?.titulo === aula.titulo;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.aulaItem,
                  selecionada && !jaFeita && styles.aulaSelecionada,
                  jaFeita && styles.aulaDesabilitada,
                ]}
                disabled={jaFeita}
                onPress={() => {
                  if (!jaFeita) setAulaSelecionada(aula);
                }}
              >
                <Text style={{ color: jaFeita ? '#aaa' : '#000' }}>
                  {aula.titulo} - {aula.hora}
                </Text>
              </TouchableOpacity>
            );
          })}

          {aulaSelecionada && (
            <Button title="Registrar Aula" onPress={registrarAula} />
          )}
        </View>
      ) : (
        <Text style={{ marginTop: 20, color: 'gray' }}>
          Nenhuma aula disponível nesse dia.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  selectedDate: { marginTop: 20, fontSize: 16 },
  aulasContainer: { marginTop: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  aulaItem: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  aulaSelecionada: {
    backgroundColor: '#def',
    borderColor: '#09c',
  },
  aulaDesabilitada: {
    opacity: 0.5,
    backgroundColor: '#eee',
    borderColor: '#ccc',
  },
});
