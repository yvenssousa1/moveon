import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PremiumButton from '../components/PremiumButton';

export default function PaywallScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desbloqueie o ReMuv Premium</Text>
      <Text style={styles.subtitle}>Acesse todos os protocolos, vídeos exclusivos e recursos avançados.</Text>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Mensal</Text>
        <Text style={styles.planPrice}>R$ 29,90</Text>
        <PremiumButton title="Assinar Mensal" onPress={() => {}} />
      </View>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Anual</Text>
        <Text style={styles.planPrice}>R$ 239,90</Text>
        <Text style={styles.planEconomy}>Economize 33%</Text>
        <PremiumButton title="Assinar Anual" onPress={() => {}} />
      </View>
      <Text style={styles.terms}>Cancelamento fácil. Sem fidelidade.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 22,
    color: '#1e90ff',
    marginBottom: 4,
  },
  planEconomy: {
    fontSize: 14,
    color: '#43a047',
    marginBottom: 8,
  },
  terms: {
    fontSize: 13,
    color: '#888',
    marginTop: 24,
    textAlign: 'center',
  },
});
