class StorageService {
    constructor() {
      this.useSupabase = process.env.REACT_APP_USE_SUPABASE === 'true'
      this.currentUser = null
    }
  
    async init() {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        this.currentUser = session?.user
        
        // Escutar mudanças de autenticação
        supabase.auth.onAuthStateChange((event, session) => {
          this.currentUser = session?.user
        })
      }
    }
  
    // ========== AUTENTICAÇÃO ==========
    
    async login(email, password) {
      if (this.useSupabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password
        })
        
        if (error) throw new Error(error.message)
        
        // Buscar perfil completo
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        return {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || '',
          role: profile?.role || 'Aluno'
        }
      } else {
        // Manter lógica localStorage existente
        const users = JSON.parse(localStorage.getItem('ALH_users') || '[]')
        const found = users.find(u => u.email === email.toLowerCase().trim())
        
        if (!found) throw new Error('Usuário não encontrado')
        if (found.password !== password) throw new Error('Senha incorreta')
        
        const publicUser = { 
          name: found.name, 
          email: found.email, 
          role: found.role 
        }
        localStorage.setItem('ALH_user', JSON.stringify(publicUser))
        return publicUser
      }
    }
  
    async signup({ name, email, password, role = 'Aluno' }) {
      if (this.useSupabase) {
        // Criar usuário no Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: { name, role }
          }
        })
        
        if (error) throw new Error(error.message)
        
        // Criar perfil na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name,
            role
          })
        
        if (profileError) throw new Error(profileError.message)
        
        return {
          id: data.user.id,
          email: data.user.email,
          name,
          role
        }
      } else {
        // Manter lógica localStorage existente
        const users = JSON.parse(localStorage.getItem('ALH_users') || '[]')
        const normEmail = email.toLowerCase().trim()
        
        if (users.some(u => u.email === normEmail)) {
          throw new Error('Já existe uma conta com esse email')
        }
        
        const newUser = { name, email: normEmail, password, role }
        users.push(newUser)
        localStorage.setItem('ALH_users', JSON.stringify(users))
        
        const publicUser = { name, email: normEmail, role }
        localStorage.setItem('ALH_user', JSON.stringify(publicUser))
        return publicUser
      }
    }
  
    async logout() {
      if (this.useSupabase) {
        await supabase.auth.signOut()
      } else {
        localStorage.removeItem('ALH_user')
      }
    }
  
    async getCurrentUser() {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return null
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        return profile
      } else {
        return JSON.parse(localStorage.getItem('ALH_user') || 'null')
      }
    }
  
    // ========== PROJETOS ==========
    
    async saveProject(project) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Não autenticado')
        
        if (project.id) {
          // Atualizar projeto existente
          const { data, error } = await supabase
            .from('projects')
            .update({
              name: project.name,
              description: project.description,
              status: project.status,
              phase_data: project.phase_data || project.phases,
              tags: project.tags,
              progress_percentage: project.progress
            })
            .eq('id', project.id)
            .eq('user_id', session.user.id)
            .select()
            .single()
          
          if (error) throw error
          return data
        } else {
          // Criar novo projeto
          const { data, error } = await supabase
            .from('projects')
            .insert({
              user_id: session.user.id,
              name: project.name,
              description: project.description,
              status: project.status || 'active',
              phase_data: project.phase_data || project.phases,
              tags: project.tags || [],
              progress_percentage: project.progress || 0
            })
            .select()
            .single()
          
          if (error) throw error
          return data
        }
      } else {
        // Lógica localStorage existente
        const user = JSON.parse(localStorage.getItem('ALH_user') || '{}')
        const projects = JSON.parse(localStorage.getItem(`ALH_projects_${user.email}`) || '[]')
        
        if (project.id) {
          const index = projects.findIndex(p => p.id === project.id)
          if (index !== -1) projects[index] = project
        } else {
          project.id = `proj_${Date.now()}`
          projects.push(project)
        }
        
        localStorage.setItem(`ALH_projects_${user.email}`, JSON.stringify(projects))
        return project
      }
    }
  
    async getProjects() {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return []
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })
        
        if (error) {
          console.error('Erro ao buscar projetos:', error)
          return []
        }
        
        // Mapear para formato esperado pela aplicação
        return data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          phases: p.phase_data,
          tags: p.tags,
          progress: p.progress_percentage,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }))
      } else {
        const user = JSON.parse(localStorage.getItem('ALH_user') || '{}')
        return JSON.parse(localStorage.getItem(`ALH_projects_${user.email}`) || '[]')
      }
    }
  
    async deleteProject(projectId) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Não autenticado')
        
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId)
          .eq('user_id', session.user.id)
        
        if (error) throw error
      } else {
        const user = JSON.parse(localStorage.getItem('ALH_user') || '{}')
        const projects = JSON.parse(localStorage.getItem(`ALH_projects_${user.email}`) || '[]')
        const filtered = projects.filter(p => p.id !== projectId)
        localStorage.setItem(`ALH_projects_${user.email}`, JSON.stringify(filtered))
      }
    }
  
    // ========== ATIVIDADES/NUDGES ==========
    
    async saveActivity(activity) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Não autenticado')
        
        const activityData = {
          project_id: activity.projectId,
          user_id: session.user.id,
          phase: activity.phase,
          category: activity.category,
          activity_id: activity.activityId,
          title: activity.title,
          detail: activity.detail,
          completed: activity.completed,
          completed_at: activity.completed ? new Date().toISOString() : null,
          notes: activity.notes,
          attachments: activity.attachments || []
        }
        
        if (activity.id) {
          const { data, error } = await supabase
            .from('activities')
            .update(activityData)
            .eq('id', activity.id)
            .select()
            .single()
          
          if (error) throw error
          return data
        } else {
          const { data, error } = await supabase
            .from('activities')
            .insert(activityData)
            .select()
            .single()
          
          if (error) throw error
          return data
        }
      } else {
        // Implementar lógica localStorage se necessário
        return activity
      }
    }
  
    async getActivities(projectId) {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Erro ao buscar atividades:', error)
          return []
        }
        
        return data
      } else {
        // Implementar lógica localStorage se necessário
        return []
      }
    }
  
    // ========== BADGES/CONQUISTAS ==========
    
    async saveBadge(badge) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Não autenticado')
        
        const { data, error } = await supabase
          .from('badges')
          .insert({
            user_id: session.user.id,
            badge_id: badge.id,
            title: badge.title,
            description: badge.desc,
            icon: badge.icon,
            xp: badge.xp,
            category: badge.category || 'special',
            metadata: badge.metadata || {}
          })
          .select()
          .single()
        
        if (error && error.code !== '23505') { // Ignorar erro de duplicação
          throw error
        }
        
        // Atualizar XP total no perfil
        await this.updateUserXP(badge.xp)
        
        return data
      } else {
        // Lógica localStorage existente
        const data = JSON.parse(localStorage.getItem('ALH_data') || '{"badges":[]}')
        
        if (!data.badges.some(b => b.id === badge.id)) {
          badge.earnedAt = new Date().toISOString()
          data.badges.push(badge)
          localStorage.setItem('ALH_data', JSON.stringify(data))
        }
        
        return badge
      }
    }
  
    async getBadges() {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return []
        
        const { data, error } = await supabase
          .from('badges')
          .select('*')
          .eq('user_id', session.user.id)
          .order('earned_at', { ascending: false })
        
        if (error) {
          console.error('Erro ao buscar badges:', error)
          return []
        }
        
        return data.map(b => ({
          id: b.badge_id,
          title: b.title,
          desc: b.description,
          icon: b.icon,
          xp: b.xp,
          earnedAt: b.earned_at
        }))
      } else {
        const data = JSON.parse(localStorage.getItem('ALH_data') || '{"badges":[]}')
        return data.badges || []
      }
    }
  
    async updateUserXP(xpToAdd) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        
        // Buscar XP atual
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp_total, level')
          .eq('id', session.user.id)
          .single()
        
        const newXP = (profile?.xp_total || 0) + xpToAdd
        const newLevel = Math.floor(newXP / 100) + 1
        
        // Atualizar perfil
        await supabase
          .from('profiles')
          .update({
            xp_total: newXP,
            level: newLevel
          })
          .eq('id', session.user.id)
      }
    }
  
    // ========== CONFIGURAÇÕES ==========
    
    async saveSettings(settings) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Não autenticado')
        
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            id: session.user.id,
            theme: settings.theme,
            language: settings.language,
            notifications: settings.notifications,
            privacy: settings.privacy,
            ui_preferences: settings.uiPreferences
          })
        
        if (error) throw error
      } else {
        // Lógica localStorage existente
        localStorage.setItem('ALH_theme', settings.theme || 'dark')
        localStorage.setItem('ALH_fontSize', settings.fontSize || 'medium')
        localStorage.setItem('ALH_notifications', settings.notifications || 'true')
        localStorage.setItem('ALH_language', settings.language || 'pt-BR')
      }
    }
  
    async getSettings() {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return this.getDefaultSettings()
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error || !data) return this.getDefaultSettings()
        
        return {
          theme: data.theme,
          language: data.language,
          notifications: data.notifications,
          privacy: data.privacy,
          uiPreferences: data.ui_preferences
        }
      } else {
        return {
          theme: localStorage.getItem('ALH_theme') || 'dark',
          fontSize: localStorage.getItem('ALH_fontSize') || 'medium',
          notifications: localStorage.getItem('ALH_notifications') === 'true',
          language: localStorage.getItem('ALH_language') || 'pt-BR'
        }
      }
    }
  
    getDefaultSettings() {
      return {
        theme: 'dark',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: false,
          nudges: true,
          achievements: true,
          feedback: true
        },
        privacy: {
          profile_visibility: 'public',
          projects_visibility: 'team',
          achievements_visibility: 'public'
        }
      }
    }
  
    // ========== RECURSOS ==========
    
    async saveResource(resource) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Não autenticado')
        
        const { data, error } = await supabase
          .from('resources')
          .insert({
            project_id: resource.projectId,
            user_id: session.user.id,
            phase: resource.phase,
            type: resource.type,
            title: resource.title,
            description: resource.description,
            url: resource.url,
            content: resource.content,
            metadata: resource.metadata || {},
            tags: resource.tags || []
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } else {
        // Implementar lógica localStorage se necessário
        return resource
      }
    }
  
    async getResources(projectId) {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Erro ao buscar recursos:', error)
          return []
        }
        
        return data
      } else {
        // Implementar lógica localStorage se necessário
        return []
      }
    }
  
    // ========== LOGS DE ATIVIDADE ==========
    
    async logActivity(action, entityType, entityId, metadata = {}) {
      if (this.useSupabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        
        await supabase
          .from('activity_logs')
          .insert({
            user_id: session.user.id,
            action,
            entity_type: entityType,
            entity_id: entityId,
            metadata,
            ip_address: null, // Será preenchido pelo servidor se necessário
            user_agent: navigator.userAgent
          })
      }
    }
  
    // ========== MIGRAÇÃO DE DADOS ==========
    
    async migrateLocalDataToSupabase() {
      if (!this.useSupabase) {
        console.log('Migração só funciona quando Supabase está ativado')
        return
      }
  
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('Usuário precisa estar autenticado para migrar dados')
        return
      }
  
      console.log('🔄 Iniciando migração de dados...')
  
      try {
        // 1. Migrar Projetos
        const user = JSON.parse(localStorage.getItem('ALH_user') || '{}')
        const localProjects = JSON.parse(localStorage.getItem(`ALH_projects_${user.email}`) || '[]')
        
        for (const project of localProjects) {
          console.log(`Migrando projeto: ${project.name}`)
          
          const { error } = await supabase
            .from('projects')
            .insert({
              user_id: session.user.id,
              name: project.name,
              description: project.description,
              status: project.status || 'active',
              phase_data: project.phases,
              tags: project.tags || [],
              progress_percentage: project.progress || 0
            })
          
          if (error && error.code !== '23505') {
            console.error(`Erro ao migrar projeto ${project.name}:`, error)
          }
        }
  
        // 2. Migrar Badges
        const localData = JSON.parse(localStorage.getItem('ALH_data') || '{"badges":[]}')
        const localBadges = localData.badges || []
        
        for (const badge of localBadges) {
          console.log(`Migrando badge: ${badge.title}`)
          
          const { error } = await supabase
            .from('badges')
            .insert({
              user_id: session.user.id,
              badge_id: badge.id,
              title: badge.title,
              description: badge.desc,
              icon: badge.icon,
              xp: badge.xp,
              category: 'special',
              earned_at: badge.earnedAt
            })
          
          if (error && error.code !== '23505') {
            console.error(`Erro ao migrar badge ${badge.title}:`, error)
          }
        }
  
        // 3. Migrar Configurações
        const theme = localStorage.getItem('ALH_theme')
        const fontSize = localStorage.getItem('ALH_fontSize')
        const notifications = localStorage.getItem('ALH_notifications')
        const language = localStorage.getItem('ALH_language')
        
        if (theme || fontSize || notifications || language) {
          console.log('Migrando configurações...')
          
          await supabase
            .from('user_settings')
            .upsert({
              id: session.user.id,
              theme: theme || 'dark',
              language: language || 'pt-BR',
              notifications: {
                email: notifications === 'true',
                push: false,
                nudges: true,
                achievements: true,
                feedback: true
              },
              ui_preferences: {
                fontSize: fontSize || 'medium'
              }
            })
        }
  
        console.log('✅ Migração concluída com sucesso!')
        
        // Opcional: Limpar localStorage após migração bem-sucedida
        // this.clearLocalStorage()
        
      } catch (error) {
        console.error('❌ Erro durante migração:', error)
      }
    }
  
    clearLocalStorage() {
      // Limpar apenas dados migrados, mantendo algumas preferências locais
      const keysToKeep = ['ALH_migration_completed', 'ALH_migration_date']
      const allKeys = Object.keys(localStorage)
      
      allKeys.forEach(key => {
        if (key.startsWith('ALH_') && !keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      })
      
      localStorage.setItem('ALH_migration_completed', 'true')
      localStorage.setItem('ALH_migration_date', new Date().toISOString())
    }
  }
  
  // Criar instância única (Singleton)
  const storageService = new StorageService()
  
  export default storageService