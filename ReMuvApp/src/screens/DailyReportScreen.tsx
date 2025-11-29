import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useUserData, DailyReport } from '../context/UserDataContext';
import * as Notifications from 'expo-notifications';
  useEffect(() => {
    // Agenda notificação diária às 20h para lembrar do auto-relato
    Notifications.cancelAllScheduledNotificationsAsync();
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Como está sua dor hoje?',
        body: 'Registre seu auto-relato diário no ReMuv!'
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true
      }
    });
  }, []);

export default function DailyReportScreen() {
  const { userData, addDailyReport } = useUserData();
  const [dor, setDor] = useState('');
  const [funcao, setFuncao] = useState('');
  const [humor, setHumor] = useState('');
  const [comentario, setComentario] = useState('');

  const handleSubmit = () => {
    if (!dor || !funcao || !humor) {
      Alert.alert('Preencha todos os campos de 0 a 10');
      return;
    }
    const report: DailyReport = {
      data: new Date().toISOString().slice(0, 10),
      dor: Number(dor),
      funcao: Number(funcao),
      humor: Number(humor),
      comentario,
    };
    addDailyReport(report);
    setDor('');
    setFuncao('');
    setHumor('');
    setComentario('');
    Alert.alert('Auto-relato salvo!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto-relato Diário</Text>
      <Text style={styles.label}>Dor (0-10):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={dor} onChangeText={setDor} maxLength={2} />
      <Text style={styles.label}>Função (0-10):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={funcao} onChangeText={setFuncao} maxLength={2} />
      <Text style={styles.label}>Humor (0-10):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={humor} onChangeText={setHumor} maxLength={2} />
      <Text style={styles.label}>Comentário (opcional):</Text>
      <TextInput style={styles.input} value={comentario} onChangeText={setComentario} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar relato</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { fontSize: 18, marginTop: 24 }]}>Histórico recente</Text>
      <FlatList
        data={userData.dailyReports ? [...userData.dailyReports].reverse().slice(0, 7) : []}
        keyExtractor={item => item.data + (item.comentario || '')}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <Text style={styles.reportDate}>{item.data}</Text>
            <Text style={styles.reportText}>Dor: {item.dor} | Função: {item.funcao} | Humor: {item.humor}</Text>
            {item.comentario ? <Text style={styles.reportComment}>"{item.comentario}"</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 12 }}>Nenhum relato recente.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reportDate: {
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  reportText: {
    fontSize: 14,
  },
  reportComment: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
  },
});
