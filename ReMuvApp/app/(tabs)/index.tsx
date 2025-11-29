import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, View } from '@/components/Themed';
import { Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../../src/services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/onboarding');
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCadastro() {
    if (!email || !senha) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      router.push('/onboarding');
    } catch (e: any) {
      Alert.alert('Erro ao cadastrar', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao ReMuv!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={{ textAlign: 'center', marginBottom: 16 }}>
        Seu app premium de reabilitação personalizada, protocolos inteligentes e evolução clínica.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 16 }} />
      ) : (
        <>
          <Button title="Entrar" onPress={handleLogin} />
          <Button title="Cadastrar" onPress={handleCadastro} color="#4CAF50" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    width: 260,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});
