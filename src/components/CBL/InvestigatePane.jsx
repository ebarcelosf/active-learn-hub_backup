// components/CBL/InvestigatePane.jsx
import React, { useState } from 'react';
import { ChecklistEditor } from '../shared/ChecklistEditor';
import { AddQuestionForm } from '../shared/FormComponents';
import { ResourceManager } from '../shared/ResourceManager';
import { ActivityManager } from '../shared/ActivityManager';
import { SynthesisManager } from '../shared/SynthesisManager';

export function InvestigatePane({ data, update }) {
  const [activeSection, setActiveSection] = useState('guiding-questions');

  function setAnswer(idx, text) {
    update(d => {
      const answers = [...(d.Investigate.answers || [])];
      answers[idx] = { q: d.Investigate.guidingQuestions[idx], a: text };
      return { ...d, Investigate: { ...d.Investigate, answers } };
    });
  }

  function addGuidingQuestion(text) {
    if (!text.trim()) return;
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        guidingQuestions: [...d.Investigate.guidingQuestions, text.trim()],
        answers: [...(d.Investigate.answers || [])]
      }
    }));
  }

  function removeGuidingQuestion(index) {
    update(d => {
      const newQuestions = d.Investigate.guidingQuestions.filter((_, i) => i !== index);
      const newAnswers = d.Investigate.answers.filter((_, i) => i !== index);
      return {
        ...d,
        Investigate: {
          ...d.Investigate,
          guidingQuestions: newQuestions,
          answers: newAnswers
        }
      };
    });
  }

  // Guiding Activities Functions
  function addActivity(newActivity) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        activities: [...(d.Investigate.activities || []), newActivity]
      }
    }));
  }

  function updateActivity(id, updatedData) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        activities: (d.Investigate.activities || []).map(act =>
          act.id === id ? { ...act, ...updatedData, updatedAt: new Date().toISOString() } : act
        )
      }
    }));
  }

  function toggleActivityStatus(id) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        activities: (d.Investigate.activities || []).map(act =>
          act.id === id ? {
            ...act,
            status: act.status === 'completed' ? 'pending' : 'completed',
            completedAt: act.status === 'pending' ? new Date().toISOString() : null
          } : act
        )
      }
    }));
  }

  function removeActivity(id) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        activities: (d.Investigate.activities || []).filter(act => act.id !== id)
      }
    }));
  }

  // Guiding Resources Functions
  function addResource(newResource) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        resources: [...(d.Investigate.resources || []), newResource]
      }
    }));
  }

  function updateResource(id, updatedData) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        resources: (d.Investigate.resources || []).map(res =>
          res.id === id ? { ...res, ...updatedData, updatedAt: new Date().toISOString() } : res
        )
      }
    }));
  }

  function removeResource(id) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        resources: (d.Investigate.resources || []).filter(res => res.id !== id)
      }
    }));
  }

  function updateSynthesis(field, value) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        synthesis: {
          ...d.Investigate.synthesis,
          [field]: value
        }
      }
    }));
  }

  function addChecklist(text) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        checklist: [...(d.Investigate.checklist || []), { id: Date.now(), text, done: false }]
      }
    }));
  }

  function toggleChecklist(id) {
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        checklist: d.Investigate.checklist.map(item => item.id === id ? { ...item, done: !item.done } : item)
      }
    }));
  }

  function markComplete() {
    if (!canComplete) {
      return alert(`Investigate requer pelo menos 3 perguntas respondidas (${answeredCount}/3) e 1 atividade concluída (${completedActivities}/${activities.length}).`);
    }
    update(d => ({
      ...d,
      Investigate: {
        ...d.Investigate,
        completed: true,
        checklist: d.Investigate.checklist.map(item => ({ ...item, done: true }))
      }
    }));
  }

  // Verificar conclusão das seções
  const activities = data.activities || [];
  const resources = data.resources || [];
  const synthesis = data.synthesis || {};
  const answeredCount = (data.answers || []).filter(a => a && a.a && a.a.trim().length > 0).length;
  const completedActivities = activities.filter(act => act.status === 'completed').length;
  const canComplete = answeredCount >= 3 && completedActivities >= 1;

  // Status das seções
  const hasAnswers = answeredCount >= 3;
  const hasActivities = completedActivities >= 1;
  const hasResources = resources.length >= 1;
  const hasSynthesis = !!(synthesis.mainFindings || '').trim();
  const sectionsCompleted = [hasAnswers, hasActivities, hasResources, hasSynthesis].filter(Boolean).length;

  const sections = [
    {
      id: 'guiding-questions',
      title: 'Guiding Questions',
      icon: '❓',
      description: 'Perguntas-guia para orientar sua pesquisa',
      completed: hasAnswers,
      count: `${answeredCount}/${data.guidingQuestions.length}`
    },
    {
      id: 'guiding-activities',
      title: 'Guiding Activities',
      icon: '🎯',
      description: 'Atividades práticas para coletar dados',
      completed: hasActivities,
      count: `${completedActivities}/${activities.length}`
    },
    {
      id: 'guiding-resources',
      title: 'Guiding Resources',
      icon: '📚',
      description: 'Colete artigos, vídeos e entrevistas',
      completed: hasResources,
      count: resources.length
    },
    {
      id: 'research-synthesis',
      title: 'Research Synthesis',
      icon: '🔍',
      description: 'Resumir os principais insights obtidos',
      completed: hasSynthesis
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Investigate — Pesquise e responda perguntas-guia</h3>

      {/* Navegação das Seções */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
              activeSection === section.id
                ? 'border-[var(--cbl-investigate)] bg-[var(--cbl-investigate)]/10 shadow-sm'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--cbl-investigate)]/50'
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
            <div className="text-xs text-[var(--text-muted)] mb-1">{section.description}</div>
            {section.count && (
              <div className="text-xs text-[var(--accent-color)] font-medium">{section.count}</div>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo das Seções */}
      <div className="space-y-6">
        {activeSection === 'guiding-questions' && (
          <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-lg text-[var(--text-primary)]">Guiding Questions</div>
                <div className="text-[var(--text-muted)] text-sm mt-1">Perguntas-guia para orientar sua pesquisa</div>
              </div>
            </div>
            
            <div className="mt-4">
              {data.guidingQuestions.length === 0 && (
                <div className="text-center p-6 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-2xl mb-2">🔍</div>
                  <div>Nenhuma pergunta adicionada ainda.</div>
                  <div className="text-sm mt-1">Use o campo abaixo para adicionar sua primeira pergunta-guia.</div>
                </div>
              )}

              <div className="space-y-3">
                {data.guidingQuestions.map((q, i) => (
                  <div key={i} className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-color)] shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-[var(--text-muted)] font-medium flex-1">{q}</div>
                      <button
                        onClick={() => removeGuidingQuestion(i)}
                        className="ml-2 px-2 py-1 text-xs text-[var(--error-color)] hover:bg-[var(--error-color)] hover:text-white rounded transition-all duration-200"
                        title="Remover pergunta"
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={(data.answers[i] && data.answers[i].a) || ''}
                      onChange={(e) => setAnswer(i, e.target.value)}
                      placeholder="Digite sua resposta aqui..."
                      rows={3}
                      className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cbl-investigate)] focus:border-transparent transition-all duration-200"
                    />
                    {data.answers[i] && data.answers[i].a && data.answers[i].a.trim().length > 0 && (
                      <div className="mt-2 text-xs text-green-600">
                        ✅ Respondida ({data.answers[i].a.trim().length} caracteres)
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <AddQuestionForm onAdd={addGuidingQuestion} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'guiding-activities' && (
          <ActivityManager
            activities={activities}
            onAdd={addActivity}
            onUpdate={updateActivity}
            onRemove={removeActivity}
            onToggleStatus={toggleActivityStatus}
            title="Guiding Activities"
            description="Atividades práticas para coletar dados e informações"
          />
        )}

        {activeSection === 'guiding-resources' && (
          <ResourceManager
            resources={resources}
            onAdd={addResource}
            onUpdate={updateResource}
            onRemove={removeResource}
            title="Guiding Resources"
            description="Colete artigos, vídeos e entrevistas relevantes"
          />
        )}

        {activeSection === 'research-synthesis' && (
          <SynthesisManager
            synthesis={synthesis}
            onUpdate={updateSynthesis}
            questions={data.guidingQuestions}
            answers={data.answers || []}
            resources={resources}
            activities={activities}
            title="Research Synthesis"
            description="Resuma os principais insights e padrões descobertos"
          />
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
              onRemove={(id) => update(d => ({
                ...d,
                Investigate: {
                  ...d.Investigate,
                  checklist: d.Investigate.checklist.filter(i => i.id !== id)
                }
              }))}
            />
          </div>
        </div>

        {/* Botão de Conclusão */}
        <div className="flex gap-3 items-center">
          <button
            onClick={markComplete}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canComplete
                ? 'bg-[var(--cbl-investigate)] text-white hover:bg-[var(--accent-hover)] hover:shadow-lg'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]'
            }`}
          >
            {canComplete ? '✅ Marcar Investigate como concluído' : '⏳ Complete 3 perguntas e 1 atividade'}
          </button>
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            data.completed
              ? 'bg-[var(--success-color)] text-white'
              : 'bg-[var(--warning-color)] text-white'
          }`}>
            {data.completed ? '✅ Concluído' : `⏳ ${sectionsCompleted}/4 seções • ${answeredCount}/3 respostas • ${completedActivities}/${activities.length} atividades`}
          </div>
        </div>
      </div>
    </div>
  );
}