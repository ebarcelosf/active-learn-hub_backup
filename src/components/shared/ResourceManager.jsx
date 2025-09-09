// Salve este arquivo como: src/components/shared/ResourceManager.jsx

import React, { useState } from 'react';
import { ModalForm } from './FormComponents';

export function ResourceManager({ resources = [], onAdd, onUpdate, onRemove, title = "Recursos", description = "Gerencie seus recursos de pesquisa" }) {
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  function addResource(formData) {
    const newResource = {
      id: Date.now(),
      title: formData.title,
      url: formData.url,
      type: formData.type,
      notes: formData.notes,
      credibility: formData.credibility || 'medium',
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      createdAt: new Date().toISOString(),
      relevanceScore: parseInt(formData.relevanceScore) || 3
    };
    
    onAdd(newResource);
    setShowResourceForm(false);
  }

  function updateResource(id, formData) {
    const updatedResource = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      relevanceScore: parseInt(formData.relevanceScore) || 3,
      updatedAt: new Date().toISOString()
    };
    
    onUpdate(id, updatedResource);
    setEditingResource(null);
  }

  function getCredibilityColor(credibility) {
    switch (credibility) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getRelevanceStars(score) {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  }

  function getTypeIcon(type) {
    const icons = {
      'Artigo': '📄',
      'Vídeo': '🎥',
      'Livro': '📚',
      'Site': '🌐',
      'Entrevista': '🎤',
      'Relatório': '📊',
      'Podcast': '🎧',
      'Dados': '📈',
      'Outros': '📎'
    };
    return icons[type] || '📎';
  }

  const resourceFields = [
    { 
      name: 'title', 
      label: 'Título do Recurso', 
      placeholder: 'Nome do artigo, vídeo, livro, etc.', 
      required: true 
    },
    { 
      name: 'url', 
      label: 'URL/Link', 
      placeholder: 'https://...', 
      type: 'url' 
    },
    { 
      name: 'type', 
      label: 'Tipo de Recurso', 
      type: 'select', 
      required: true, 
      options: [
        { value: '', label: 'Selecione...' },
        { value: 'Artigo', label: 'Artigo Científico' },
        { value: 'Vídeo', label: 'Vídeo' },
        { value: 'Livro', label: 'Livro' },
        { value: 'Site', label: 'Site/Blog' },
        { value: 'Entrevista', label: 'Entrevista' },
        { value: 'Relatório', label: 'Relatório' },
        { value: 'Podcast', label: 'Podcast' },
        { value: 'Dados', label: 'Base de Dados' },
        { value: 'Outros', label: 'Outros' }
      ]
    },
    { 
      name: 'credibility', 
      label: 'Credibilidade da Fonte', 
      type: 'select', 
      required: true, 
      options: [
        { value: 'high', label: 'Alta (acadêmica, oficial, peer-reviewed)' },
        { value: 'medium', label: 'Média (jornalística, profissional, institucional)' },
        { value: 'low', label: 'Baixa (opinião, blog pessoal, redes sociais)' }
      ]
    },
    { 
      name: 'relevanceScore', 
      label: 'Relevância para o Projeto (1-5)', 
      type: 'select', 
      required: true,
      defaultValue: '3',
      options: [
        { value: '1', label: '1 - Pouco relevante' },
        { value: '2', label: '2 - Relevante' },
        { value: '3', label: '3 - Moderadamente relevante' },
        { value: '4', label: '4 - Muito relevante' },
        { value: '5', label: '5 - Extremamente relevante' }
      ]
    },
    { 
      name: 'tags', 
      label: 'Tags (separadas por vírgula)', 
      placeholder: 'sustentabilidade, meio ambiente, educação...' 
    },
    { 
      name: 'notes', 
      label: 'Anotações e Insights', 
      placeholder: 'Principais pontos, citações importantes, como este recurso responde às suas perguntas de pesquisa...', 
      type: 'textarea', 
      rows: 4 
    }
  ];

  // Ordenar recursos por relevância e credibilidade
  const sortedResources = [...resources].sort((a, b) => {
    const relevanceOrder = (b.relevanceScore || 3) - (a.relevanceScore || 3);
    if (relevanceOrder !== 0) return relevanceOrder;
    
    const credibilityWeight = { high: 3, medium: 2, low: 1 };
    return (credibilityWeight[b.credibility] || 2) - (credibilityWeight[a.credibility] || 2);
  });

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold text-lg text-[var(--text-primary)]">{title}</div>
          <div className="text-[var(--text-muted)] text-sm mt-1">{description}</div>
        </div>
        <button 
          onClick={() => setShowResourceForm(true)}
          className="px-4 py-2 rounded-lg bg-[var(--cbl-investigate)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 flex items-center gap-2"
        >
          <span>📚</span>
          Adicionar Recurso
        </button>
      </div>
      
      {/* Estatísticas rápidas */}
      {resources.length > 0 && (
        <div className="mb-4 flex gap-4 text-sm">
          <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
            <span className="text-[var(--text-muted)]">Total: </span>
            <span className="font-semibold text-[var(--text-primary)]">{resources.length}</span>
          </div>
          <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
            <span className="text-[var(--text-muted)]">Alta credibilidade: </span>
            <span className="font-semibold text-green-600">{resources.filter(r => r.credibility === 'high').length}</span>
          </div>
          <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
            <span className="text-[var(--text-muted)]">Relevância média: </span>
            <span className="font-semibold text-[var(--text-primary)]">
              {resources.length > 0 ? (resources.reduce((sum, r) => sum + (r.relevanceScore || 3), 0) / resources.length).toFixed(1) : '0'}/5
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {sortedResources.length === 0 ? (
          <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
            <div className="text-4xl mb-3">📚</div>
            <div className="text-lg font-semibold mb-2">Nenhum recurso adicionado ainda</div>
            <div className="text-sm mb-4">
              Adicione links, artigos, vídeos e outras fontes de pesquisa para fundamentar sua investigação.
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              💡 Dica: Priorize fontes acadêmicas e oficiais para maior credibilidade
            </div>
          </div>
        ) : (
          sortedResources.map(resource => (
            <div key={resource.id} className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)] hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Cabeçalho do recurso */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{getTypeIcon(resource.type)}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)] text-lg">{resource.title}</div>
                      {resource.url && (
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[var(--accent-color)] text-sm hover:underline block mt-1 break-all"
                        >
                          🔗 {resource.url}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Métricas e classificações */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-muted)] font-medium">
                      {resource.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getCredibilityColor(resource.credibility)}`}>
                      {resource.credibility === 'high' ? '🏆 Alta' : 
                       resource.credibility === 'medium' ? '⚡ Média' : 
                       '⚠️ Baixa'} Credibilidade
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-medium">
                      {getRelevanceStars(resource.relevanceScore || 3)} ({resource.relevanceScore || 3}/5)
                    </span>
                  </div>

                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Anotações */}
                  {resource.notes && (
                    <div className="bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-color)] mt-3">
                      <div className="text-sm font-medium text-[var(--text-primary)] mb-1">📝 Anotações:</div>
                      <div className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                        {resource.notes}
                      </div>
                    </div>
                  )}

                  {/* Metadados */}
                  <div className="text-xs text-[var(--text-muted)] mt-3 flex gap-4">
                    <span>Adicionado: {new Date(resource.createdAt).toLocaleDateString('pt-BR')}</span>
                    {resource.updatedAt && (
                      <span>Atualizado: {new Date(resource.updatedAt).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingResource(resource)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200"
                    title="Editar recurso"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onRemove(resource.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error-color)] hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Remover recurso"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dicas para recursos de qualidade */}
      {resources.length > 0 && resources.filter(r => r.credibility === 'high').length / resources.length < 0.5 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-sm text-amber-800">
            <span className="font-semibold">💡 Dica CBL:</span> Tente incluir mais fontes de alta credibilidade (acadêmicas, oficiais) 
            para fortalecer sua investigação. Fontes confiáveis geram conclusões mais sólidas!
          </div>
        </div>
      )}

      {/* Modal para adicionar recurso */}
      {showResourceForm && (
        <ModalForm
          title="Adicionar Novo Recurso"
          fields={resourceFields}
          onSubmit={addResource}
          onClose={() => setShowResourceForm(false)}
          submitText="Adicionar Recurso"
        />
      )}

      {/* Modal para editar recurso */}
      {editingResource && (
        <ModalForm
          title="Editar Recurso"
          fields={resourceFields.map(field => ({
            ...field,
            defaultValue: field.name === 'tags' && editingResource.tags 
              ? editingResource.tags.join(', ')
              : field.name === 'relevanceScore'
              ? String(editingResource.relevanceScore || 3)
              : editingResource[field.name] || field.defaultValue || ''
          }))}
          onSubmit={(formData) => updateResource(editingResource.id, formData)}
          onClose={() => setEditingResource(null)}
          submitText="Salvar Alterações"
        />
      )}
    </div>
  );
}