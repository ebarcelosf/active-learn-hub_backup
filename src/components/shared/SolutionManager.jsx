// Salve este arquivo como: src/components/shared/SolutionManager.jsx

import React, { useState } from 'react';

export function SolutionManager({ 
  solution = {}, 
  onUpdate,
  title = "Solution Development", 
  description = "Descreva e desenhe a solução proposta" 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Função para atualizar campos da solução
  function updateField(field, value) {
    onUpdate(field, value);
  }

  // Calcular estatísticas da solução
  const stats = {
    totalWords: (solution.description || '').split(/\s+/).filter(word => word.length > 0).length,
    hasOverview: !!(solution.description || '').trim(),
    hasFunctionalities: !!(solution.functionalities || '').trim(),
    hasDifferentiation: !!(solution.differentiation || '').trim(),
    hasTechnology: !!(solution.technology || '').trim()
  };

  const completionPercentage = Math.round(
    [stats.hasOverview, stats.hasFunctionalities, stats.hasDifferentiation, stats.hasTechnology]
      .filter(Boolean).length / 4 * 100
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '🎯', completed: stats.hasOverview },
    { id: 'features', label: 'Funcionalidades', icon: '⚙️', completed: stats.hasFunctionalities },
    { id: 'differentiation', label: 'Diferenciação', icon: '✨', completed: stats.hasDifferentiation },
    { id: 'technology', label: 'Tecnologia', icon: '🔧', completed: stats.hasTechnology }
  ];

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
          <span className="text-[var(--text-muted)]">Palavras: </span>
          <span className="font-semibold text-[var(--text-primary)]">{stats.totalWords}</span>
        </div>
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Completude: </span>
          <span className="font-semibold text-[var(--text-primary)]">{completionPercentage}%</span>
        </div>
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Seções: </span>
          <span className="font-semibold text-[var(--text-primary)]">
            {[stats.hasOverview, stats.hasFunctionalities, stats.hasDifferentiation, stats.hasTechnology].filter(Boolean).length}/4
          </span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-muted)]">Progresso da Solução</span>
          <span className="font-semibold text-[var(--text-primary)]">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-[var(--bg-card)] rounded-full h-3 border border-[var(--border-color)]">
          <div className="bg-gradient-to-r from-[var(--cbl-act)] to-blue-500 h-3 rounded-full transition-all duration-500" 
               style={{width: `${completionPercentage}%`}}></div>
        </div>
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
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🎯 Descrição Geral da Solução
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Como sua solução responde à Essential Question? Qual problema ela resolve?
              </div>
              <textarea 
                value={solution.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descreva sua solução de forma clara e concisa:&#10;&#10;• Qual é a proposta de valor central?&#10;• Como ela resolve o problema identificado na fase Engage?&#10;• Para quem se destina esta solução?&#10;• Qual é o benefício principal que oferece?&#10;• Como ela se conecta com os insights da investigação?"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
              <div className="text-xs text-[var(--text-muted)] mt-2">
                💡 Conecte diretamente com sua Essential Question e Big Idea
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                ⚙️ Funcionalidades Principais
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Quais são as características e funcionalidades específicas da sua solução?
              </div>
              <textarea 
                value={solution.functionalities || ''}
                onChange={(e) => updateField('functionalities', e.target.value)}
                placeholder="Liste e detalhe as funcionalidades:&#10;&#10;• Funcionalidade 1: [Nome] - [Descrição] - [Benefício]&#10;• Funcionalidade 2: [Nome] - [Descrição] - [Benefício]&#10;• Funcionalidade 3: [Nome] - [Descrição] - [Benefício]&#10;&#10;Para cada funcionalidade, explique:&#10;- Como funciona na prática&#10;- Que problema específico resolve&#10;- Como melhora a experiência do usuário"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'differentiation' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                ✨ Diferenciação e Inovação
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                O que torna sua solução única? Como ela se diferencia de alternativas existentes?
              </div>
              <textarea 
                value={solution.differentiation || ''}
                onChange={(e) => updateField('differentiation', e.target.value)}
                placeholder="Destaque os diferenciais da sua solução:&#10;&#10;• Que alternativas já existem no mercado?&#10;• Quais são as limitações das soluções atuais?&#10;• Como sua abordagem é diferente/melhor?&#10;• Qual é a inovação principal que você traz?&#10;• Por que alguém escolheria sua solução?&#10;• Que valor único você oferece?&#10;&#10;Seja específico sobre os pontos de diferenciação."
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'technology' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🔧 Tecnologia e Recursos
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Que tecnologias, ferramentas ou recursos serão necessários para implementar sua solução?
              </div>
              <textarea 
                value={solution.technology || ''}
                onChange={(e) => updateField('technology', e.target.value)}
                placeholder="Detalhe os aspectos técnicos:&#10;&#10;• Tecnologias necessárias (software, hardware, plataformas)&#10;• Ferramentas e sistemas que serão utilizados&#10;• Recursos humanos necessários (competências, roles)&#10;• Recursos financeiros estimados&#10;• Infraestrutura necessária&#10;• Dependências externas&#10;• Considerações técnicas importantes&#10;&#10;Seja realista sobre a viabilidade técnica."
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Recomendações */}
      {completionPercentage < 100 && (
        <div className="mt-6">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-sm text-amber-800">
              <span className="font-semibold">💡 Próximos passos:</span>
              <div className="mt-1 space-y-1">
                {!stats.hasOverview && <div>• Complete a descrição geral da solução</div>}
                {!stats.hasFunctionalities && <div>• Detalhe as funcionalidades principais</div>}
                {!stats.hasDifferentiation && <div>• Explique como sua solução se diferencia</div>}
                {!stats.hasTechnology && <div>• Especifique os recursos técnicos necessários</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {completionPercentage === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800">
            <div className="font-semibold mb-2">🎉 Solução bem estruturada!</div>
            <div className="text-sm">
              Sua solução está completamente descrita. Agora você pode focar na criação de protótipos para testá-la!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}