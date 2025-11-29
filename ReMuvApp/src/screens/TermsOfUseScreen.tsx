import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TermsOfUseScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Termos de Uso</Text>
      <Text style={styles.text}>
        O ReMuv é um app de apoio à reabilitação, não substituindo avaliação presencial. Use o app de forma responsável, seguindo orientações e respeitando os limites do seu corpo. Em caso de dúvidas ou sintomas novos, procure um profissional de saúde. Para suporte, entre em contato pelo app.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, lineHeight: 24 },
});
