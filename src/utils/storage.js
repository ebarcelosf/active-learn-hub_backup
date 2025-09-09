export function saveProjectsForUser(email, projects) {
    try {
      localStorage.setItem(`ALH_projects_${email}`, JSON.stringify(projects));
    } catch (e) {
      console.warn('Erro ao salvar projetos:', e);
    }
  }
  
  export function loadProjectsForUser(email) {
    try {
      return JSON.parse(localStorage.getItem(`ALH_projects_${email}`)) || [];
    } catch (e) {
      return [];
    }
  }
  
  export function saveActiveProjectForUser(email, projectId) {
    try {
      localStorage.setItem(`ALH_active_project_${email}`, projectId);
    } catch (e) {
      console.warn('Erro ao salvar projeto ativo:', e);
    }
  }
  
  export function loadActiveProjectForUser(email) {
    try {
      return localStorage.getItem(`ALH_active_project_${email}`) || null;
    } catch (e) {
      return null;
    }
  }
  
  export function saveUserData(data) {
    try {
      localStorage.setItem('ALH_data', JSON.stringify(data));
    } catch (e) {
      console.warn('Erro ao salvar dados do usuário:', e);
    }
  }
  
  export function loadUserData() {
    try {
      return JSON.parse(localStorage.getItem('ALH_data')) || { badges: [] };
    } catch (e) {
      return { badges: [] };
    }
  }
  