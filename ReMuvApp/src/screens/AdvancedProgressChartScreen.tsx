import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { loadData } from '../utils/storage';

export default function AdvancedProgressChartScreen() {
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [streak, setStreak] = useState<number[]>([]);

  useEffect(() => {
    loadData('feedbacks').then(arr => {
      if (Array.isArray(arr)) setFeedbacks(arr);
    });
    loadData('streak').then(s => {
      if (typeof s === 'number') setStreak(Array(s).fill(1).map((_, i) => i + 1));
    });
  }, []);

  // Simulação: transformar feedbacks em valores numéricos para o gráfico
  const feedbackValues = feedbacks.map(f => f === 'Fácil' ? 3 : f === 'Difícil' ? 2 : 1);
  const labels = feedbacks.map((_, i) => `#${i+1}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolução Avançada</Text>
      {feedbacks.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: feedbackValues }],
          }}
          width={Dimensions.get('window').width - 32}
          height={180}
          yAxisLabel={''}
          yAxisSuffix={''}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f7f7f7',
            backgroundGradientTo: '#e0e0e0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#1e90ff' },
          }}
          bezier
          style={{ borderRadius: 16, marginBottom: 24 }}
        />
      ) : (
        <Text style={styles.empty}>Nenhum feedback registrado ainda.</Text>
      )}
      {streak.length > 0 ? (
        <BarChart
          data={{
            labels: streak.map((_, i) => `Dia ${i+1}`),
            datasets: [{ data: streak }],
          }}
          width={Dimensions.get('window').width - 32}
          height={180}
          yAxisLabel={''}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f7f7f7',
            backgroundGradientTo: '#e0e0e0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={{ borderRadius: 16 }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 32 },
});
