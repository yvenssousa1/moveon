import React, { useEffect } from 'react';
import { orchestrateIntelligentNotifications } from './utils/intelligentNotifications';
import AppNavigator from './navigation/AppNavigator';
import { ClinicalLogicProvider } from './context/ClinicalLogicContext';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { SessionHistoryProvider } from './context/SessionHistoryContext';
import { UserDataProvider } from './context/UserDataContext';

function App() {
  useEffect(() => {
    orchestrateIntelligentNotifications();
  }, []);
  return (
    <AuthProvider>
      <ProgressProvider>
        <SessionHistoryProvider>
          <UserDataProvider>
            <ClinicalLogicProvider>
              <AppNavigator />
            </ClinicalLogicProvider>
          </UserDataProvider>
        </SessionHistoryProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
