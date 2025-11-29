import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import FeedbackModal from '../components/FeedbackModal';
import { useClinicalLogic } from '../context/ClinicalLogicContext';
import { fetchExerciseVideo } from '../api/exerciseApi';
import { protocols } from '../protocols/protocols';
import { saveData, loadData } from '../utils/storage';
import { useProgress } from '../context/ProgressContext';
import { useSessionHistory } from '../context/SessionHistoryContext';
import { scheduleSessionReminder, scheduleFeedbackCheck } from '../utils/notifications';
import { useUserData } from '../context/UserDataContext';

export default function PlayerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const { state, addFeedback, updateHypothesis } = useClinicalLogic();
  const { addSession } = useSessionHistory();
  const { state: progress, completeExercise } = useProgress();

  // Personalização clínica: filtra exercícios por equipamentos disponíveis
  const mainPain = state.mainPain || 'joelho';
  const { userData } = useUserData();
  let exercises = protocols[mainPain] || protocols['joelho'];
  // Filtro por equipamentos
  if (userData.equipamentos && userData.equipamentos.length > 0) {
    exercises = exercises.filter(ex => {
      if (!ex.equipamento || ex.equipamento.length === 0) return true;
      return userData.equipamentos?.some(eq => ex.equipamento.includes(eq.toLowerCase()));
    });
    if (exercises.length === 0) exercises = protocols[mainPain] || protocols['joelho'];
  }
  // Filtro por objetivo
  if (userData.objetivos && userData.objetivos.length > 0) {
    exercises = exercises.filter(ex => {
      if (!ex.objetivo || ex.objetivo.length === 0) return true;
      return userData.objetivos?.some(obj => ex.objetivo.includes(obj.toLowerCase()));
    });
    if (exercises.length === 0) exercises = protocols[mainPain] || protocols['joelho'];
  }
  // Filtro por bioantropometria (exemplo: idosos evitam exercícios de impacto)
  if (userData.idade && userData.idade > 65) {
    exercises = exercises.filter(ex => !['squat', 'lunge', 'jump'].includes(ex.name));
    if (exercises.length === 0) exercises = protocols[mainPain] || protocols['joelho'];
  }

  // Recomendações automáticas detalhadas
  let recomendacao = '';
  if (userData.objetivos && userData.objetivos.length > 0) {
    if (userData.objetivos.some(o => o.toLowerCase().includes('amplitude'))) {
      recomendacao += 'Foque em exercícios de mobilidade e alongamento. ';
    }
    if (userData.objetivos.some(o => o.toLowerCase().includes('força'))) {
      recomendacao += 'Inclua exercícios de resistência progressiva. ';
    }
    if (userData.objetivos.some(o => o.toLowerCase().includes('postura'))) {
      recomendacao += 'Priorize exercícios posturais e de consciência corporal. ';
    }
    if (userData.objetivos.some(o => o.toLowerCase().includes('funcional'))) {
      recomendacao += 'Inclua movimentos multiarticulares e funcionais. ';
    }
  }
  if (userData.idade && userData.idade > 60) {
    recomendacao += 'Atenção especial à segurança, equilíbrio e progressão lenta.';
  }

  // Carregar progresso salvo ao iniciar
  useEffect(() => {
    loadData('exerciseIndex').then(idx => {
      if (typeof idx === 'number' && idx >= 0 && idx < exercises.length) {
        setExerciseIndex(idx);
      }
    });
  }, [mainPain]);

  // Buscar vídeo do exercício atual
  useEffect(() => {
    setLoading(true);
    fetchExerciseVideo(exercises[exerciseIndex].name).then(url => {
      setVideoUrl(url);
      setLoading(false);
    });
    saveData('exerciseIndex', exerciseIndex);
  }, [exerciseIndex, exercises]);

  // Árvore de decisão clínica expandida
  const handleFeedback = (feedback: string) => {
    addFeedback(feedback);
    // Salvar feedbacks
    loadData('feedbacks').then((arr) => {
      const newArr = Array.isArray(arr) ? [...arr, feedback] : [feedback];
      saveData('feedbacks', newArr);
    });
    // Lógica adaptativa detalhada
    const logic = exercises[exerciseIndex].logic || [];
    let nextIndex = exerciseIndex;
    let hypo = 'Repita o exercício atual';
    if (feedback === 'Fácil' && exerciseIndex < exercises.length - 1) {
      nextIndex = exerciseIndex + 1;
      hypo = logic.find(l => l.includes('fácil')) || 'Avançando para próximo exercício';
    } else if (feedback === 'Dor' && exerciseIndex > 0) {
      nextIndex = exerciseIndex - 1;
      hypo = logic.find(l => l.includes('dor')) || 'Voltando para exercício anterior';
    }
    updateHypothesis(hypo);
    setExerciseIndex(nextIndex);
    // Salvar progresso
    completeExercise(nextIndex);
    saveData('exerciseIndex', nextIndex);
    saveData('streak', progress.streak + 1);

    // Se finalizou o protocolo, salva sessão e agenda notificações
    if (nextIndex === exercises.length - 1 && feedback === 'Fácil') {
      loadData('feedbacks').then((feedbacks) => {
        addSession({
          date: new Date().toLocaleString(),
          area: mainPain,
          exercises: exercises.map(e => e.display),
          feedbacks: Array.isArray(feedbacks) ? feedbacks : [],
        });
        scheduleSessionReminder(24); // Lembrar treino em 24h
        scheduleFeedbackCheck(2);   // Checar dor em 2h
        saveData('feedbacks', []);  // Limpa feedbacks para próxima sessão
      });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseTitle}>{exercises[exerciseIndex]?.display || 'Exercício'}</Text>
      {recomendacao ? (
        <Text style={styles.recommendation}>{recomendacao}</Text>
      ) : null}
      <View style={styles.videoContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1e90ff" />
        ) : videoUrl ? (
          <Video
            source={{ uri: videoUrl }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={styles.video}
          />
        ) : (
          <Text style={styles.videoError}>Vídeo não encontrado</Text>
        )}
      </View>
      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackTitle}>Como foi a execução?</Text>
        <Text style={styles.feedbackQuestion}>Conseguiu fazer o movimento perfeito?</Text>
        <Button title="Responder" onPress={() => setModalVisible(true)} />
        <Text style={styles.hypothesis}>Diagnóstico: {state.diagnosticHypothesis}</Text>
      </View>
      <FeedbackModal visible={modalVisible} onClose={() => setModalVisible(false)} handleFeedback={handleFeedback} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    paddingTop: 32,
  },
  videoContainer: {
    width: '90%',
    height: 220,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  hypothesis: {
    marginTop: 16,
    color: '#1e90ff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  recommendation: {
    color: '#43a047',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  exerciseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 8,
  },
  videoError: {
    color: '#c00',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  feedbackQuestion: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
});
