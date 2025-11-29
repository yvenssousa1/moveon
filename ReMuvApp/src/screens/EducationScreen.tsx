
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const microAulas = [
  {
    id: '1',
    titulo: 'O que é dor crônica?',
    conteudo: 'Dor crônica é aquela que persiste por mais de 3 meses, mesmo após a lesão inicial ter cicatrizado. Ela envolve fatores físicos, emocionais e sociais.'
  },
  {
    id: '2',
    titulo: 'Mitos sobre dor',
    conteudo: 'Mito: "Se dói, está machucando mais". Verdade: Dor nem sempre significa dano. O sistema nervoso pode ficar mais sensível.'
  },
  {
    id: '3',
    titulo: 'Como funciona a reabilitação?',
    conteudo: 'A reabilitação moderna foca em movimento gradual, educação e adaptação, não apenas repouso.'
  },
  {
    id: '4',
    titulo: 'Vídeo: O que é dor?',
    conteudo: 'Assista ao vídeo para entender como a dor funciona.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  // Adicione mais micro-aulas conforme necessário
];

const faqs = [
  {
    pergunta: 'Devo parar tudo se sentir dor?',
    resposta: 'Nem sempre. Muitas vezes, manter-se ativo de forma gradual é melhor do que repouso absoluto.'
  },
  {
    pergunta: 'Dor é sempre sinal de lesão?',
    resposta: 'Não. O cérebro pode gerar dor mesmo sem dano físico atual.'
  },
  // Adicione mais FAQs conforme necessário
];

const mitosVerdades = [
  {
    mito: 'Alongar sempre previne lesão.',
    verdade: 'Alongamento é útil, mas não previne todas as lesões. Fortalecimento e controle motor são tão importantes quanto.'
  },
  {
    mito: 'Só melhora quem faz fisioterapia presencial.',
    verdade: 'A adesão ao programa e o acompanhamento remoto também trazem ótimos resultados.'
  },
  // Adicione mais mitos/verdades conforme necessário
];

export default function EducationScreen() {
  const [aulaSelecionada, setAulaSelecionada] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Micro-aulas</Text>
      {microAulas.map(aula => (
        <TouchableOpacity key={aula.id} style={styles.card} onPress={() => setAulaSelecionada(aula.id)}>
          <Text style={styles.cardTitle}>{aula.titulo}</Text>
          {aulaSelecionada === aula.id && (
            <>
              <Text style={styles.cardContent}>{aula.conteudo}</Text>
              {aula.videoUrl && (
                <Video
                  source={{ uri: aula.videoUrl }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay={false}
                  useNativeControls
                  style={{ width: '100%', height: 200, marginTop: 12, borderRadius: 8 }}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      ))}
      <Text style={styles.title}>FAQs</Text>
      {faqs.map((faq, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.cardTitle}>Q: {faq.pergunta}</Text>
          <Text style={styles.cardContent}>A: {faq.resposta}</Text>
        </View>
      ))}
      <Text style={styles.title}>Mitos & Verdades</Text>
      {mitosVerdades.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.cardTitle}>Mito: {item.mito}</Text>
          <Text style={styles.cardContent}>Verdade: {item.verdade}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1e90ff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
  },
});
