// src/utils/intelligentNotifications.ts
import * as Notifications from 'expo-notifications';
import { getUserProgress, getLastDailyReport, getPendingGoals } from '../context/UserDataContext';

// Agendar notificação se usuário não preencheu auto-relato até certo horário
export async function scheduleDailyReportReminder(hour = 20) {
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hour, 0, 0, 0);
  if (now > trigger) trigger.setDate(trigger.getDate() + 1);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete ReMuv',
      body: 'Não esqueça de preencher seu auto-relato de hoje!',
    },
    trigger,
  });
}

// Agendar notificação se usuário não assistiu micro-aula na semana
export async function scheduleEducationReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Dica ReMuv',
      body: 'Que tal assistir uma micro-aula para aprender mais sobre dor e reabilitação?',
    },
    trigger: { weekday: 6, hour: 18, minute: 0, repeats: true }, // Sábado 18h
  });
}

// Agendar notificação de resumo semanal
export async function scheduleWeeklySummary() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Seu progresso na semana',
      body: 'Veja seu resumo semanal e conquistas no ReMuv!',
    },
    trigger: { weekday: 7, hour: 10, minute: 0, repeats: true }, // Domingo 10h
  });
}

// Função para orquestrar notificações inteligentes
export async function orchestrateIntelligentNotifications() {
  await scheduleDailyReportReminder();
  await scheduleEducationReminder();
  await scheduleWeeklySummary();
}
