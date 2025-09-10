// src/hooks/useMigration.js
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import storageService from '../services/StorageService'

export function useMigration() {
  const { user } = useAuth()
  const [migrationStatus, setMigrationStatus] = useState('idle')
  const [migrationProgress, setMigrationProgress] = useState(0)

  useEffect(() => {
    const checkAndMigrate = async () => {
      if (!user || !storageService.useSupabase) return
      
      const migrationCompleted = localStorage.getItem('ALH_migration_completed')
      
      if (migrationCompleted === 'true') {
        setMigrationStatus('completed')
        return
      }

      // Perguntar ao usuário se deseja migrar
      const shouldMigrate = window.confirm(
        '🚀 Detectamos dados locais que podem ser migrados para a nuvem.\n\n' +
        'Isso permitirá:\n' +
        '• Acessar seus dados de qualquer dispositivo\n' +
        '• Backup automático\n' +
        '• Sincronização em tempo real\n\n' +
        'Deseja migrar seus dados agora?'
      )

      if (shouldMigrate) {
        setMigrationStatus('migrating')
        setMigrationProgress(0)
        
        try {
          await storageService.migrateLocalDataToSupabase()
          setMigrationStatus('completed')
          setMigrationProgress(100)
          
          alert('✅ Migração concluída com sucesso!')
        } catch (error) {
          setMigrationStatus('error')
          console.error('Erro na migração:', error)
          alert('❌ Erro durante a migração. Seus dados locais foram preservados.')
        }
      }
    }

    checkAndMigrate()
  }, [user])

  return { migrationStatus, migrationProgress }
}