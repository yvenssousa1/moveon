import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useClinicalLogic } from '../context/ClinicalLogicContext';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  handleFeedback?: (feedback: string) => void;
}


  const { addFeedback, updateHypothesis } = useClinicalLogic();
  // Se handleFeedback for passado via props, usa ele; senão, usa o padrão
  const handleFeedbackInternal = (feedback: string) => {
    if (typeof handleFeedback === 'function') {
      handleFeedback(feedback);
    } else {
      addFeedback(feedback);
      if (feedback === 'Dor') {
        updateHypothesis('Hipótese: Exercício mais leve');
      } else if (feedback === 'Fácil') {
        updateHypothesis('Hipótese: Avançar exercício');
      }
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Como foi a execução?</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleFeedbackInternal('Fácil')}>
            <Text style={styles.buttonText}>Fácil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleFeedbackInternal('Dor')}>
            <Text style={styles.buttonText}>Senti dor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleFeedbackInternal('Difícil')}>
            <Text style={styles.buttonText}>Difícil, mas consegui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  close: {
    marginTop: 16,
  },
  closeText: {
    color: '#888',
    fontSize: 14,
  },
});
