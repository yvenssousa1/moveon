
# ReMuv (Premium)

Aplicativo de reabilitação premium, inspirado no Freeletics, com lógica clínica adaptativa, onboarding imersivo, player de vídeo, gamificação estratégica, paywall, micro-aulas, notificações inteligentes e privacidade LGPD.

## Principais Features
- Onboarding detalhado, com consentimento obrigatório e integração de objetivos SMART, equipamentos e dados clínicos
- Player de vídeo com feedback adaptativo
- Gamificação avançada: badges, desafios semanais, streak, níveis e recompensas simbólicas
- Micro-aulas educativas, FAQs e mitos/verdades sobre dor e reabilitação (com vídeos)
- Auto-relato diário de dor, função e humor, com lembrete automático
- Objetivos SMART: cadastro, revisão e acompanhamento
- Notificações inteligentes: lembretes de auto-relato, micro-aulas e resumo semanal de progresso
- Paywall premium (planos e monetização)
- Lógica clínica adaptativa e protocolos dinâmicos
- Telas de consentimento, política de privacidade e termos de uso (LGPD/GDPR), integradas ao onboarding e perfil
- Integração com assets remotos (vídeos, imagens)

## Tecnologias
- React Native (Expo)
- TypeScript
- Styled Components
- Context API
- Expo Notifications

## Como rodar
```sh
cd ReMuvApp
npm install
npm start
```

## Instruções para desenvolvimento
- Todas as melhorias e novas features devem ser aplicadas na pasta `ReMuvApp`.
- Sempre atualizar este README após cada feature relevante.
- Para testar notificações, use Expo Go no dispositivo físico.
- Para testar onboarding, apague os dados do app ou reinstale.

---

> Estrutura criada via `npx create-expo-app ReMuvApp --template tabs` para garantir navegação moderna e escalabilidade.
