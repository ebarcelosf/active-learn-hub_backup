// Salve este arquivo como: src/components/shared/EvaluationManager.jsx

import React, { useState } from 'react';
import { ModalForm } from './FormComponents';

export function EvaluationManager({ 
  evaluation = {}, 
  onUpdate,
  title = "Evaluation Criteria", 
  description = "Como medir o sucesso da solução" 
}) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);

  function updateField(field, value) {
    onUpdate(field, value);
  }

  // Gerenciar métricas
  function addMetric(formData) {
    const newMetric = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      target: formData.target,
      measurement: formData.measurement,
      frequency: formData.frequency,
      responsible: formData.responsible,
      description: formData.description,
      status: 'planned',
      createdAt: new Date().toISOString()
    };
    
    const currentMetrics = evaluation.metrics || [];
    onUpdate('metrics', [...currentMetrics, newMetric]);
    setShowMetricForm(false);
  }

  function updateMetric(id, formData) {
    const currentMetrics = evaluation.metrics || [];
    const updatedMetrics = currentMetrics.map(metric => 
      metric.id === id ? { 
        ...metric, 
        ...formData,
        updatedAt: new Date().toISOString() 
      } : metric
    );
    onUpdate('metrics', updatedMetrics);
    setEditingMetric(null);
  }

  function removeMetric(id) {
    const currentMetrics = evaluation.metrics || [];
    onUpdate('metrics', currentMetrics.filter(metric => metric.id !== id));
  }

  function toggleMetricStatus(id) {
    const currentMetrics = evaluation.metrics || [];
    const updatedMetrics = currentMetrics.map(metric => 
      metric.id === id ? { 
        ...metric, 
        status: metric.status === 'active' ? 'planned' : 'active'
      } : metric
    );
    onUpdate('metrics', updatedMetrics);
  }

  // Calcular estatísticas
  const metrics = evaluation.metrics || [];
  const activeMetrics = metrics.filter(m => m.status === 'active').length;
  const quantitativeMetrics = metrics.filter(m => m.type === 'quantitative').length;
  const qualitativeMetrics = metrics.filter(m => m.type === 'qualitative').length;

  const stats = {
    hasObjectives: !!(evaluation.objectives || '').trim(),
    hasMethodology: !!(evaluation.methodology || '').trim(),
    hasLessonsLearned: !!(evaluation.lessonsLearned || '').trim(),
    hasMetrics: metrics.length > 0
  };

  const completionPercentage = Math.round(
    [stats.hasObjectives, stats.hasMethodology, stats.hasLessonsLearned, stats.hasMetrics]
      .filter(Boolean).length / 4 * 100
  );

  const tabs = [
    { id: 'metrics', label: 'Métricas', icon: '📊', completed: stats.hasMetrics, count: metrics.length },
    { id: 'objectives', label: 'Objetivos', icon: '🎯', completed: stats.hasObjectives },
    { id: 'methodology', label: 'Metodologia', icon: '🔬', completed: stats.hasMethodology },
    { id: 'lessons', label: 'Aprendizados', icon: '💡', completed: stats.hasLessonsLearned }
  ];

  const metricFields = [
    { name: 'name', label: 'Nome da Métrica', placeholder: 'Ex: Taxa de Satisfação do Usuário', required: true },
    { name: 'type', label: 'Tipo', type: 'select', required: true, options: [
      { value: '', label: 'Selecione...' },
      { value: 'quantitative', label: '📊 Quantitativa' },
      { value: 'qualitative', label: '💭 Qualitativa' }
    ]},
    { name: 'target', label: 'Meta/Objetivo', placeholder: 'Ex: 80%, 100 usuários, melhoria significativa...', required: true },
    { name: 'measurement', label: 'Como Medir', placeholder: 'Surveys, analytics, entrevistas, testes...', required: true },
    { name: 'frequency', label: 'Frequência de Medição', placeholder: 'Ex: semanal, mensal, após cada release...' },
    { name: 'responsible', label: 'Responsável', placeholder: 'Quem ficará responsável por esta métrica' },
    { name: 'description', label: 'Descrição Detalhada', placeholder: 'Por que esta métrica é importante? Como interpretar os resultados?', type: 'textarea', rows: 3 }
  ];

  function getMetricTypeIcon(type) {
    return type === 'quantitative' ? '📊' : '💭';
  }

  function getStatusColor(status) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
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
          <span className="text-[var(--text-muted)]">Métricas: </span>
          <span className="font-semibold text-[var(--text-primary)]">{metrics.length}</span>
        </div>
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Ativas: </span>
          <span className="font-semibold text-green-600">{activeMetrics}</span>
        </div>
        {metrics.length > 0 && (
          <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
            <span className="text-[var(--text-muted)]">Mix: </span>
            <span className="font-semibold text-[var(--text-primary)]">{quantitativeMetrics}Q + {qualitativeMetrics}L</span>
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
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)]">Métricas de Sucesso</div>
                <div className="text-sm text-[var(--text-muted)]">Defina como medirá o sucesso da sua solução</div>
              </div>
              <button 
                onClick={() => setShowMetricForm(true)}
                className="px-4 py-2 rounded-lg bg-[var(--cbl-act)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 flex items-center gap-2"
              >
                <span>📈</span>
                Nova Métrica
              </button>
            </div>

            {metrics.length === 0 ? (
              <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-lg font-semibold mb-2">Nenhuma métrica definida ainda</div>
                <div className="text-sm mb-4">
                  Crie métricas quantitativas e qualitativas para avaliar o sucesso da sua solução.
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  💡 Dica: Combine métricas objetivas (números) com subjetivas (percepções)
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.map(metric => (
                  <div key={metric.id} className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)] hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={metric.status === 'active'}
                          onChange={() => toggleMetricStatus(metric.id)}
                          className="mt-1 w-5 h-5 text-[var(--accent-color)] bg-[var(--bg-card)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)] cursor-pointer"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{getMetricTypeIcon(metric.type)}</div>
                            <div>
                              <div className="font-semibold text-lg text-[var(--text-primary)]">
                                {metric.name}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getStatusColor(metric.status)}`}>
                                  {metric.status === 'active' ? '✅ Ativa' : '⏳ Planejada'}
                                </span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-lg">
                                  {metric.type === 'quantitative' ? '📊 Quantitativa' : '💭 Qualitativa'}
                                </span>
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-lg">
                                  🎯 {metric.target}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-[var(--text-muted)] mb-2 leading-relaxed">
                            <div><strong>Como medir:</strong> {metric.measurement}</div>
                            {metric.frequency && <div><strong>Frequência:</strong> {metric.frequency}</div>}
                            {metric.responsible && <div><strong>Responsável:</strong> {metric.responsible}</div>}
                          </div>

                          {metric.description && (
                            <div className="text-xs text-[var(--text-muted)] mt-2 bg-[var(--bg-secondary)] p-2 rounded">
                              {metric.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingMetric(metric)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200"
                          title="Editar métrica"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeMetric(metric.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--error-color)] hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Remover métrica"
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

        {activeTab === 'objectives' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🎯 Objetivos de Avaliação
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                O que você espera alcançar com sua solução? Como definirá "sucesso"?
              </div>
              <textarea 
                value={evaluation.objectives || ''}
                onChange={(e) => updateField('objectives', e.target.value)}
                placeholder="Defina claramente seus objetivos:&#10;&#10;• Objetivo principal: [O que você quer alcançar?]&#10;• Objetivos secundários: [Benefícios adicionais esperados]&#10;• Critérios de sucesso: [Como saberá que foi bem-sucedido?]&#10;• Benchmarks: [Com o que comparar os resultados?]&#10;• Timeline: [Quando espera ver resultados?]&#10;• Stakeholders beneficiados: [Quem será impactado positivamente?]"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'methodology' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🔬 Metodologia de Avaliação
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Como você coletará e analisará os dados para avaliar sua solução?
              </div>
              <textarea 
                value={evaluation.methodology || ''}
                onChange={(e) => updateField('methodology', e.target.value)}
                placeholder="Descreva sua metodologia de avaliação:&#10;&#10;• Coleta de dados: [Surveys, entrevistas, analytics, testes A/B]&#10;• Amostragem: [Quantas pessoas? Que perfil? Como selecionar?]&#10;• Instrumentos: [Questionários, ferramentas de medição, KPIs]&#10;• Frequência: [Quando e quantas vezes medirá?]&#10;• Análise: [Como interpretará os dados? Que relatórios gerará?]&#10;• Validação: [Como garantirá confiabilidade dos dados?]&#10;• Comparação: [Linha de base, grupo controle, benchmarks]"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                💡 Aprendizados e Iterações
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Como utilizará os resultados para melhorar continuamente sua solução?
              </div>
              <textarea 
                value={evaluation.lessonsLearned || ''}
                onChange={(e) => updateField('lessonsLearned', e.target.value)}
                placeholder="Planeje como capturar e aplicar aprendizados:&#10;&#10;• Documentação: [Como registrará descobertas e insights?]&#10;• Revisão regular: [Quando analisará resultados e decidirá mudanças?]&#10;• Feedback loops: [Como incorporará feedback contínuo?]&#10;• Pivoting: [Sob que condições mudaria a abordagem?]&#10;• Scaling: [Como expandirá se der certo? Como pausará se não der?]&#10;• Knowledge sharing: [Como compartilhará aprendizados com outros?]&#10;• Next iterations: [Que melhorias planeja para versões futuras?]"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Recomendações */}
      {metrics.length > 0 && (
        <div className="mt-6">
          {quantitativeMetrics === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
              <div className="text-sm text-amber-800">
                <span className="font-semibold">💡 Dica:</span> Considere adicionar métricas quantitativas (números, percentuais) para complementar as qualitativas.
              </div>
            </div>
          )}
          {qualitativeMetrics === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
              <div className="text-sm text-amber-800">
                <span className="font-semibold">💡 Dica:</span> Inclua métricas qualitativas (satisfação, percepções) para capturar aspectos subjetivos do sucesso.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      {showMetricForm && (
        <ModalForm
          title="Nova Métrica de Avaliação"
          fields={metricFields}
          onSubmit={addMetric}
          onClose={() => setShowMetricForm(false)}
          submitText="Criar Métrica"
        />
      )}

      {editingMetric && (
        <ModalForm
          title="Editar Métrica"
          fields={metricFields.map(field => ({
            ...field,
            defaultValue: editingMetric[field.name] || ''
          }))}
          onSubmit={(formData) => updateMetric(editingMetric.id, formData)}
          onClose={() => setEditingMetric(null)}
          submitText="Salvar Alterações"
        />
      )}
    </div>
  );
}