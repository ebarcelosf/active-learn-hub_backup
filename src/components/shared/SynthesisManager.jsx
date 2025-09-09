// Salve este arquivo como: src/components/shared/SynthesisManager.jsx

import React, { useState } from 'react';

export function SynthesisManager({ 
  synthesis = {}, 
  onUpdate,
  questions = [],
  answers = [],
  resources = [],
  activities = [],
  title = "Research Synthesis", 
  description = "Resuma os principais insights obtidos" 
}) {
  const [activeTab, setActiveTab] = useState('findings');
  
  // Função para atualizar campos da síntese
  function updateField(field, value) {
    onUpdate(field, value);
  }

  // Calcular estatísticas da síntese
  const stats = {
    totalWords: Object.values(synthesis).join(' ').split(/\s+/).filter(word => word.length > 0).length,
    findingsCount: (synthesis.mainFindings || '').split('\n').filter(f => f.trim().length > 0 && f.trim() !== '•').length,
    patternsCount: (synthesis.patterns || '').split('\n').filter(p => p.trim().length > 0).length,
    gapsCount: (synthesis.gaps || '').split('\n').filter(g => g.trim().length > 0).length
  };

  const tabs = [
    { id: 'findings', label: 'Principais Descobertas', icon: '🔍', count: stats.findingsCount },
    { id: 'patterns', label: 'Padrões', icon: '🔗', count: stats.patternsCount },
    { id: 'gaps', label: 'Lacunas', icon: '❓', count: stats.gapsCount },
    { id: 'overview', label: 'Visão Geral', icon: '📊', count: null }
  ];

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-semibold text-lg text-[var(--text-primary)]">{title}</div>
          <div className="text-[var(--text-muted)] text-sm mt-1">{description}</div>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="mb-6 flex gap-4 text-sm">
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Palavras: </span>
          <span className="font-semibold text-[var(--text-primary)]">{stats.totalWords}</span>
        </div>
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Completude: </span>
          <span className="font-semibold text-[var(--text-primary)]">
            {Math.round(((synthesis.mainFindings ? 1 : 0) + (synthesis.patterns ? 1 : 0) + (synthesis.gaps ? 1 : 0)) / 3 * 100)}%
          </span>
        </div>
        <div className="bg-[var(--bg-card)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
          <span className="text-[var(--text-muted)]">Fontes consultadas: </span>
          <span className="font-semibold text-[var(--text-primary)]">{resources.length}</span>
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
              {tab.count !== null && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tab.count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="min-h-[300px]">
        {activeTab === 'findings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🔍 Principais Descobertas (3-5 bullets)
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Liste os insights mais importantes obtidos durante a investigação. Use bullets (•) para organizar.
              </div>
              <textarea 
                value={synthesis.mainFindings || ''}
                onChange={(e) => updateField('mainFindings', e.target.value)}
                placeholder="• Primeira descoberta importante sobre o problema&#10;• Segunda descoberta que mudou sua perspectiva&#10;• Terceira descoberta inesperada&#10;• Quarta descoberta que confirma hipóteses&#10;• Quinta descoberta sobre soluções possíveis"
                rows={8} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200 font-mono text-sm leading-relaxed" 
              />
              <div className="text-xs text-[var(--text-muted)] mt-2">
                💡 Dica: Conecte cada descoberta com as fontes e atividades que a suportam
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🔗 Padrões e Conexões Identificadas
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Quais tendências, relações causais ou padrões recorrentes você encontrou?
              </div>
              <textarea 
                value={synthesis.patterns || ''}
                onChange={(e) => updateField('patterns', e.target.value)}
                placeholder="Descreva padrões como:&#10;&#10;• Tendências temporais observadas&#10;• Relações entre diferentes variáveis&#10;• Comportamentos consistentes entre grupos&#10;• Causas e efeitos identificados&#10;• Contradições entre fontes&#10;• Consensos emergentes"
                rows={6} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                ❓ Lacunas de Conhecimento
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                O que ainda precisa ser investigado? Que perguntas surgiram durante a pesquisa?
              </div>
              <textarea 
                value={synthesis.gaps || ''}
                onChange={(e) => updateField('gaps', e.target.value)}
                placeholder="Identifique lacunas como:&#10;&#10;• Perguntas que surgiram mas não foram respondidas&#10;• Dados que faltam para confirmar hipóteses&#10;• Perspectivas não representadas (stakeholders ausentes)&#10;• Aspectos técnicos que precisam de especialistas&#10;• Estudos ou experimentos que seriam necessários&#10;• Limitações metodológicas encontradas"
                rows={6} 
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resumo quantitativo */}
              <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)]">
                <div className="font-semibold text-[var(--text-primary)] mb-3">📊 Resumo Quantitativo</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Perguntas respondidas:</span>
                    <span className="font-semibold">{answers.filter(a => a?.a?.trim()).length}/{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Atividades concluídas:</span>
                    <span className="font-semibold">{activities.filter(a => a.status === 'completed').length}/{activities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Recursos coletados:</span>
                    <span className="font-semibold">{resources.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Fontes de alta credibilidade:</span>
                    <span className="font-semibold">{resources.filter(r => r.credibility === 'high').length}</span>
                  </div>
                </div>
              </div>

              {/* Qualidade da síntese */}
              <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)]">
                <div className="font-semibold text-[var(--text-primary)] mb-3">⭐ Qualidade da Síntese</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Descobertas</span>
                      <span className={synthesis.mainFindings ? 'text-green-600' : 'text-red-600'}>
                        {synthesis.mainFindings ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${synthesis.mainFindings ? 'bg-green-500' : 'bg-gray-300'}`} 
                           style={{width: synthesis.mainFindings ? '100%' : '0%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Padrões</span>
                      <span className={synthesis.patterns ? 'text-green-600' : 'text-red-600'}>
                        {synthesis.patterns ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${synthesis.patterns ? 'bg-green-500' : 'bg-gray-300'}`} 
                           style={{width: synthesis.patterns ? '100%' : '0%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lacunas</span>
                      <span className={synthesis.gaps ? 'text-green-600' : 'text-red-600'}>
                        {synthesis.gaps ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${synthesis.gaps ? 'bg-green-500' : 'bg-gray-300'}`} 
                           style={{width: synthesis.gaps ? '100%' : '0%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="font-semibold text-amber-800 mb-2">💡 Recomendações CBL</div>
              <div className="text-sm text-amber-700 space-y-1">
                {stats.totalWords < 100 && (
                  <div>• Sua síntese ainda está curta. Tente expandir com mais detalhes e exemplos.</div>
                )}
                {resources.filter(r => r.credibility === 'high').length === 0 && (
                  <div>• Considere adicionar mais fontes acadêmicas ou oficiais para fortalecer sua análise.</div>
                )}
                {activities.filter(a => a.status === 'pending').length > 0 && (
                  <div>• Complete as atividades pendentes para ter uma síntese mais completa.</div>
                )}
                {!synthesis.gaps && (
                  <div>• Identifique lacunas de conhecimento - isso é fundamental para a próxima fase (Act).</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
