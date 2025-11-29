import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Política de Privacidade</Text>
      <Text style={styles.text}>
        Sua privacidade é prioridade no ReMuv. Coletamos apenas informações essenciais para personalizar sua jornada e melhorar sua experiência. Seus dados são criptografados, armazenados com segurança e nunca vendidos. Você pode solicitar acesso, correção ou exclusão dos dados pelo app.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, lineHeight: 24 },
});
