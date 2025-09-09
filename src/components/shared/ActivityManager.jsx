// Salve este arquivo como: src/components/shared/ActivityManager.jsx

import React, { useState } from 'react';
import { ModalForm } from './FormComponents';

export function ActivityManager({ 
  activities = [], 
  onAdd, 
  onUpdate, 
  onRemove, 
  onToggleStatus,
  title = "Atividades de Investigação", 
  description = "Atividades práticas para coletar dados e evidências" 
}) {
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  function addActivity(formData) {
    const newActivity = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority || 'medium',
      estimatedTime: formData.estimatedTime,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      targetQuestions: formData.targetQuestions ? 
        formData.targetQuestions.split(',').map(q => q.trim()).filter(q => q) : [],
      resources: [],
      findings: ''
    };
    
    onAdd(newActivity);
    setShowActivityForm(false);
  }

  function updateActivity(id, formData) {
    const updatedActivity = {
      ...formData,
      targetQuestions: formData.targetQuestions ? 
        formData.targetQuestions.split(',').map(q => q.trim()).filter(q => q) : [],
      updatedAt: new Date().toISOString()
    };
    
    onUpdate(id, updatedActivity);
    setEditingActivity(null);
  }

  function getActivityIcon(type) {
    const icons = {
      'Entrevista': '🎤',
      'Survey': '📋',
      'Observação': '👀',
      'Experimento': '🔬',
      'Análise': '📊',
      'Pesquisa': '📚',
      'Workshop': '👥',
      'Teste': '🧪',
      'Outros': '📝'
    };
    return icons[type] || '📝';
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function formatEstimatedTime(time) {
    if (!time) return 'Não definido';
    if (time.includes('h')) return time;
    return `${time}h`;
  }

  const activityFields = [
    { 
      name: 'title', 
      label: 'Nome da Atividade', 
      placeholder: 'Ex: Entrevista com especialista em sustentabilidade', 
      required: true 
    },
    { 
      name: 'description', 
      label: 'Descrição Detalhada', 
      placeholder: 'Descreva o que será feito, metodologia, objetivos específicos...', 
      type: 'textarea', 
      rows: 3, 
      required: true 
    },
    { 
      name: 'type', 
      label: 'Tipo de Atividade', 
      type: 'select', 
      required: true, 
      options: [
        { value: '', label: 'Selecione...' },
        { value: 'Entrevista', label: '🎤 Entrevista' },
        { value: 'Survey', label: '📋 Survey/Questionário' },
        { value: 'Observação', label: '👀 Observação de Campo' },
        { value: 'Experimento', label: '🔬 Experimento' },
        { value: 'Análise', label: '📊 Análise de Dados' },
        { value: 'Pesquisa', label: '📚 Pesquisa Documental' },
        { value: 'Workshop', label: '👥 Workshop/Grupo Focal' },
        { value: 'Teste', label: '🧪 Teste de Conceito' },
        { value: 'Outros', label: '📝 Outros' }
      ]
    },
    { 
      name: 'priority', 
      label: 'Prioridade', 
      type: 'select', 
      required: true,
      defaultValue: 'medium',
      options: [
        { value: 'high', label: '🔴 Alta - Crítica para o projeto' },
        { value: 'medium', label: '🟡 Média - Importante' },
        { value: 'low', label: '🟢 Baixa - Complementar' }
      ]
    },
    { 
      name: 'estimatedTime', 
      label: 'Tempo Estimado', 
      placeholder: 'Ex: 2h, 1 dia, 1 semana...',
      defaultValue: '2h'
    },
    { 
      name: 'targetQuestions', 
      label: 'Perguntas que Pretende Responder (separadas por vírgula)', 
      placeholder: 'Qual o principal desafio?, Como as pessoas se sentem sobre...?, etc.',
      type: 'textarea',
      rows: 2
    },
    { 
      name: 'findings', 
      label: 'Resultados e Descobertas (preencher após realizar)', 
      placeholder: 'Principais insights, dados coletados, conclusões...', 
      type: 'textarea', 
      rows: 4 
    }
  ];

  // Filtrar atividades
  const filteredActivities = activities.filter(activity => {
    if (filter === 'pending') return activity.status === 'pending';
    if (filter === 'completed') return activity.status === 'completed';
    return true;
  });

  // Ordenar por prioridade e status
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2);
  });

  const completedCount = activities.filter(a => a.status === 'completed').length;
  const pendingCount = activities.filter(a => a.status === 'pending').length;

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold text-lg text-[var(--text-primary)]">{title}</div>
          <div className="text-[var(--text-muted)] text-sm mt-1">{description}</div>
        </div>
        <button 
          onClick={() => setShowActivityForm(true)}
          className="px-4 py-2 rounded-lg bg-[var(--cbl-investigate)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 flex items-center gap-2"
        >
          <span>📋</span>
          Nova Atividade
        </button>
      </div>
      
      {/* Estatísticas e filtros */}
      {activities.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Estatísticas */}
          <div className="flex gap-3 text-sm">
            <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Total: </span>
              <span className="font-semibold text-[var(--text-primary)]">{activities.length}</span>
            </div>
            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <span className="text-green-700">✅ Concluídas: </span>
              <span className="font-semibold text-green-800">{completedCount}</span>
            </div>
            <div className="bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
              <span className="text-yellow-700">⏳ Pendentes: </span>
              <span className="font-semibold text-yellow-800">{pendingCount}</span>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-[var(--accent-color)] text-white' 
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              Todas ({activities.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                filter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                filter === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              Concluídas ({completedCount})
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {sortedActivities.length === 0 ? (
          <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'Nenhuma atividade criada ainda' :
               filter === 'pending' ? 'Nenhuma atividade pendente' :
               'Nenhuma atividade concluída'}
            </div>
            <div className="text-sm mb-4">
              {filter === 'all' ? 
                'Crie atividades como entrevistas, surveys ou observações para coletar dados que respondam suas perguntas de investigação.' :
                filter === 'pending' ? 
                'Todas as atividades foram concluídas! 🎉' :
                'Complete algumas atividades para ver os resultados aqui.'}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              💡 Dica CBL: Diversifique os tipos de atividade para obter perspectivas variadas
            </div>
          </div>
        ) : (
          sortedActivities.map(activity => (
            <div key={activity.id} className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)] hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Checkbox de status */}
                  <input
                    type="checkbox"
                    checked={activity.status === 'completed'}
                    onChange={() => onToggleStatus(activity.id)}
                    className="mt-1 w-5 h-5 text-[var(--accent-color)] bg-[var(--bg-card)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)] cursor-pointer"
                  />
                  
                  <div className="flex-1">
                    {/* Cabeçalho da atividade */}
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className={`font-semibold text-lg ${
                          activity.status === 'completed' 
                            ? 'line-through text-[var(--text-muted)]' 
                            : 'text-[var(--text-primary)]'
                        }`}>
                          {activity.title}
                        </div>
                        <div className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                          {activity.description}
                        </div>
                      </div>
                    </div>

                    {/* Tags de classificação */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] font-medium">
                        {activity.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getPriorityColor(activity.priority)}`}>
                        {activity.priority === 'high' ? '🔴 Alta' : 
                         activity.priority === 'medium' ? '🟡 Média' : 
                         '🟢 Baixa'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {activity.status === 'completed' ? '✅ Concluída' : '⏳ Pendente'}
                      </span>
                      {activity.estimatedTime && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-medium">
                          ⏱️ {formatEstimatedTime(activity.estimatedTime)}
                        </span>
                      )}
                    </div>

                    {/* Perguntas alvo */}
                    {activity.targetQuestions && activity.targetQuestions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-[var(--text-primary)] mb-1">🎯 Perguntas a responder:</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {activity.targetQuestions.map((question, index) => (
                            <div key={index} className="ml-2">• {question}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resultados (se concluída) */}
                    {activity.status === 'completed' && activity.findings && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="text-xs font-medium text-green-800 mb-1">🔍 Descobertas:</div>
                        <div className="text-sm text-green-700 leading-relaxed whitespace-pre-wrap">
                          {activity.findings}
                        </div>
                      </div>
                    )}

                    {/* Metadados */}
                    <div className="text-xs text-[var(--text-muted)] mt-3 flex flex-wrap gap-4">
                      <span>Criada: {new Date(activity.createdAt).toLocaleDateString('pt-BR')}</span>
                      {activity.completedAt && (
                        <span>Concluída: {new Date(activity.completedAt).toLocaleDateString('pt-BR')}</span>
                      )}
                      {activity.updatedAt && (
                        <span>Última atualização: {new Date(activity.updatedAt).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingActivity(activity)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200"
                    title="Editar atividade"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onRemove(activity.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error-color)] hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Remover atividade"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sugestões baseadas no progresso */}
      {activities.length > 0 && (
        <div className="mt-4">
          {completedCount === 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-semibold">💡 Próximo passo:</span> Comece pela atividade de maior prioridade para obter insights valiosos rapidamente!
              </div>
            </div>
          )}
          {completedCount > 0 && pendingCount === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <span className="font-semibold">🎉 Parabéns!</span> Você completou todas as atividades. Agora pode partir para a síntese dos achados!
              </div>
            </div>
          )}
          {completedCount > 0 && pendingCount > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-sm text-amber-800">
                <span className="font-semibold">⚡ Continue assim!</span> Você já tem {completedCount} atividade{completedCount > 1 ? 's' : ''} concluída{completedCount > 1 ? 's' : ''}. Faltam {pendingCount} para completar sua investigação.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para adicionar atividade */}
      {showActivityForm && (
        <ModalForm
          title="Nova Atividade de Investigação"
          fields={activityFields}
          onSubmit={addActivity}
          onClose={() => setShowActivityForm(false)}
          submitText="Criar Atividade"
        />
      )}

      {/* Modal para editar atividade */}
      {editingActivity && (
        <ModalForm
          title="Editar Atividade"
          fields={activityFields.map(field => ({
            ...field,
            defaultValue: field.name === 'targetQuestions' && editingActivity.targetQuestions 
              ? editingActivity.targetQuestions.join(', ')
              : editingActivity[field.name] || field.defaultValue || ''
          }))}
          onSubmit={(formData) => updateActivity(editingActivity.id, formData)}
          onClose={() => setEditingActivity(null)}
          submitText="Salvar Alterações"
        />
      )}
    </div>
  );
}