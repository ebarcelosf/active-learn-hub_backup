import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../contexts/ThemeContext';

function validateEmail(e) {
  return e && e.includes('@') && e.includes('.');
}

export default function SignUpScreen({ onBack }) {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (name.trim().length < 3) return alert('Nome deve ter ao menos 3 caracteres.');
    if (!validateEmail(email)) return alert('Email inválido.');
    if (password.length < 6) return alert('Senha deve ter pelo menos 6 caracteres.');
    if (password !== confirm) return alert('Senhas não coincidem.');

    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 250));
      // Removido o campo role, agora passa apenas name, email e password
      signup({ name, email, password });
    } catch (err) {
      alert(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="max-w-md mx-auto mt-12">
      <div className="p-6 rounded-2xl shadow-lg" style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)'
      }}>
        <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Crie uma conta usando email e senha.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Nome completo
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="seu@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Digite a senha novamente"
              required
            />
          </div>

          <div className="flex gap-3 items-center pt-2">
            <button 
              type="submit"
              className="px-4 py-2 rounded-md font-semibold transition-colors" 
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white'
              }}
              disabled={loading}
            >
              {loading ? 'Criando…' : 'Criar Conta'}
            </button>
            <button 
              type="button" 
              onClick={onBack} 
              className="underline"
              style={{ color: 'var(--accent-color)' }}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}