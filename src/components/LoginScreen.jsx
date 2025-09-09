import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../contexts/ThemeContext';
import emailjs from '@emailjs/browser';

// IMPORTANTE: Configure estas credenciais com seus dados reais do EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_jwn1e6b',    // Substitua com seu Service ID real
  TEMPLATE_ID: 'template_vxyv9tf',  // Substitua com seu Template ID real
  PUBLIC_KEY: 'PE8FLDWWyftdGvl_f'   // Substitua com sua Public Key real
};

export default function LoginScreen({ onGoSignUp }) {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para recuperação de senha
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStep, setRecoveryStep] = useState('email');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Inicializar EmailJS apenas uma vez
  useEffect(() => {
    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('EmailJS inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar EmailJS:', error);
    }
  }, []);

  // Função de login
  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) return alert('Preencha email e senha.');
    
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 250));
      login(email, password);
    } catch (err) {
      alert(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  // Gerar código de 6 dígitos
  function generateRecoveryCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Enviar email de recuperação
  async function sendRecoveryEmail() {
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      alert('Digite um email válido');
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se o email existe
      const users = JSON.parse(localStorage.getItem('ALH_users') || '[]');
      const user = users.find(u => u.email === recoveryEmail);
      
      if (!user) {
        alert('Email não cadastrado no sistema');
        setLoading(false);
        return;
      }

      // Gerar código de recuperação
      const code = generateRecoveryCode();
      setRecoveryCode(code);

      // Salvar código com expiração
      const recoveryData = {
        email: recoveryEmail,
        code: code,
        expiresAt: new Date(Date.now() + 900000).toISOString() // 15 minutos
      };
      localStorage.setItem('ALH_recovery', JSON.stringify(recoveryData));

      // Preparar dados para o email - FORMATO CORRETO DO TEMPLATE
      const templateParams = {
        to_email: recoveryEmail,
        to_name: user.name || 'Usuário',
        user_name: user.name || 'Usuário',
        recovery_code: code,
        reply_to: recoveryEmail,
        // Adicione estes campos extras que podem estar no seu template
        from_name: 'ActiveLearn Hub',
        from_email: 'noreply@activelearn.com',
        message: `Seu código de recuperação é: ${code}. Este código expira em 15 minutos.`
      };

      console.log('Tentando enviar email com parâmetros:', templateParams);

      // Enviar email via EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Resposta do EmailJS:', response);

      if (response.status === 200) {
        setEmailSent(true);
        setRecoveryStep('code');
        alert(`✅ Email enviado para ${recoveryEmail}\n\nVerifique sua caixa de entrada e spam.`);
      } else {
        throw new Error('Falha ao enviar email');
      }

    } catch (error) {
      console.error('Erro detalhado ao enviar email:', error);
      
      // Verificar se é erro de configuração
      if (error.text && error.text.includes('The Public Key is invalid')) {
        alert('❌ Erro: Public Key do EmailJS inválida.\n\nVerifique suas credenciais no arquivo.');
      } else if (error.text && error.text.includes('The service ID is invalid')) {
        alert('❌ Erro: Service ID do EmailJS inválido.\n\nVerifique suas credenciais no arquivo.');
      } else if (error.text && error.text.includes('The template ID is invalid')) {
        alert('❌ Erro: Template ID do EmailJS inválido.\n\nVerifique suas credenciais no arquivo.');
      } else {
        // MODO DE DESENVOLVIMENTO - Mostrar código na tela se o envio falhar
        alert(`⚠️ Erro ao enviar email!\n\n📝 Código de recuperação (modo desenvolvimento):\n${recoveryCode}\n\nUse este código para continuar o processo.`);
        setRecoveryStep('code');
        setEmailSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  // Verificar código de recuperação
  function verifyRecoveryCode() {
    const recoveryData = JSON.parse(localStorage.getItem('ALH_recovery') || '{}');
    
    if (!recoveryData.code) {
      alert('Nenhum código de recuperação ativo. Solicite um novo.');
      return;
    }

    if (new Date(recoveryData.expiresAt) < new Date()) {
      alert('Código expirado. Solicite um novo código.');
      localStorage.removeItem('ALH_recovery');
      setRecoveryStep('email');
      return;
    }

    if (userCode !== recoveryData.code) {
      alert('Código incorreto. Verifique e tente novamente.');
      return;
    }

    // Código válido, ir para redefinição de senha
    setRecoveryStep('newPassword');
  }

  // Redefinir senha
  async function resetPassword() {
    if (newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      
      const recoveryData = JSON.parse(localStorage.getItem('ALH_recovery') || '{}');
      
      // Atualizar senha
      const users = JSON.parse(localStorage.getItem('ALH_users') || '[]');
      const userIndex = users.findIndex(u => u.email === recoveryData.email);
      
      if (userIndex === -1) {
        alert('Usuário não encontrado');
        return;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('ALH_users', JSON.stringify(users));

      // Limpar dados de recuperação
      localStorage.removeItem('ALH_recovery');

      // Enviar email de confirmação (opcional)
      try {
        const confirmParams = {
          to_email: recoveryData.email,
          to_name: users[userIndex].name || 'Usuário',
          user_name: users[userIndex].name || 'Usuário',
          message: 'Sua senha foi alterada com sucesso!',
          from_name: 'ActiveLearn Hub',
          reply_to: recoveryData.email
        };
        
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          confirmParams
        );
      } catch (err) {
        console.log('Erro ao enviar confirmação (não crítico):', err);
      }

      alert('✅ Senha alterada com sucesso!\n\nFaça login com sua nova senha.');
      
      // Resetar estados
      setShowForgotPassword(false);
      setRecoveryStep('email');
      setRecoveryCode('');
      setUserCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setRecoveryEmail('');
      setEmail(recoveryData.email); // Preencher email para facilitar login
      
    } catch (err) {
      alert('Erro ao resetar senha: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto mt-12">
      <div className="p-6 rounded-2xl shadow-lg" style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)'
      }}>
        <h2 className="text-2xl font-bold mb-2">Entrar</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Use seu email e senha para acessar sua conta.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="seu@exemplo.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Senha"
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center">
            <button 
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setRecoveryStep('email');
                setEmailSent(false);
                setRecoveryEmail('');
              }}
              className="text-sm underline hover:no-underline transition-all"
              style={{ color: 'var(--accent-color)' }}
              disabled={loading}
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <button 
              type="submit"
              className="px-4 py-2 rounded-md font-semibold transition-colors" 
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white'
              }}
              disabled={loading}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
            <button 
              type="button" 
              onClick={onGoSignUp} 
              className="underline"
              style={{ color: 'var(--accent-color)' }}
              disabled={loading}
            >
              Criar conta
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Recuperação de Senha */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Etapa 1: Solicitar Email */}
            {recoveryStep === 'email' && (
              <>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  📧 Recuperar Senha
                </h3>
                
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Digite seu email cadastrado. Enviaremos um código de recuperação.
                </p>

                <div className="space-y-4">
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="seu@exemplo.com"
                    disabled={loading}
                  />

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setRecoveryEmail('');
                      }}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={sendRecoveryEmail}
                      className="px-6 py-2 rounded-md font-semibold transition-colors"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        color: 'white'
                      }}
                      disabled={loading || !recoveryEmail}
                    >
                      {loading ? 'Enviando...' : 'Enviar Código'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Etapa 2: Verificar Código */}
            {recoveryStep === 'code' && (
              <>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  🔐 Verificar Código
                </h3>
                
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Digite o código de 6 dígitos enviado para {recoveryEmail}
                </p>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full p-3 text-center text-2xl font-mono rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.5em'
                    }}
                    placeholder="000000"
                    maxLength="6"
                    disabled={loading}
                  />

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setRecoveryStep('email');
                        setUserCode('');
                      }}
                      className="text-sm underline"
                      style={{ color: 'var(--accent-color)' }}
                      disabled={loading}
                    >
                      Não recebeu? Enviar novamente
                    </button>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setRecoveryStep('email');
                        setUserCode('');
                      }}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={verifyRecoveryCode}
                      className="px-6 py-2 rounded-md font-semibold transition-colors"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        color: 'white'
                      }}
                      disabled={userCode.length !== 6 || loading}
                    >
                      Verificar
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Etapa 3: Nova Senha */}
            {recoveryStep === 'newPassword' && (
              <>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  🔑 Nova Senha
                </h3>
                
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Código verificado! Agora crie sua nova senha.
                </p>

                <div className="space-y-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Nova senha (mín. 6 caracteres)"
                    disabled={loading}
                  />

                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Confirmar nova senha"
                    disabled={loading}
                  />

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setRecoveryStep('email');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={resetPassword}
                      className="px-6 py-2 rounded-md font-semibold transition-colors"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        color: 'white'
                      }}
                      disabled={loading || !newPassword || !confirmNewPassword}
                    >
                      {loading ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}