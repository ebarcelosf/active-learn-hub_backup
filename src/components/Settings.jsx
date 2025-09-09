// components/Settings.jsx - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen({ user, onThemeChange, onLogout, onUpdateUser }) {
  const { theme, setThemeMode } = useTheme();
  const [themeMode, setThemeModeLocal] = useState(theme);
  const [fontSize, setFontSize] = useState('medium');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  useEffect(() => {
    setThemeModeLocal(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setThemeModeLocal(newTheme);
    setThemeMode(newTheme);
    onThemeChange && onThemeChange(newTheme);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('ALH_fontSize', fontSize);
      localStorage.setItem('ALH_notifications', notifications);
      localStorage.setItem('ALH_language', language);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.warn('Erro ao salvar configurações:', err);
    }
  };

  const handleUpdateProfile = () => {
    if (!editName.trim()) {
      alert('Nome não pode estar vazio');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('ALH_users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex === -1) {
        alert('Usuário não encontrado');
        return;
      }

      const currentUser = users[userIndex];
      let profileUpdated = false;

      if (editName !== currentUser.name) {
        currentUser.name = editName;
        profileUpdated = true;
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          alert('Nova senha deve ter pelo menos 6 caracteres');
          return;
        }
        if (newPassword !== confirmNewPassword) {
          alert('As novas senhas não coincidem');
          return;
        }
        if (!currentPassword) {
          alert('Digite sua senha atual');
          return;
        }
        
        if (currentUser.password !== currentPassword) {
          alert('Senha atual incorreta');
          return;
        }
        
        currentUser.password = newPassword;
        profileUpdated = true;
      }

      if (profileUpdated) {
        users[userIndex] = currentUser;
        localStorage.setItem('ALH_users', JSON.stringify(users));

        const { password: _, ...updatedUser } = currentUser;
        localStorage.setItem('ALH_user', JSON.stringify(updatedUser));
        
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }
        
        alert('Perfil atualizado com sucesso!');
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowEditProfile(false);
        
        setTimeout(() => window.location.reload(), 500);
      } else {
        alert('Nenhuma alteração detectada');
      }
      
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil: ' + err.message);
    }
  };

  // ✅ FUNÇÃO CORRIGIDA - Remove TODOS os dados do usuário incluindo badges e XP
  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ ATENÇÃO: Esta ação é permanente!\n\nTem certeza que deseja excluir sua conta?\nTodos os seus dados, projetos e conquistas serão perdidos permanentemente.')) {
      if (window.confirm('Esta é sua última chance de cancelar.\n\nRealmente deseja EXCLUIR sua conta?')) {
        try {
          console.log('🔄 Iniciando exclusão de conta para:', user.email);
          
          // 1. Remover usuário da lista de usuários
          const users = JSON.parse(localStorage.getItem('ALH_users') || '[]');
          const filteredUsers = users.filter(u => u.email !== user.email);
          localStorage.setItem('ALH_users', JSON.stringify(filteredUsers));
          
          // 2. Remover chaves específicas do usuário (projetos, etc.)
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('ALH_') && key.includes(user.email)) {
              console.log('🗑️ Removendo chave específica:', key);
              localStorage.removeItem(key);
            }
          });
          
          // 3. ✅ CORREÇÃO: Remover dados genéricos que contêm informações do usuário atual
          // Lista de chaves genéricas que devem ser limpas na exclusão da conta
          const genericKeysToRemove = [
            'ALH_data',        // 🎯 BADGES E XP
            'ALH_user',        // Dados do usuário logado
            'ALH_theme',       // Tema do usuário
            'ALH_fontSize',    // Configurações de fonte
            'ALH_notifications', // Configurações de notificação
            'ALH_language',    // Idioma
            'ALH_settings'     // Outras configurações
          ];
          
          genericKeysToRemove.forEach(key => {
            if (localStorage.getItem(key)) {
              console.log('🗑️ Removendo chave genérica:', key);
              localStorage.removeItem(key);
            }
          });
          
          // 4. ✅ LIMPEZA ADICIONAL: Remover qualquer outra chave relacionada ao ActiveLearn Hub
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('ALH_')) {
              console.log('🧹 Limpeza final - removendo:', key);
              localStorage.removeItem(key);
            }
          });
          
          console.log('✅ Exclusão de conta concluída');
          alert('Conta excluída com sucesso. Todos os dados foram removidos.');
          onLogout();
          
        } catch (err) {
          console.error('❌ Erro ao excluir conta:', err);
          alert('Erro ao excluir conta: ' + err.message);
        }
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">⚙️ Configurações</h2>
        <p className="text-[var(--text-muted)]">Personalize sua experiência no ActiveLearn Hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações de Aparência */}
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)] flex items-center justify-center">
              🎨
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Aparência</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm text-[var(--text-muted)] font-medium mb-2 block">🎨 Tema</label>
              <select 
                value={themeMode} 
                onChange={(e) => handleThemeChange(e.target.value)} 
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200"
              >
                <option value="dark">🌙 Escuro (recomendado)</option>
                <option value="light">☀️ Claro</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[var(--text-muted)] font-medium mb-2 block">📝 Tamanho da fonte</label>
              <select 
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200"
              >
                <option value="small">🔤 Pequena</option>
                <option value="medium">🔤 Média</option>
                <option value="large">🔤 Grande</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[var(--text-muted)] font-medium mb-2 block">🌍 Idioma</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200"
              >
                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                <option value="en-US">🇺🇸 English (US)</option>
                <option value="es-ES">🇪🇸 Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configurações de Notificação */}
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              🔔
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Notificações</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)] mb-1 block">Notificações Push</label>
                <p className="text-xs text-[var(--text-muted)]">Receber lembretes de atividades</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color)]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="text-sm text-[var(--text-muted)]">
                🔒 Suas configurações são armazenadas apenas no seu dispositivo para máxima privacidade.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleSave} 
          className="px-8 py-4 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          💾 Salvar Configurações
        </button>
        <button 
          onClick={() => {
            setEditName(user?.name || '');
            setShowEditProfile(true);
          }} 
          className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          ✏️ Editar Perfil
        </button>
        <button 
          onClick={onLogout} 
          className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          🚪 Sair da Conta
        </button>
      </div>

      {/* Informações do usuário */}
      {user && (
        <div className="mt-8 bg-[var(--bg-card)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[var(--text-primary)]">{user.name || 'Usuário'}</h4>
                <p className="text-[var(--text-muted)]">{user.email}</p>
                <p className="text-sm text-[var(--text-muted)]">Membro desde {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDeleteAccount(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200"
            >
              🗑️ Excluir Conta
            </button>
          </div>
        </div>
      )}

      {/* Modais */}
      {showEditProfile && (
        <EditProfileModal 
          user={user}
          editName={editName}
          setEditName={setEditName}
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmNewPassword={confirmNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          onClose={() => {
            setShowEditProfile(false);
            setEditName(user?.name || '');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
          }}
          onSave={handleUpdateProfile}
        />
      )}

      {showDeleteAccount && (
        <DeleteAccountModal 
          onClose={() => setShowDeleteAccount(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}

function EditProfileModal({ user, editName, setEditName, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] p-6 rounded-xl w-full max-w-lg shadow-lg border border-[var(--border-color)]">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">✏️ Editar Perfil</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Nome</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)]"
            />
          </div>

          <div className="border-t border-[var(--border-color)] pt-4">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Alterar Senha (opcional)</label>
            
            <div className="space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Senha atual"
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)]"
              />
              
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha (mínimo 6 caracteres)"
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)]"
              />
              
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirmar nova senha"
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] p-6 rounded-xl w-full max-w-md shadow-lg border border-[var(--border-color)]">
        <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Excluir Conta</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-[var(--text-primary)] font-medium mb-2">Atenção! Esta ação é PERMANENTE!</p>
            <p className="text-sm text-[var(--text-muted)]">
              Todos os seus dados, projetos, badges e conquistas serão perdidos para sempre e não poderão ser recuperados.
            </p>
          </div>

          <div className="text-center py-2">
            <p className="text-lg font-medium text-[var(--text-primary)]">
              Tem certeza que deseja excluir sua conta?
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Sim, Excluir Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}