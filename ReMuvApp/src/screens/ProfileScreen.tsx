import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useUserData } from '../context/UserDataContext';

  const { state: auth } = useAuth();
  const { state: progress } = useProgress();
  const { userData } = useUserData();

  // ...existing code...
  const navigation = (typeof useNavigation === 'function') ? useNavigation() : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <Text style={styles.label}>Usuário:</Text>
      <Text style={styles.value}>{auth.user}</Text>
      <Text style={styles.label}>Streak de dias:</Text>
      <Text style={styles.value}>{progress.streak}</Text>
      <Text style={styles.label}>Exercícios concluídos:</Text>
      <Text style={styles.value}>{progress.completedExercises.length}</Text>
      {userData.objetivos && userData.objetivos.length > 0 && (
        <>
          <Text style={styles.label}>Objetivos:</Text>
          <Text style={styles.value}>{userData.objetivos.join(', ')}</Text>
        </>
      )}
      {userData.equipamentos && userData.equipamentos.length > 0 && (
        <>
          <Text style={styles.label}>Equipamentos:</Text>
          <Text style={styles.value}>{userData.equipamentos.join(', ')}</Text>
        </>
      )}
      {(userData.idade || userData.peso || userData.altura) && (
        <>
          <Text style={styles.label}>Bioantropometria:</Text>
          <Text style={styles.value}>
            {userData.idade ? `Idade: ${userData.idade} ` : ''}
            {userData.peso ? `Peso: ${userData.peso}kg ` : ''}
            {userData.altura ? `Altura: ${userData.altura}cm` : ''}
          </Text>
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation && navigation.navigate('SmartGoalsScreen')}>
        <Text style={styles.buttonText}>Ver/Editar Objetivos SMART</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#32c671', marginTop: 12 }]} onPress={() => navigation && navigation.navigate('DailyReportScreen')}>
        <Text style={styles.buttonText}>Auto-relato Diário</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#f7b731', marginTop: 12 }]} onPress={() => navigation && navigation.navigate('Consentimento')}>
        <Text style={styles.buttonText}>Consentimento de Dados</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#778ca3', marginTop: 12 }]} onPress={() => navigation && navigation.navigate('Privacidade')}>
        <Text style={styles.buttonText}>Política de Privacidade</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#3867d6', marginTop: 12 }]} onPress={() => navigation && navigation.navigate('Termos de Uso')}>
        <Text style={styles.buttonText}>Termos de Uso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
