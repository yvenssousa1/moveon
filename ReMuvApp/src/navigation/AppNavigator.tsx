import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import GamificationScreen from '../screens/GamificationScreen';
import PaywallScreen from '../screens/PaywallScreen';
import SmartGoalsScreen from '../screens/SmartGoalsScreen';
import DailyReportScreen from '../screens/DailyReportScreen';
import EducationScreen from '../screens/EducationScreen';
import ConsentScreen from '../screens/ConsentScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';

const Tab = createBottomTabNavigator();

  const [onboarded, setOnboarded] = useState(false);
  const { state } = useAuth();

  if (!state.user) {
    return <LoginScreen />;
  }
  if (!onboarded) {
    return <OnboardingScreen onFinish={() => setOnboarded(true)} />;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Player" component={PlayerScreen} />
        <Tab.Screen name="Gamificação" component={GamificationScreen} />
        <Tab.Screen name="Paywall" component={PaywallScreen} />
        <Tab.Screen name="Evolução" component={require('../screens/ProgressChartScreen').default} />
        <Tab.Screen name="Avançado" component={require('../screens/AdvancedProgressChartScreen').default} />
        <Tab.Screen name="Histórico" component={require('../screens/SessionHistoryScreen').default} />
        <Tab.Screen name="Objetivos" component={SmartGoalsScreen} />
        <Tab.Screen name="Auto-relato" component={DailyReportScreen} />
        <Tab.Screen name="Educação" component={EducationScreen} />
        <Tab.Screen name="Perfil" component={require('../screens/ProfileScreen').default} />
        <Tab.Screen name="Consentimento" component={ConsentScreen} />
        <Tab.Screen name="Privacidade" component={PrivacyPolicyScreen} />
        <Tab.Screen name="Termos de Uso" component={TermsOfUseScreen} />
        {/* Futuras abas: ... */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
