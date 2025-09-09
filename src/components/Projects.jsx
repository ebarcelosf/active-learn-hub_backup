// components/Projects.jsx
import React, { useState } from 'react';

export default function ProjectsScreen({ user, projectsState, onNavigate }) {
  const { 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    createProject, 
    editProject, 
    deleteProject, 
    duplicateProject 
  } = projectsState;
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleCreateProject = () => {
    if (formData.name.trim()) {
      createProject(formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const handleEditProject = () => {
    if (formData.name.trim() && editingProject) {
      editProject(editingProject.id, formData);
      setFormData({ name: '', description: '' });
      setShowEditForm(false);
      setEditingProject(null);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description || '' });
    setShowEditForm(true);
  };

  const closeEditModal = () => {
    setShowEditForm(false);
    setEditingProject(null);
    setFormData({ name: '', description: '' });
  };

  const handleOpenProject = (projectId) => {
    setActiveProjectId(projectId);
    if (onNavigate) {
      onNavigate('CBL');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProjectProgress = (project) => {
    const phases = [project.Engage, project.Investigate, project.Act];
    const completed = phases.filter(phase => phase.completed).length;
    return Math.round((completed / phases.length) * 100);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">📂 Meus Projetos CBL</h2>
          <p className="text-[var(--text-muted)]">Gerencie todos os seus projetos de Challenge Based Learning</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          ➕ Novo Projeto
        </button>
      </div>

      {/* Formulário de Criação */}
      {showCreateForm && (
        <ProjectFormModal
          title="Criar Novo Projeto"
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowCreateForm(false);
            setFormData({ name: '', description: '' });
          }}
          onSave={handleCreateProject}
        />
      )}

      {/* Formulário de Edição */}
      {showEditForm && editingProject && (
        <ProjectFormModal
          title="Editar Projeto"
          formData={formData}
          setFormData={setFormData}
          onClose={closeEditModal}
          onSave={handleEditProject}
        />
      )}

      {/* Lista de Projetos */}
      {projects.length === 0 ? (
        <EmptyProjectsState onCreateNew={() => setShowCreateForm(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={project.id === activeProjectId}
              progress={getProjectProgress(project)}
              onOpen={() => handleOpenProject(project.id)}
              onEdit={() => openEditModal(project)}
              onDuplicate={() => duplicateProject(project.id)}
              onDelete={() => {
                if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
                  deleteProject(project.id);
                }
              }}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectFormModal({ title, formData, setFormData, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] p-6 rounded-xl w-full max-w-lg shadow-lg border border-[var(--border-color)]">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Nome do Projeto</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Sustentabilidade no Campus"
              className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Descrição (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Breve descrição do que este projeto pretende abordar..."
              rows={3}
              className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!formData.name.trim()}
            className="px-6 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {title.includes('Criar') ? 'Criar Projeto' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyProjectsState({ onCreateNew }) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-4xl mx-auto mb-4">
        📂
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Nenhum projeto ainda</h3>
      <p className="text-[var(--text-muted)] mb-6">Crie seu primeiro projeto CBL para começar!</p>
      <button
        onClick={onCreateNew}
        className="px-6 py-3 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold transition-all duration-200"
      >
        ➕ Criar Primeiro Projeto
      </button>
    </div>
  );
}

function ProjectCard({ project, isActive, progress, onOpen, onEdit, onDuplicate, onDelete, formatDate }) {
  return (
    <div
      className={`bg-[var(--bg-card)] p-6 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
        isActive ? 'ring-2 ring-[var(--accent-color)] border-[var(--accent-color)]' : 'border-[var(--border-color)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-[var(--text-primary)]">{project.name}</h3>
            <button
              onClick={onEdit}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors duration-200"
              title="Editar projeto"
            >
              ✏️
            </button>
          </div>
          {project.description && (
            <p className="text-sm text-[var(--text-muted)] mb-3">{project.description}</p>
          )}
        </div>
        {isActive && (
          <div className="ml-2 px-2 py-1 bg-[var(--accent-color)] text-white text-xs rounded-lg font-medium">
            Ativo
          </div>
        )}
      </div>

      {/* Progresso */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[var(--text-muted)]">Progresso</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">{progress}%</span>
        </div>
        <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
          <div
            className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status das Fases */}
      <div className="flex gap-2 mb-4">
        <div className={`flex-1 text-center py-1 px-2 rounded text-xs font-medium ${
          project.Engage.completed ? 'bg-[var(--cbl-engage)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
        }`}>
          Engage
        </div>
        <div className={`flex-1 text-center py-1 px-2 rounded text-xs font-medium ${
          project.Investigate.completed ? 'bg-[var(--cbl-investigate)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
        }`}>
          Investigate
        </div>
        <div className={`flex-1 text-center py-1 px-2 rounded text-xs font-medium ${
          project.Act.completed ? 'bg-[var(--cbl-act)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
        }`}>
          Act
        </div>
      </div>

      {/* Metadados */}
      <div className="text-xs text-[var(--text-muted)] mb-4">
        <div>Criado: {formatDate(project.createdAt)}</div>
        <div>Modificado: {formatDate(project.lastModified)}</div>
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        {!isActive && (
          <button
            onClick={onOpen}
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 text-sm font-medium"
          >
            📋 Abrir
          </button>
        )}
        {isActive && (
          <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--success-color)] text-white text-sm font-medium text-center">
            ✔ Em uso
          </div>
        )}
        
        <button
          onClick={onDuplicate}
          className="px-3 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
          title="Duplicar projeto"
        >
          📄
        </button>
        
        <button
          onClick={onDelete}
          className="px-3 py-2 rounded-lg border border-[var(--error-color)] text-[var(--error-color)] hover:bg-[var(--error-color)] hover:text-white transition-all duration-200"
          title="Excluir projeto"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}