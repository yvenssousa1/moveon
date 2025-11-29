import * as Notifications from 'expo-notifications';

export async function scheduleSessionReminder(hours: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora do seu treino! 💪',
      body: `Já se passaram ${hours} horas desde sua última sessão. Que tal praticar novamente?`,
    },
    trigger: { seconds: hours * 3600 },
  });
}

export async function scheduleFeedbackCheck(hours: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Como está sua dor?',
      body: `Conte para o ReMuv como está se sentindo após o treino!`,
    },
    trigger: { seconds: hours * 3600 },
  });
}
