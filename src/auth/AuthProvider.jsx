import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUsers, saveStoredUsers, getCurrentUser, setCurrentUser } from './storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  function login(email, password) {
    const users = getStoredUsers();
    const found = users.find(u => u.email === (email || '').trim().toLowerCase());
    if (!found) throw new Error('Usuário não encontrado. Verifique o email ou cadastre-se.');
    if (found.password !== password) throw new Error('Senha incorreta.');

    const publicUser = { name: found.name, email: found.email, role: found.role };
    setUser(publicUser);
    return publicUser;
  }

  function signup({ name, email, password, role = 'Aluno' }) {
    const users = getStoredUsers();
    const normEmail = (email || '').trim().toLowerCase();
    if (users.some(u => u.email === normEmail)) throw new Error('Já existe uma conta com esse email.');

    const toStore = { name: name.trim(), email: normEmail, password, role };
    users.push(toStore);
    saveStoredUsers(users);

    const publicUser = { name: toStore.name, email: toStore.email, role: toStore.role };
    setUser(publicUser);
    return publicUser;
  }

  function logout() {
    setUser(null);
  }

  const value = { user, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
