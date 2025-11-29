import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ConsentScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Consentimento de Dados</Text>
      <Text style={styles.text}>
        Para garantir sua segurança e personalização, precisamos do seu consentimento para tratar seus dados de saúde e uso do app. Seus dados são protegidos, usados apenas para seu acompanhamento e nunca compartilhados sem sua permissão. Você pode revogar o consentimento a qualquer momento pelo perfil.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, lineHeight: 24 },
});
