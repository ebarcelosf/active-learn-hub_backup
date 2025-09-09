// Salve este arquivo como: src/components/shared/PrototypeManager.jsx

import React, { useState } from 'react';
import { ModalForm } from './FormComponents';

export function PrototypeManager({ 
  prototypes = [], 
  onAdd, 
  onUpdate, 
  onRemove,
  title = "Prototypes", 
  description = "Crie e teste protótipos da sua solução" 
}) {
  const [showPrototypeForm, setShowPrototypeForm] = useState(false);
  const [editingPrototype, setEditingPrototype] = useState(null);
  const [filter, setFilter] = useState('all');

  function addPrototype(formData) {
    const newPrototype = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      fidelity: formData.fidelity,
      status: formData.status || 'concept',
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
      testResults: formData.testResults || '',
      nextSteps: formData.nextSteps || '',
      createdAt: new Date().toISOString(),
      effort: formData.effort || 'medium',
      feedback: []
    };
    
    onAdd(newPrototype);
    setShowPrototypeForm(false);
  }

  function updatePrototype(id, formData) {
    const updatedPrototype = {
      ...formData,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
      updatedAt: new Date().toISOString()
    };
    
    onUpdate(id, updatedPrototype);
    setEditingPrototype(null);
  }

  function getPrototypeTypeIcon(type) {
    const icons = {
      'Paper': '📄',
      'Digital': '💻',
      'Físico': '🔧',
      'Wireframe': '📐',
      'MVP': '⚡',
      'Conceitual': '💡',
      'Funcional': '⚙️',
      'Visual': '🎨'
    };
    return icons[type] || '🛠️';
  }

  function getFidelityColor(fidelity) {
    switch (fidelity) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'tested': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concept': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getEffortIcon(effort) {
    switch (effort) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  const prototypeFields = [
    { name: 'title', label: 'Nome do Protótipo', placeholder: 'Ex: App de Reciclagem v1.0', required: true },
    { name: 'description', label: 'Descrição', placeholder: 'O que este protótipo representa e testa...', type: 'textarea', rows: 3, required: true },
    { name: 'type', label: 'Tipo de Protótipo', type: 'select', required: true, options: [
      { value: '', label: 'Selecione...' },
      { value: 'Paper', label: '📄 Paper Prototype' },
      { value: 'Digital', label: '💻 Digital/Interativo' },
      { value: 'Físico', label: '🔧 Físico/Tangível' },
      { value: 'Wireframe', label: '📐 Wireframe/Mockup' },
      { value: 'MVP', label: '⚡ MVP (Produto Mínimo)' },
      { value: 'Conceitual', label: '💡 Conceitual/Teórico' },
      { value: 'Funcional', label: '⚙️ Funcional/Técnico' },
      { value: 'Visual', label: '🎨 Visual/Design' }
    ]},
    { name: 'fidelity', label: 'Nível de Fidelidade', type: 'select', required: true, options: [
      { value: 'low', label: '🟢 Baixa - Rápido e simples' },
      { value: 'medium', label: '🟡 Média - Balanceado' },
      { value: 'high', label: '🔴 Alta - Detalhado e realista' }
    ]},
    { name: 'effort', label: 'Esforço Necessário', type: 'select', required: true, options: [
      { value: 'low', label: '🟢 Baixo - Poucas horas' },
      { value: 'medium', label: '🟡 Médio - Alguns dias' },
      { value: 'high', label: '🔴 Alto - Semanas/meses' }
    ]},
    { name: 'status', label: 'Status Atual', type: 'select', required: true, options: [
      { value: 'concept', label: '💡 Conceito - Apenas ideia' },
      { value: 'in-progress', label: '🔄 Em desenvolvimento' },
      { value: 'tested', label: '✅ Testado com usuários' }
    ]},
    { name: 'features', label: 'Funcionalidades Testadas (separadas por vírgula)', placeholder: 'Login, busca, pagamento, notificações...' },
    { name: 'testResults', label: 'Resultados dos Testes', placeholder: 'O que funcionou? O que não funcionou? Feedback dos usuários...', type: 'textarea', rows: 3 },
    { name: 'nextSteps', label: 'Próximos Passos', placeholder: 'O que melhorar? Próxima iteração? Quando testar novamente?', type: 'textarea', rows: 2 }
  ];

  // Filtrar protótipos
  const filteredPrototypes = prototypes.filter(prototype => {
    if (filter === 'tested') return prototype.status === 'tested';
    if (filter === 'in-progress') return prototype.status === 'in-progress';
    if (filter === 'concept') return prototype.status === 'concept';
    return true;
  });

  // Ordenar por data de criação (mais recente primeiro)
  const sortedPrototypes = [...filteredPrototypes].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const stats = {
    total: prototypes.length,
    tested: prototypes.filter(p => p.status === 'tested').length,
    inProgress: prototypes.filter(p => p.status === 'in-progress').length,
    concepts: prototypes.filter(p => p.status === 'concept').length,
    highFidelity: prototypes.filter(p => p.fidelity === 'high').length
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-semibold text-lg text-[var(--text-primary)]">{title}</div>
          <div className="text-[var(--text-muted)] text-sm mt-1">{description}</div>
        </div>
        <button 
          onClick={() => setShowPrototypeForm(true)}
          className="px-4 py-2 rounded-lg bg-[var(--cbl-act)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 flex items-center gap-2"
        >
          <span>🛠️</span>
          Novo Protótipo
        </button>
      </div>

      {/* Estatísticas */}
      <div className="mb-6 flex gap-4 text-sm">
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Total: </span>
          <span className="font-semibold text-[var(--text-primary)]">{stats.total}</span>
        </div>
        <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <span className="text-green-700">✅ Testados: </span>
          <span className="font-semibold text-green-800">{stats.tested}</span>
        </div>
        <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <span className="text-blue-700">🔄 Em progresso: </span>
          <span className="font-semibold text-blue-800">{stats.inProgress}</span>
        </div>
        <div className="bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
          <span className="text-purple-700">💡 Conceitos: </span>
          <span className="font-semibold text-purple-800">{stats.concepts}</span>
        </div>
      </div>

      {/* Filtros */}
      {prototypes.length > 0 && (
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-[var(--accent-color)] text-white' 
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter('tested')}
            className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              filter === 'tested' 
                ? 'bg-green-500 text-white' 
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            Testados ({stats.tested})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              filter === 'in-progress' 
                ? 'bg-blue-500 text-white' 
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            Em Progresso ({stats.inProgress})
          </button>
          <button
            onClick={() => setFilter('concept')}
            className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
              filter === 'concept' 
                ? 'bg-purple-500 text-white' 
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            Conceitos ({stats.concepts})
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        {sortedPrototypes.length === 0 ? (
          <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
            <div className="text-4xl mb-3">🛠️</div>
            <div className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'Nenhum protótipo criado ainda' :
               filter === 'tested' ? 'Nenhum protótipo testado ainda' :
               filter === 'in-progress' ? 'Nenhum protótipo em progresso' :
               'Nenhum conceito de protótipo'}
            </div>
            <div className="text-sm mb-4">
              {filter === 'all' ? 
                'Comece com protótipos simples (papel, wireframes) para testar suas ideias rapidamente.' :
                'Mude o filtro para ver protótipos em outras fases de desenvolvimento.'}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              💡 Dica CBL: "Fail fast, learn faster" - teste cedo e iterate baseado no feedback
            </div>
          </div>
        ) : (
          sortedPrototypes.map((prototype, index) => (
            <div key={prototype.id} className="bg-[var(--bg-card)] p-5 rounded-lg border border-[var(--border-color)] hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Cabeçalho do protótipo */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl">{getPrototypeTypeIcon(prototype.type)}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-xl text-[var(--text-primary)] mb-1">{prototype.title}</div>
                      <div className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                        {prototype.description}
                      </div>
                    </div>
                  </div>

                  {/* Tags e status */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] font-medium">
                      {prototype.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getFidelityColor(prototype.fidelity)}`}>
                      {prototype.fidelity === 'high' ? '🔴 Alta Fidelidade' : 
                       prototype.fidelity === 'medium' ? '🟡 Média Fidelidade' : 
                       '🟢 Baixa Fidelidade'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getStatusColor(prototype.status)}`}>
                      {prototype.status === 'tested' ? '✅ Testado' : 
                       prototype.status === 'in-progress' ? '🔄 Em Progresso' : 
                       '💡 Conceito'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 font-medium">
                      {getEffortIcon(prototype.effort)} {prototype.effort === 'high' ? 'Alto Esforço' : 
                                                          prototype.effort === 'medium' ? 'Médio Esforço' : 
                                                          'Baixo Esforço'}
                    </span>
                  </div>

                  {/* Funcionalidades */}
                  {prototype.features && prototype.features.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-[var(--text-primary)] mb-1">⚙️ Funcionalidades:</div>
                      <div className="flex flex-wrap gap-1">
                        {prototype.features.map((feature, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resultados dos testes */}
                  {prototype.testResults && (
                    <div className="mb-3 bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="text-xs font-medium text-green-800 mb-1">🧪 Resultados dos Testes:</div>
                      <div className="text-sm text-green-700 leading-relaxed">
                        {prototype.testResults}
                      </div>
                    </div>
                  )}

                  {/* Próximos passos */}
                  {prototype.nextSteps && (
                    <div className="mb-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <div className="text-xs font-medium text-blue-800 mb-1">🚀 Próximos Passos:</div>
                      <div className="text-sm text-blue-700 leading-relaxed">
                        {prototype.nextSteps}
                      </div>
                    </div>
                  )}

                  {/* Metadados */}
                  <div className="text-xs text-[var(--text-muted)] flex gap-4">
                    <span>Criado: {new Date(prototype.createdAt).toLocaleDateString('pt-BR')}</span>
                    {prototype.updatedAt && (
                      <span>Atualizado: {new Date(prototype.updatedAt).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingPrototype(prototype)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200"
                    title="Editar protótipo"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onRemove(prototype.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error-color)] hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Remover protótipo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dicas CBL */}
      {prototypes.length > 0 && (
        <div className="mt-6">
          {stats.tested === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
              <div className="text-sm text-amber-800">
                <span className="font-semibold">💡 Dica CBL:</span> Teste seus protótipos com usuários reais o quanto antes. Feedback antecipado evita retrabalho!
              </div>
            </div>
          )}
          {stats.total > 0 && stats.highFidelity === stats.total && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-semibold">🎯 Dica:</span> Considere criar alguns protótipos de baixa fidelidade para testar ideias rapidamente antes de investir em alta fidelidade.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      {showPrototypeForm && (
        <ModalForm
          title="Novo Protótipo"
          fields={prototypeFields}
          onSubmit={addPrototype}
          onClose={() => setShowPrototypeForm(false)}
          submitText="Criar Protótipo"
        />
      )}

      {editingPrototype && (
        <ModalForm
          title="Editar Protótipo"
          fields={prototypeFields.map(field => ({
            ...field,
            defaultValue: field.name === 'features' && editingPrototype.features 
              ? editingPrototype.features.join(', ')
              : editingPrototype[field.name] || ''
          }))}
          onSubmit={(formData) => updatePrototype(editingPrototype.id, formData)}
          onClose={() => setEditingPrototype(null)}
          submitText="Salvar Alterações"
        />
      )}
    </div>
  );
}