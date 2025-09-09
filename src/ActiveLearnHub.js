// ActiveLearnHub.js - VERSÃO CORRIGIDA COMPLETA
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { useProjectsState } from './hooks/useProjectsState';
import { saveUserData, loadUserData } from './utils/storage';
import { cblTheme } from './utils/constants';

// Importar componentes
import SettingsScreen from './components/Settings';
import ProjectsScreen from './components/Projects';
import AchievementsScreen from './components/Achievements';
import { CBLScreen } from './components/CBL/CBLScreen';

// Componente de estilos dinâmicos
function RootStyles() { 
  const { theme } = useTheme();
  const dynamicCss = `:root{
    --cbl-primary: ${cblTheme.cblPrimary};
    --cbl-engage: ${cblTheme.cblEngage};
    --cbl-investigate: ${cblTheme.cblInvestigate};
    --cbl-act: ${cblTheme.cblAct};
  }`;
  
  return <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />; 
}

// Componente Header
function Header({ user, screen, setScreen }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b transition-colors duration-300" style={{
      borderColor: 'var(--border-color)',
      backgroundColor: 'var(--bg-card)'
    }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[var(--cbl-primary)] text-white font-semibold shadow">
          AL
        </div>
        <div>
          <div className="text-[var(--text-primary)] font-semibold text-lg">ActiveLearn Hub</div>
          <div className="text-[var(--text-muted)] text-sm">Challenge Based Learning assistant</div>
        </div>
      </div>
      
      <nav className="flex items-center gap-3">
        <NavButton active={screen === 'Projetos'} onClick={() => setScreen('Projetos')}>
          Projetos
        </NavButton>
        <NavButton active={screen === 'CBL'} onClick={() => setScreen('CBL')}>
          CBL
        </NavButton>
        <NavButton active={screen === 'Conquistas'} onClick={() => setScreen('Conquistas')}>
          Conquistas
        </NavButton>
        <NavButton active={screen === 'Configurações'} onClick={() => setScreen('Configurações')}>
          Configurações
        </NavButton>
        {user && <div className="text-[var(--text-muted)] text-sm pl-4">{user.name}</div>}
      </nav>
    </header>
  );
}

// Componente de botão de navegação
function NavButton({ active, onClick, children }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-3 py-2 rounded-md transition-all duration-200 ${
        active 
          ? 'bg-[var(--accent-color)] text-white' 
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
      }`}
    >
      {children}
    </button>
  );
}

// Componente principal
export default function ActiveLearnHub({ user, onLogout }) {
  const { theme } = useTheme();
  const [userData, setUserData] = useState(() => loadUserData());
  const [screen, setScreen] = useState('CBL');
  const [updatedUser, setUpdatedUser] = useState(user);

  // Salvar dados do usuário quando mudarem
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  // Hook de projetos
  const projectsState = useProjectsState(updatedUser || { email: '__anon__' });

  // ✅ CORREÇÃO: Callback para conceder badges (SEM DUPLICAR XP)
  const grantBadge = useCallback((badge) => { 
    setUserData(data => { 
      // Verificar se o badge já existe pelo ID (mais preciso que title)
      const exists = (data.badges || []).some(b => b.id === badge.id); 
      
      if (exists) {
        // ✅ CORREÇÃO: Badge já existe, não fazer nada (antes estava somando XP)
        return data; 
      }
      
      // Badge novo: adicionar à lista
      return { 
        ...data, 
        badges: [...(data.badges || []), badge] 
      }; 
    }); 
  }, []);

  // Callback para atualizar usuário
  const handleUpdateUser = useCallback((newUserData) => {
    setUpdatedUser(newUserData);
  }, []);

  return (
    <>
      <RootStyles />
      <div className="min-h-screen transition-colors duration-300" style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <Header user={updatedUser} screen={screen} setScreen={setScreen} />
        
        <main>
          {screen === 'Projetos' && (
            <ProjectsScreen 
              user={updatedUser} 
              projectsState={projectsState} 
              onNavigate={setScreen} 
            />
          )}
          
          {screen === 'CBL' && (
            <CBLScreen 
              user={updatedUser} 
              projectsState={projectsState} 
              grantBadge={grantBadge} 
            />
          )}
          
          {screen === 'Conquistas' && (
            <AchievementsScreen userData={userData} />
          )}
          
          {screen === 'Configurações' && (
            <SettingsScreen 
              user={updatedUser} 
              onThemeChange={(theme) => {
                // Atualização de tema é gerenciada pelo ThemeContext
                console.log('Tema alterado para:', theme);
              }} 
              onLogout={onLogout}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

// Componente Footer
function Footer() {
  return (
    <footer className="text-center text-sm py-8 transition-colors duration-300" style={{ 
      color: 'var(--text-muted)' 
    }}>
      Prototype • ActiveLearn Hub — sua jornada CBL
    </footer>
  );
}