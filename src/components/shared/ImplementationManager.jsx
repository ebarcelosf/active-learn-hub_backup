// Salve este arquivo como: src/components/shared/ImplementationManager.jsx

import React, { useState } from 'react';
import { ModalForm } from './FormComponents';

export function ImplementationManager({ 
  implementation = {}, 
  onUpdate,
  title = "Implementation Plan", 
  description = "Como será construído e implementado" 
}) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  function updateField(field, value) {
    onUpdate(field, value);
  }

  // Gerenciar steps da implementação
  function addStep(formData) {
    const newStep = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      dependencies: formData.dependencies ? formData.dependencies.split(',').map(d => d.trim()) : [],
      responsible: formData.responsible,
      resources: formData.resources,
      status: 'planned',
      createdAt: new Date().toISOString()
    };
    
    const currentSteps = implementation.steps || [];
    onUpdate('steps', [...currentSteps, newStep]);
    setShowStepForm(false);
  }

  function updateStep(id, formData) {
    const currentSteps = implementation.steps || [];
    const updatedSteps = currentSteps.map(step => 
      step.id === id ? { 
        ...step, 
        ...formData,
        dependencies: formData.dependencies ? formData.dependencies.split(',').map(d => d.trim()) : [],
        updatedAt: new Date().toISOString() 
      } : step
    );
    onUpdate('steps', updatedSteps);
    setEditingStep(null);
  }

  function removeStep(id) {
    const currentSteps = implementation.steps || [];
    onUpdate('steps', currentSteps.filter(step => step.id !== id));
  }

  function toggleStepStatus(id) {
    const currentSteps = implementation.steps || [];
    const updatedSteps = currentSteps.map(step => 
      step.id === id ? { 
        ...step, 
        status: step.status === 'completed' ? 'planned' : 'completed',
        completedAt: step.status === 'planned' ? new Date().toISOString() : null
      } : step
    );
    onUpdate('steps', updatedSteps);
  }

  // Calcular estatísticas
  const steps = implementation.steps || [];
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const stats = {
    hasOverview: !!(implementation.overview || '').trim(),
    hasStakeholders: !!(implementation.stakeholders || '').trim(),
    hasRisks: !!(implementation.risks || '').trim(),
    hasTimeline: totalSteps > 0
  };

  const completionPercentage = Math.round(
    [stats.hasOverview, stats.hasStakeholders, stats.hasRisks, stats.hasTimeline]
      .filter(Boolean).length / 4 * 100
  );

  const tabs = [
    { id: 'timeline', label: 'Cronograma', icon: '📅', completed: stats.hasTimeline, count: totalSteps },
    { id: 'overview', label: 'Visão Geral', icon: '📋', completed: stats.hasOverview },
    { id: 'stakeholders', label: 'Stakeholders', icon: '👥', completed: stats.hasStakeholders },
    { id: 'risks', label: 'Riscos', icon: '⚠️', completed: stats.hasRisks }
  ];

  const stepFields = [
    { name: 'title', label: 'Nome da Etapa', placeholder: 'Ex: Desenvolvimento do MVP', required: true },
    { name: 'description', label: 'Descrição', placeholder: 'O que será feito nesta etapa...', type: 'textarea', rows: 3, required: true },
    { name: 'duration', label: 'Duração Estimada', placeholder: 'Ex: 2 semanas, 1 mês...', required: true },
    { name: 'responsible', label: 'Responsável', placeholder: 'Quem será responsável por esta etapa' },
    { name: 'resources', label: 'Recursos Necessários', placeholder: 'Materiais, orçamento, ferramentas...', type: 'textarea', rows: 2 },
    { name: 'dependencies', label: 'Dependências (separadas por vírgula)', placeholder: 'Ex: Aprovação legal, contratação de dev, compra de servidor...' }
  ];

  function getStatusColor(status) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-semibold text-lg text-[var(--text-primary)]">{title}</div>
          <div className="text-[var(--text-muted)] text-sm mt-1">{description}</div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mb-6 flex gap-4 text-sm">
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Completude: </span>
          <span className="font-semibold text-[var(--text-primary)]">{completionPercentage}%</span>
        </div>
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Etapas: </span>
          <span className="font-semibold text-[var(--text-primary)]">{totalSteps}</span>
        </div>
        {totalSteps > 0 && (
          <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
            <span className="text-[var(--text-muted)]">Progresso: </span>
            <span className="font-semibold text-[var(--text-primary)]">{completedSteps}/{totalSteps} ({progressPercentage}%)</span>
          </div>
        )}
      </div>

      {/* Navegação por abas */}
      <div className="mb-6 border-b border-[var(--border-color)]">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--bg-card)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.completed && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  ✓
                </span>
              )}
              {tab.count !== undefined && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="min-h-[300px]">
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)]">Cronograma de Implementação</div>
                <div className="text-sm text-[var(--text-muted)]">Defina as etapas para implementar sua solução</div>
              </div>
              <button 
                onClick={() => setShowStepForm(true)}
                className="px-4 py-2 rounded-lg bg-[var(--cbl-act)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 flex items-center gap-2"
              >
                <span>➕</span>
                Nova Etapa
              </button>
            </div>

            {steps.length === 0 ? (
              <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                <div className="text-4xl mb-3">📅</div>
                <div className="text-lg font-semibold mb-2">Nenhuma etapa criada ainda</div>
                <div className="text-sm mb-4">
                  Crie um cronograma detalhado para implementar sua solução passo a passo.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)] hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={step.status === 'completed'}
                          onChange={() => toggleStepStatus(step.id)}
                          className="mt-1 w-5 h-5 text-[var(--accent-color)] bg-[var(--bg-card)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)] cursor-pointer"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--cbl-act)] text-white flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className={`font-semibold text-lg ${
                                step.status === 'completed' 
                                  ? 'line-through text-[var(--text-muted)]' 
                                  : 'text-[var(--text-primary)]'
                              }`}>
                                {step.title}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getStatusColor(step.status)}`}>
                                  {step.status === 'completed' ? '✅ Concluída' : '⏳ Planejada'}
                                </span>
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-lg">
                                  📅 {step.duration}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-[var(--text-muted)] mb-2 ml-11 leading-relaxed">
                            {step.description}
                          </div>

                          {step.responsible && (
                            <div className="text-xs text-[var(--text-muted)] ml-11">
                              👤 Responsável: {step.responsible}
                            </div>
                          )}

                          {step.dependencies && step.dependencies.length > 0 && (
                            <div className="text-xs text-[var(--text-muted)] ml-11 mt-1">
                              🔗 Dependências: {step.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingStep(step)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200"
                          title="Editar etapa"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--error-color)] hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Remover etapa"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                📋 Visão Geral da Implementação
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Descreva a estratégia geral de implementação da sua solução
              </div>
              <textarea 
                value={implementation.overview || ''}
                onChange={(e) => updateField('overview', e.target.value)}
                placeholder="Descreva sua estratégia de implementação:&#10;&#10;• Qual é a abordagem geral (incremental, big bang, piloto)?&#10;• Como você vai validar cada etapa?&#10;• Quais são os marcos principais?&#10;• Como garantirá qualidade durante o processo?&#10;• Que mecanismos de feedback utilizará?&#10;• Como medirá o progresso?"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'stakeholders' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                👥 Stakeholders e Responsabilidades
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Quem são as pessoas envolvidas e suas responsabilidades?
              </div>
              <textarea 
                value={implementation.stakeholders || ''}
                onChange={(e) => updateField('stakeholders', e.target.value)}
                placeholder="Mapeie os stakeholders:&#10;&#10;• Patrocinador: [Nome/Role] - [Responsabilidades]&#10;• Equipe principal: [Membros] - [Funções]&#10;• Especialistas: [Quem pode ajudar] - [Em que]&#10;• Usuários finais: [Perfil] - [Como serão envolvidos]&#10;• Aprovadores: [Quem precisa aprovar] - [O que]&#10;• Outros interessados: [Grupos afetados] - [Nível de envolvimento]&#10;&#10;Para cada stakeholder, defina claramente o papel e expectativas."
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                ⚠️ Riscos e Contingências
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Que riscos podem impactar a implementação e como mitigá-los?
              </div>
              <textarea 
                value={implementation.risks || ''}
                onChange={(e) => updateField('risks', e.target.value)}
                placeholder="Identifique e planeje para os riscos:&#10;&#10;• Risco técnico: [Descrição] - [Probabilidade] - [Plano de mitigação]&#10;• Risco de recursos: [Descrição] - [Impacto] - [Alternativas]&#10;• Risco de prazo: [Causa potencial] - [Como detectar] - [Ações corretivas]&#10;• Risco de stakeholders: [Resistência] - [Como engajar] - [Comunicação]&#10;• Outros riscos: [Externos, regulatórios, financeiros]&#10;&#10;Para cada risco, defina probabilidade, impacto e plano de contingência."
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      {showStepForm && (
        <ModalForm
          title="Nova Etapa de Implementação"
          fields={stepFields}
          onSubmit={addStep}
          onClose={() => setShowStepForm(false)}
          submitText="Criar Etapa"
        />
      )}

      {editingStep && (
        <ModalForm
          title="Editar Etapa"
          fields={stepFields.map(field => ({
            ...field,
            defaultValue: field.name === 'dependencies' && editingStep.dependencies 
              ? editingStep.dependencies.join(', ')
              : editingStep[field.name] || ''
          }))}
          onSubmit={(formData) => updateStep(editingStep.id, formData)}
          onClose={() => setEditingStep(null)}
          submitText="Salvar Alterações"
        />
      )}
    </div>
  );
}