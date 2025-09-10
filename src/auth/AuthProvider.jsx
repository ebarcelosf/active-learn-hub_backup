import React, { createContext, useContext, useEffect, useState } from 'react'
import storageService from '../services/StorageService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      await storageService.init()
      const currentUser = await storageService.getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    
    initAuth()
  }, [])

  async function login(email, password) {
    try {
      const user = await storageService.login(email, password)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  async function signup(userData) {
    try {
      const user = await storageService.signup(userData)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    await storageService.logout()
    setUser(null)
  }

  const value = { user, login, signup, logout, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
