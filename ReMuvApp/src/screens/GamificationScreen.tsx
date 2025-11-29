import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GamificationScreen() {
  // Exemplo de streak e pontos
  const [streak, setStreak] = useState(5);
  const [points, setPoints] = useState(120);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gamificação</Text>
      <View style={styles.card}>
        <Text style={styles.streak}>🔥 {streak} dias seguidos</Text>
        <Text style={styles.points}>⭐ {points} pontos de recuperação</Text>
      </View>
      <Text style={styles.subtitle}>Complete sessões para aumentar seu streak e ganhar pontos!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  streak: {
    fontSize: 22,
    color: '#1e90ff',
    marginBottom: 8,
  },
  points: {
    fontSize: 20,
    color: '#ffb300',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 16,
  },
});
