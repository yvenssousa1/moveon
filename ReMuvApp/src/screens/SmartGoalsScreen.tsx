import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useUserData, SmartGoal } from '../context/UserDataContext';
import { v4 as uuidv4 } from 'uuid';

export default function SmartGoalsScreen() {
  const { userData, addSmartGoal, updateSmartGoal } = useUserData();
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');
  const [editando, setEditando] = useState<SmartGoal | null>(null);

  const handleAdd = () => {
    if (!descricao || !prazo) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    const novo: SmartGoal = {
      id: uuidv4(),
      descricao,
      prazo,
      status: 'ativo',
      dataInicio: new Date().toISOString(),
      revisoes: [],
    };
    addSmartGoal(novo);
    setDescricao('');
    setPrazo('');
  };

  const handleConcluir = (goal: SmartGoal) => {
    updateSmartGoal({ ...goal, status: 'concluido', dataConclusao: new Date().toISOString() });
  };

  const handleRevisar = (goal: SmartGoal) => {
    Alert.prompt(
      'Revisão do objetivo',
      'Digite um comentário de revisão:',
      (comentario) => {
        if (comentario) {
          updateSmartGoal({
            ...goal,
            revisoes: [...(goal.revisoes || []), { data: new Date().toISOString(), comentario }],
          });
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Objetivos SMART</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva seu objetivo (ex: andar 2km sem dor)"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Prazo (ex: 2025-12-31)"
        value={prazo}
        onChangeText={setPrazo}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Adicionar objetivo</Text>
      </TouchableOpacity>
      <FlatList
        data={userData.smartGoals || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalCard}>
            <Text style={styles.goalDesc}>{item.descricao}</Text>
            <Text style={styles.goalPrazo}>Prazo: {item.prazo}</Text>
            <Text style={styles.goalStatus}>Status: {item.status}</Text>
            {item.status === 'ativo' && (
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <TouchableOpacity style={styles.goalAction} onPress={() => handleConcluir(item)}>
                  <Text style={{ color: '#fff' }}>Concluir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.goalAction} onPress={() => handleRevisar(item)}>
                  <Text style={{ color: '#fff' }}>Revisar</Text>
                </TouchableOpacity>
              </View>
            )}
            {item.revisoes && item.revisoes.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Revisões:</Text>
                {item.revisoes.map((rev, idx) => (
                  <Text key={idx} style={{ fontSize: 12 }}>
                    {rev.data.slice(0, 10)}: {rev.comentario}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', marginTop: 24 }}>Nenhum objetivo cadastrado.</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalDesc: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalPrazo: {
    fontSize: 14,
    color: '#888',
  },
  goalStatus: {
    fontSize: 14,
    color: '#1e90ff',
    marginBottom: 4,
  },
  goalAction: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
  },
});
