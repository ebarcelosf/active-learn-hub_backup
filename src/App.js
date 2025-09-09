import React, { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import ActiveLearnHubAppWrapper from './ActiveLearnHub';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';

function InnerApp() {
  const { user, logout } = useAuth();
  const [screen, setScreen] = useState(user ? 'CBL' : 'Login');

  if (!user) {
    if (screen === 'Login') return <LoginScreen onGoSignUp={() => setScreen('SignUp')} />;
    return <SignUpScreen onBack={() => setScreen('Login')} />;
  }

  return (
    <div className="App min-h-screen transition-colors duration-300" style={{
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <ActiveLearnHubAppWrapper user={user} onLogout={logout} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
