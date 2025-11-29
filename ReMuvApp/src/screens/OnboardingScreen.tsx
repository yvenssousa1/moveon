import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { protocols } from '../protocols/protocols';
import { useClinicalLogic } from '../context/ClinicalLogicContext';
import { useUserData } from '../context/UserDataContext';

const onboardingSteps = [
  {
    title: 'Bem-vindo ao ReMuv',
    description: 'Seu app premium de reabilitação. Vamos personalizar sua experiência!',
  },
  {
    title: 'Consentimento e Privacidade',
    description: 'Para usar o ReMuv, é necessário concordar com o tratamento de dados para personalização, acompanhamento clínico e segurança. Seus dados são protegidos pela LGPD. Leia e aceite para continuar.',
    consent: true,
  },
  {
    title: 'Selecione a área de dor principal',
    description: 'Escolha uma das áreas para personalizar seu protocolo.',
    area: true,
  },
  {
    title: 'Qual seu nível de dor?',
    description: 'Deslize para indicar sua dor atual.',
    slider: true,
  },
  {
    title: 'Quais equipamentos você tem disponível?',
    description: 'Selecione os ícones dos equipamentos.',
    icons: true,
  },
  {
    title: 'Dados bioantropométricos',
    description: 'Informe sua idade, peso e altura.',
    form: true,
  },
  {
    title: 'Qual seu objetivo principal?',
    description: 'Ex: Aliviar dor, melhorar amplitude, etc.',
    goals: true,
  },
];

export default function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState('joelho');
  const [objetivos, setObjetivos] = useState('');
  const [equipamentos, setEquipamentos] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const { setMainPain } = useClinicalLogic();
  const { setUserData } = useUserData();

  const nextStep = () => {
    if (onboardingSteps[step].area) {
      setMainPain(selectedArea);
    }
    if (onboardingSteps[step].goals) {
      setUserData({ objetivos: objetivos ? objetivos.split(',').map(s => s.trim()) : [] });
    }
    if (onboardingSteps[step].icons) {
      setUserData({ equipamentos: equipamentos ? equipamentos.split(',').map(s => s.trim()) : [] });
    }
    if (onboardingSteps[step].form) {
      setUserData({
        idade: idade ? parseInt(idade) : undefined,
        peso: peso ? parseFloat(peso) : undefined,
        altura: altura ? parseFloat(altura) : undefined,
      });
    }
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const skipStep = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const [consentAccepted, setConsentAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{onboardingSteps[step].title}</Text>
        <Text style={styles.description}>{onboardingSteps[step].description}</Text>
        {onboardingSteps[step].consent && (
          <>
            <Text style={{ fontSize: 15, marginVertical: 8, color: '#444', textAlign: 'center' }}>
              Ao continuar, você concorda com nosso
              <Text style={{ color: '#1e90ff' }} onPress={() => onFinish && onFinish('Consentimento')}> Consentimento</Text>,
              <Text style={{ color: '#1e90ff' }} onPress={() => onFinish && onFinish('Privacidade')}> Política de Privacidade</Text> e
              <Text style={{ color: '#1e90ff' }} onPress={() => onFinish && onFinish('Termos de Uso')}> Termos de Uso</Text>.
            </Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
              onPress={() => setConsentAccepted(!consentAccepted)}
            >
              <View style={{ width: 22, height: 22, borderWidth: 2, borderColor: '#1e90ff', borderRadius: 6, marginRight: 8, backgroundColor: consentAccepted ? '#1e90ff' : '#fff' }} />
              <Text style={{ color: '#333', fontSize: 15 }}>Li e aceito os termos acima</Text>
            </TouchableOpacity>
          </>
        )}
        {onboardingSteps[step].area && (
          <View style={{ flexDirection: 'row', marginVertical: 16 }}>
            {Object.keys(protocols).map(area => (
              <TouchableOpacity
                key={area}
                style={{
                  backgroundColor: selectedArea === area ? '#1e90ff' : '#eee',
                  borderRadius: 12,
                  padding: 12,
                  marginHorizontal: 6,
                }}
                onPress={() => setSelectedArea(area)}
              >
                <Text style={{ color: selectedArea === area ? '#fff' : '#333', fontWeight: 'bold' }}>{area.charAt(0).toUpperCase() + area.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {onboardingSteps[step].goals && (
          <TextInput
            style={styles.input}
            placeholder="Digite seus objetivos separados por vírgula (opcional)"
            value={objetivos}
            onChangeText={setObjetivos}
          />
        )}
        {onboardingSteps[step].icons && (
          <TextInput
            style={styles.input}
            placeholder="Equipamentos disponíveis (ex: faixa, halter, bola) - opcional"
            value={equipamentos}
            onChangeText={setEquipamentos}
          />
        )}
        {onboardingSteps[step].form && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Idade (opcional)"
              value={idade}
              onChangeText={setIdade}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Peso em kg (opcional)"
              value={peso}
              onChangeText={setPeso}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Altura em cm (opcional)"
              value={altura}
              onChangeText={setAltura}
              keyboardType="numeric"
            />
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, { opacity: onboardingSteps[step].consent && !consentAccepted ? 0.5 : 1 }]}
          onPress={() => {
            if (onboardingSteps[step].consent && !consentAccepted) return;
            nextStep();
          }}
          disabled={onboardingSteps[step].consent && !consentAccepted}
        >
          <Text style={styles.buttonText}>{step === onboardingSteps.length - 1 ? 'Finalizar' : 'Próximo'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc', marginTop: 8 }]} onPress={skipStep}>
          <Text style={[styles.buttonText, { color: '#333' }]}>Pular</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
