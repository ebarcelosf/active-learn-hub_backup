// components/CBL/ActPane.jsx
import React, { useState } from 'react';
import { ChecklistEditor } from '../shared/ChecklistEditor';
import { SolutionManager } from '../shared/SolutionManager';
import { ImplementationManager } from '../shared/ImplementationManager';
import { EvaluationManager } from '../shared/EvaluationManager';
import { PrototypeManager } from '../shared/PrototypeManager';

export function ActPane({ data, update }) {
  const [activeSection, setActiveSection] = useState('solution-development');

  // Atualizar dados da solução
  function updateSolution(field, value) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        solution: {
          ...d.Act.solution,
          [field]: value
        }
      }
    }));
  }

  // Atualizar dados da implementação
  function updateImplementation(field, value) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        implementation: {
          ...d.Act.implementation,
          [field]: value
        }
      }
    }));
  }

  // Atualizar dados da avaliação
  function updateEvaluation(field, value) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        evaluation: {
          ...d.Act.evaluation,
          [field]: value
        }
      }
    }));
  }

  // Adicionar protótipo
  function addPrototype(prototype) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        prototypes: [...(d.Act.prototypes || []), prototype]
      }
    }));
  }

  // Atualizar protótipo
  function updatePrototype(id, updatedData) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        prototypes: (d.Act.prototypes || []).map(p => 
          p.id === id ? { ...p, ...updatedData } : p
        )
      }
    }));
  }

  // Remover protótipo
  function removePrototype(id) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        prototypes: (d.Act.prototypes || []).filter(p => p.id !== id)
      }
    }));
  }

  function addChecklist(text) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        checklist: [...d.Act.checklist, { id: Date.now(), text, done: false }]
      }
    }));
  }

  function toggleChecklist(id) {
    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        checklist: d.Act.checklist.map(item => item.id === id ? { ...item, done: !item.done } : item)
      }
    }));
  }

  function markComplete() {
    // Verificar se todos os requisitos básicos foram atendidos
    const hasBasicSolution = !!(data.solution?.description || '').trim();
    const hasPrototypes = (data.prototypes || []).length >= 1;
    const hasImplementationPlan = !!(data.implementation?.overview || '').trim();
    const hasEvaluationCriteria = !!(data.evaluation?.objectives || '').trim();

    if (!hasBasicSolution) return alert('É necessário descrever a solução no "Solution Development".');
    if (!hasPrototypes) return alert('É necessário criar pelo menos 1 protótipo.');
    if (!hasImplementationPlan) return alert('É necessário definir um plano de implementação.');
    if (!hasEvaluationCriteria) return alert('É necessário estabelecer critérios de avaliação.');

    update(d => ({
      ...d,
      Act: {
        ...d.Act,
        completed: true,
        checklist: d.Act.checklist.map(item => ({ ...item, done: true }))
      }
    }));
  }

  // Verificar conclusão das seções
  const hasSolution = !!(data.solution?.description || '').trim();
  const hasImplementation = !!(data.implementation?.overview || '').trim();
  const hasEvaluation = !!(data.evaluation?.objectives || '').trim();
  const hasPrototypes = (data.prototypes || []).length > 0;
  const sectionsCompleted = [hasSolution, hasImplementation, hasEvaluation, hasPrototypes].filter(Boolean).length;

  const sections = [
    {
      id: 'solution-development',
      title: 'Solution Development',
      icon: '🎯',
      description: 'Desenvolva soluções concretas e inovadoras',
      completed: !!(data.solution?.description || '').trim()
    },
    {
      id: 'implementation',
      title: 'Implementation',
      icon: '🚀',
      description: 'Crie protótipos testáveis e planos de implementação',
      completed: !!(data.implementation?.overview || '').trim()
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      icon: '📊',
      description: 'Estabeleça planos de avaliação e métricas de sucesso',
      completed: !!(data.evaluation?.objectives || '').trim()
    },
    {
      id: 'prototypes',
      title: 'Prototypes',
      icon: '🛠️',
      description: 'Crie e teste protótipos funcionais',
      completed: (data.prototypes || []).length > 0
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Act — Implementar e Testar</h3>

      {/* Navegação das Seções */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
              activeSection === section.id
                ? 'border-[var(--cbl-act)] bg-[var(--cbl-act)]/10 shadow-sm'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--cbl-act)]/50'
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
        {activeSection === 'solution-development' && (
          <SolutionManager
            solution={data.solution || {}}
            onUpdate={updateSolution}
            title="Solution Development"
            description="Desenvolva soluções concretas e inovadoras para seu desafio"
          />
        )}

        {activeSection === 'implementation' && (
          <ImplementationManager
            implementation={data.implementation || {}}
            onUpdate={updateImplementation}
            title="Implementation Plan"
            description="Defina como sua solução será construída e implementada"
          />
        )}

        {activeSection === 'evaluation' && (
          <EvaluationManager
            evaluation={data.evaluation || {}}
            onUpdate={updateEvaluation}
            title="Evaluation Criteria"
            description="Estabeleça como medir o sucesso da sua solução"
          />
        )}

        {activeSection === 'prototypes' && (
          <PrototypeManager
            prototypes={data.prototypes || []}
            onAdd={addPrototype}
            onUpdate={updatePrototype}
            onRemove={removePrototype}
            title="Prototypes"
            description="Crie e teste protótipos da sua solução"
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
                Act: { 
                  ...d.Act, 
                  checklist: d.Act.checklist.filter(i => i.id !== id) 
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
              sectionsCompleted >= 4
                ? 'bg-[var(--cbl-act)] text-white hover:bg-[var(--accent-hover)] hover:shadow-lg' 
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]'
            }`}
          >
            {sectionsCompleted >= 4 ? '✅ Marcar Act como concluído' : '⏳ Complete todas as seções para finalizar'}
          </button>
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            data.completed 
              ? 'bg-[var(--success-color)] text-white' 
              : 'bg-[var(--warning-color)] text-white'
          }`}>
            {data.completed ? '✅ Concluído' : `⏳ ${sectionsCompleted}/4 seções`}
          </div>
        </div>
      </div>
    </div>
  );
}