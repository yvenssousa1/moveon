import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSessionHistory } from '../context/SessionHistoryContext';

export default function SessionHistoryScreen() {
  const { sessions } = useSessionHistory();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Sessões</Text>
      <FlatList
        data={sessions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.area}>Área: {item.area}</Text>
            <Text style={styles.exs}>Exercícios: {item.exercises.join(', ')}</Text>
            <Text style={styles.feedbacks}>Feedbacks: {item.feedbacks.join(', ')}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma sessão registrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  date: { fontWeight: 'bold', color: '#1e90ff', marginBottom: 4 },
  area: { color: '#333', marginBottom: 2 },
  exs: { color: '#555', marginBottom: 2 },
  feedbacks: { color: '#888' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 32 },
});
