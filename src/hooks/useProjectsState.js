// hooks/useProjectsState.js
import { useState, useEffect } from 'react';
import { 
  saveProjectsForUser, 
  loadProjectsForUser, 
  saveActiveProjectForUser, 
  loadActiveProjectForUser 
} from '../utils/storage';
import { defaultPhaseData } from '../utils/constants';

export function useProjectsState(user) {
  const [projects, setProjects] = useState(() => {
    if (!user) return [];
    return loadProjectsForUser(user.email);
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    if (!user) return null;
    const loadedProjects = loadProjectsForUser(user.email);
    const savedActive = loadActiveProjectForUser(user.email);
    if (savedActive && loadedProjects.find(p => p.id === savedActive)) {
      return savedActive;
    }
    return loadedProjects.length > 0 ? loadedProjects[0].id : null;
  });

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  useEffect(() => {
    if (user) {
      saveProjectsForUser(user.email, projects);
    }
  }, [projects, user]);

  useEffect(() => {
    if (user && activeProjectId) {
      saveActiveProjectForUser(user.email, activeProjectId);
    }
  }, [activeProjectId, user]);

  const createProject = (projectData) => {
    const newProject = {
      id: `project_${Date.now()}`,
      name: projectData.name || 'Novo Projeto',
      description: projectData.description || '',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      ...JSON.parse(JSON.stringify(defaultPhaseData))
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    return newProject;
  };

  const updateProject = (projectId, updateFn) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updated = updateFn(JSON.parse(JSON.stringify(project)));
        return { ...updated, lastModified: new Date().toISOString() };
      }
      return project;
    }));
  };

  const editProject = (projectId, newData) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return { 
          ...project, 
          name: newData.name || project.name,
          description: newData.description !== undefined ? newData.description : project.description,
          lastModified: new Date().toISOString() 
        };
      }
      return project;
    }));
  };

  const deleteProject = (projectId) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== projectId);
      if (activeProjectId === projectId && filtered.length > 0) {
        setActiveProjectId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveProjectId(null);
      }
      return filtered;
    });
  };

  const duplicateProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const duplicated = {
        ...JSON.parse(JSON.stringify(project)),
        id: `project_${Date.now()}`,
        name: `${project.name} (Cópia)`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setProjects(prev => [...prev, duplicated]);
      return duplicated;
    }
  };

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    editProject, 
    deleteProject,
    duplicateProject
  };
}