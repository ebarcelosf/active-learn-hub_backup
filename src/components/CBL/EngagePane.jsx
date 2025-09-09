// components/CBL/EngagePane.jsx - VERSÃO UNIVERSAL CORRIGIDA
import React, { useState } from 'react';
import { ChecklistEditor } from '../shared/ChecklistEditor';

export function EngagePane({ data, update }) {
  const [activeSection, setActiveSection] = useState('big-ideas');

  // ✅ CORREÇÃO UNIVERSAL: Funciona com qualquer tipo de função update
  const setField = (field, value) => {
    console.log(`Atualizando ${field}:`, value); // Debug
    
    // Tenta detectar qual tipo de função update está sendo usada
    try {
      // Abordagem 1: Update recebe projeto completo
      update(projectData => ({
        ...projectData,
        Engage: {
          ...projectData.Engage,
          [field]: value
        }
      }));
    } catch (error) {
      console.log('Tentando abordagem 2...'); // Debug
      
      try {
        // Abordagem 2: Update recebe mutator apenas da seção Engage
        update(engageData => ({
          ...engageData,
          [field]: value
        }));
      } catch (error2) {
        console.log('Tentando abordagem 3...'); // Debug
        
        try {
          // Abordagem 3: Update direto com objeto
          const updatedData = {
            ...data,
            [field]: value
          };
          update(updatedData);
        } catch (error3) {
          console.error('❌ Todas as abordagens falharam:', error3);
          alert(`Erro ao atualizar ${field}. Verifique o console para mais detalhes.`);
        }
      }
    }
  };
  
  function addChecklist(text) {
    try {
      update(projectData => ({
        ...projectData,
        Engage: {
          ...projectData.Engage,
          checklist: [...(projectData.Engage.checklist || []), { id: Date.now(), text, done: false }]
        }
      }));
    } catch (error) {
      try {
        update(engageData => ({
          ...engageData,
          checklist: [...(engageData.checklist || []), { id: Date.now(), text, done: false }]
        }));
      } catch (error2) {
        console.error('❌ Erro ao adicionar checklist:', error2);
      }
    }
  }

  function toggleChecklist(id) {
    try {
      update(projectData => ({
        ...projectData,
        Engage: {
          ...projectData.Engage,
          checklist: (projectData.Engage.checklist || []).map(item => 
            item.id === id ? { ...item, done: !item.done } : item
          )
        }
      }));
    } catch (error) {
      try {
        update(engageData => ({
          ...engageData,
          checklist: (engageData.checklist || []).map(item => 
            item.id === id ? { ...item, done: !item.done } : item
          )
        }));
      } catch (error2) {
        console.error('❌ Erro ao toggle checklist:', error2);
      }
    }
  }

  function removeChecklist(id) {
    try {
      update(projectData => ({
        ...projectData,
        Engage: {
          ...projectData.Engage,
          checklist: (projectData.Engage.checklist || []).filter(item => item.id !== id)
        }
      }));
    } catch (error) {
      try {
        update(engageData => ({
          ...engageData,
          checklist: (engageData.checklist || []).filter(item => item.id !== id)
        }));
      } catch (error2) {
        console.error('❌ Erro ao remover checklist:', error2);
      }
    }
  }

  function markComplete() {
    if (!canComplete) {
      alert('Engage requer Big Idea e Essential Question preenchidas.');
      return;
    }
    
    try {
      update(projectData => ({
        ...projectData,
        Engage: {
          ...projectData.Engage,
          completed: true,
          checklist: (projectData.Engage.checklist || []).map(item => ({ ...item, done: true }))
        }
      }));
    } catch (error) {
      try {
        update(engageData => ({
          ...engageData,
          completed: true,
          checklist: (engageData.checklist || []).map(item => ({ ...item, done: true }))
        }));
      } catch (error2) {
        console.error('❌ Erro ao marcar completo:', error2);
      }
    }
  }

  // Verificar conclusão das seções
  const hasBigIdea = (data.bigIdea || '').trim().length > 0;
  const hasEssentialQuestion = (data.essentialQuestion || '').trim().length > 0;
  const hasChallenge = (data.challenge || '').trim().length > 0;
  const canComplete = hasBigIdea && hasEssentialQuestion;
  const sectionsCompleted = [hasBigIdea, hasEssentialQuestion, hasChallenge].filter(Boolean).length;

  // Emojis corrigidos
  const sections = [
    {
      id: 'big-ideas',
      title: 'Big Ideas',
      icon: '💡',
      description: 'Defina o problema central do projeto',
      completed: hasBigIdea
    },
    {
      id: 'essential-questions',
      title: 'Essential Questions',
      icon: '❓',
      description: 'Formule perguntas orientadoras claras',
      completed: hasEssentialQuestion
    },
    {
      id: 'challenges',
      title: 'Challenges',
      icon: '🎯',
      description: 'Liste desafios específicos a resolver',
      completed: hasChallenge
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Engage — Defina a Big Idea</h3>

      {/* Navegação das Seções */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
              activeSection === section.id
                ? 'border-[var(--cbl-engage)] bg-[var(--cbl-engage)]/10 shadow-sm'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--cbl-engage)]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{section.icon}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                section.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-[var(--border-color)]'
              }`}>
                {section.completed && <span className="text-xs">✓</span>}
              </div>
            </div>
            <div className="font-semibold text-[var(--text-primary)] mb-1">{section.title}</div>
            <div className="text-xs text-[var(--text-muted)]">{section.description}</div>
          </button>
        ))}
      </div>

      {/* Conteúdo das Seções */}
      <div className="space-y-6">
        {activeSection === 'big-ideas' && (
          <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-lg text-[var(--text-primary)]">Big Ideas</div>
                <div className="text-[var(--text-muted)] text-sm mt-1">Escreva 1-2 frases que resumam o problema central</div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                💡 Qual é a grande ideia do seu projeto?
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Descreva o problema ou oportunidade que seu projeto pretende abordar
              </div>
              <textarea
                value={data.bigIdea || ''}
                onChange={(e) => {
                  console.log('🔄 Big Idea onChange chamado:', e.target.value);
                  setField('bigIdea', e.target.value);
                }}
                onFocus={() => console.log('🎯 Big Idea focused')}
                onBlur={() => console.log('📤 Big Idea blurred')}
                placeholder="Ex: A falta de engajamento dos jovens em práticas sustentáveis está impactando negativamente o meio ambiente urbano. Como podemos criar soluções que motivem a participação ativa da juventude em iniciativas ecológicas?"
                rows={4}
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--cbl-engage)] focus:border-transparent transition-all duration-200 resize-none"
                style={{ minHeight: '100px' }}
              />
              {(data.bigIdea || '').trim().length > 0 && (
                <div className="mt-2 text-xs text-green-600">
                  ✅ Big Idea definida ({(data.bigIdea || '').trim().length} caracteres)
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'essential-questions' && (
          <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-lg text-[var(--text-primary)]">Essential Questions</div>
                <div className="text-[var(--text-muted)] text-sm mt-1">Transforme a Big Idea em uma pergunta orientadora clara</div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                ❓ Qual é a pergunta essencial que guiará seu projeto?
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Uma boa Essential Question é aberta, provocativa e conecta-se diretamente com sua Big Idea
              </div>
              <input
                type="text"
                value={data.essentialQuestion || ''}
                onChange={(e) => {
                  console.log('🔄 Essential Question onChange chamado:', e.target.value);
                  setField('essentialQuestion', e.target.value);
                }}
                onFocus={() => console.log('🎯 Essential Question focused')}
                onBlur={() => console.log('📤 Essential Question blurred')}
                placeholder="Ex: Como podemos usar a tecnologia para engajar jovens de 16-25 anos em práticas sustentáveis de forma divertida e colaborativa?"
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--cbl-engage)] focus:border-transparent transition-all duration-200"
              />
              {(data.essentialQuestion || '').trim().length > 0 && (
                <div className="mt-2 text-xs text-green-600">
                  ✅ Essential Question formulada ({(data.essentialQuestion || '').trim().length} caracteres)
                </div>
              )}
              
              {/* Dicas para Essential Questions */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-semibold">💡 Dicas para uma boa Essential Question:</span>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Começa com "Como...", "Por que..." ou "O que aconteceria se..."</li>
                    <li>• É aberta (não tem uma resposta única)</li>
                    <li>• Conecta-se diretamente com sua Big Idea</li>
                    <li>• Inspira curiosidade e investigação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'challenges' && (
          <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-lg text-[var(--text-primary)]">Challenges</div>
                <div className="text-[var(--text-muted)] text-sm mt-1">Liste desafios específicos que seu projeto deverá solucionar</div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                🎯 Quais são os principais desafios a serem enfrentados?
              </label>
              <div className="text-xs text-[var(--text-muted)] mb-2">
                Identifique obstáculos específicos, limitações e barreiras que precisam ser superados
              </div>
              <textarea
                value={data.challenge || ''}
                onChange={(e) => {
                  console.log('🔄 Challenge onChange chamado:', e.target.value);
                  setField('challenge', e.target.value);
                }}
                onFocus={() => console.log('🎯 Challenge focused')}
                onBlur={() => console.log('📤 Challenge blurred')}
                placeholder={`Liste os principais desafios:\n\n• Falta de conscientização sobre impacto ambiental\n• Desconexão entre teoria e prática sustentável\n• Ausência de ferramentas acessíveis para jovens\n• Falta de incentivos tangíveis para mudança de comportamento\n• Dificuldade em medir o impacto das ações individuais`}
                rows={6}
                className="w-full p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--cbl-engage)] focus:border-transparent transition-all duration-200 resize-none"
              />
              {(data.challenge || '').trim().length > 0 && (
                <div className="mt-2 text-xs text-green-600">
                  ✅ Desafios identificados ({(data.challenge || '').trim().length} caracteres)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checklist Personalizada */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium text-lg text-[var(--text-primary)]">Checklist Personalizada</div>
            <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-1 rounded-lg">Customize suas tarefas</div>
          </div>
          <div className="mt-4">
            <ChecklistEditor 
              items={data.checklist || []} 
              onAdd={addChecklist} 
              onToggle={toggleChecklist} 
              onRemove={removeChecklist} 
            />
          </div>
        </div>

        {/* Botão de Conclusão */}
        <div className="flex gap-3 items-center">
          <button
            onClick={markComplete}
            disabled={!canComplete}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canComplete
                ? 'bg-[var(--cbl-engage)] text-white hover:bg-[var(--accent-hover)] hover:shadow-lg cursor-pointer'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)] opacity-60'
            }`}
          >
            {canComplete ? '✅ Marcar Engage como concluído' : '⏳ Complete Big Idea e Essential Question'}
          </button>
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            data.completed
              ? 'bg-[var(--success-color)] text-white'
              : 'bg-[var(--warning-color)] text-white'
          }`}>
            {data.completed ? '✅ Concluído' : `⏳ ${sectionsCompleted}/3 seções`}
          </div>
        </div>
      </div>
    </div>
  );
}