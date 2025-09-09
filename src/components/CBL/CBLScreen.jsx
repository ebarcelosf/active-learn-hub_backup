// components/CBL/CBLScreen.jsx - VERSÃO ATUALIZADA com Badge de Nudge
import React, { useState, useEffect } from 'react';
import { EngagePane } from './EngagePane';
import { InvestigatePane } from './InvestigatePane';
import { ActPane } from './ActPane';
import { PhaseSidebar, NudgeModal } from './CBLHelpers';

export function CBLScreen({ user, projectsState, grantBadge }) {
  const { activeProject, updateProject, activeProjectId } = projectsState;
  const [phase, setPhase] = useState('Engage');
  const [nudgeOpen, setNudgeOpen] = useState(false);

  // ===== BADGES PARA GUIAR O USUÁRIO PELO CBL =====
  
  // Badge: Escrever Big Idea
  useEffect(() => {
    if (activeProject?.Engage?.bigIdea && activeProject.Engage.bigIdea.trim().length > 0) {
      grantBadge({ 
        id: 'primeiro_passo',
        title: 'Primeiro Passo', 
        desc: 'Escreveu sua Big Idea', 
        xp: 25,
        icon: '🎯'
      }); 
    }
  }, [activeProject?.Engage?.bigIdea, grantBadge]);

  // Badge: Definir Challenge
  useEffect(() => {
    if (activeProject?.Engage?.challenge && activeProject.Engage.challenge.trim().length > 0) {
      grantBadge({ 
        id: 'desafiador',
        title: 'Desafiador', 
        desc: 'Definiu seu Challenge', 
        xp: 25,
        icon: '⚡'
      }); 
    }
  }, [activeProject?.Engage?.challenge, grantBadge]);

  // Badge: Escrever Essential Question
  useEffect(() => {
    if (activeProject?.Engage?.essentialQuestion && activeProject.Engage.essentialQuestion.trim().length > 0) {
      grantBadge({ 
        id: 'questionador',
        title: 'Questionador', 
        desc: 'Criou sua Essential Question', 
        xp: 20,
        icon: '❓'
      }); 
    }
  }, [activeProject?.Engage?.essentialQuestion, grantBadge]);

  // Badge: Completar Engage
  useEffect(() => {
    if (activeProject?.Engage?.completed) {
      grantBadge({ 
        id: 'visionario',
        title: 'Visionário', 
        desc: 'Complete a fase Engage', 
        xp: 60,
        icon: '🌟'
      }); 
    }
  }, [activeProject?.Engage?.completed, grantBadge]);

  // Badge: Investigador Iniciante - Primeira pergunta-guia
  useEffect(() => {
    const answeredQuestions = (activeProject?.Investigate?.answers || []).filter(a => a && a.a && a.a.trim().length > 0);
    if (answeredQuestions.length >= 1) {
      grantBadge({ 
        id: 'investigador_iniciante',
        title: 'Investigador', 
        desc: 'Respondeu sua primeira pergunta-guia', 
        xp: 25,
        icon: '🔍'
      }); 
    }
  }, [activeProject?.Investigate?.answers, grantBadge]);

  // Badge: Pesquisador - 3 perguntas-guia
  useEffect(() => {
    const answeredQuestions = (activeProject?.Investigate?.answers || []).filter(a => a && a.a && a.a.trim().length > 0);
    if (answeredQuestions.length >= 3) {
      grantBadge({ 
        id: 'pesquisador',
        title: 'Pesquisador', 
        desc: 'Respondeu 3 perguntas-guia', 
        xp: 35,
        icon: '📚'
      }); 
    }
  }, [activeProject?.Investigate?.answers, grantBadge]);

  // Badge: Analista - 5 perguntas-guia
  useEffect(() => {
    const answeredQuestions = (activeProject?.Investigate?.answers || []).filter(a => a && a.a && a.a.trim().length > 0);
    if (answeredQuestions.length >= 5) {
      grantBadge({ 
        id: 'analista',
        title: 'Analista', 
        desc: 'Respondeu 5 perguntas-guia', 
        xp: 40,
        icon: '🧠'
      }); 
    }
  }, [activeProject?.Investigate?.answers, grantBadge]);

  // Badge: Coletor - Adicionar recursos de pesquisa
  useEffect(() => {
    const hasResources = (activeProject?.Investigate?.checklist || []).some(item => 
      item && item.text && /recurso|fonte|source|pesquisa/i.test(item.text)
    );
    if (hasResources) {
      grantBadge({ 
        id: 'coletor',
        title: 'Coletor', 
        desc: 'Adicionou recursos de pesquisa', 
        xp: 20,
        icon: '📖'
      }); 
    }
  }, [activeProject?.Investigate?.checklist, grantBadge]);

  // Badge: Bibliotecário - Coletar múltiplos recursos
  useEffect(() => {
    const resourceCount = (activeProject?.Investigate?.checklist || []).filter(item => 
      item && item.text && /recurso|fonte|source|pesquisa/i.test(item.text)
    ).length;
    if (resourceCount >= 3) {
      grantBadge({ 
        id: 'bibliotecario',
        title: 'Bibliotecário', 
        desc: 'Coletou 3 recursos de pesquisa', 
        xp: 30,
        icon: '📚'
      }); 
    }
  }, [activeProject?.Investigate?.checklist, grantBadge]);

  // Badge: Inovador - Múltiplos protótipos
  useEffect(() => {
    if ((activeProject?.Act?.prototypes || []).length >= 3) {
      grantBadge({ 
        id: 'inovador',
        title: 'Inovador', 
        desc: 'Criou 3+ protótipos', 
        xp: 65,
        icon: '🚀'
      }); 
    }
  }, [activeProject?.Act?.prototypes, grantBadge]);

  // Badge: Planejador - Primeira atividade
  useEffect(() => {
    if ((activeProject?.Act?.checklist || []).length > 0) {
      grantBadge({ 
        id: 'planejador',
        title: 'Planejador', 
        desc: 'Criou sua primeira atividade', 
        xp: 30,
        icon: '📋'
      }); 
    }
  }, [activeProject?.Act?.checklist, grantBadge]);

  // Badge: Criador - Primeiro protótipo
  useEffect(() => {
    if ((activeProject?.Act?.prototypes || []).length > 0) {
      grantBadge({ 
        id: 'criador',
        title: 'Criador', 
        desc: 'Criou seu primeiro protótipo', 
        xp: 50,
        icon: '🛠️'
      }); 
    }
  }, [activeProject?.Act?.prototypes, grantBadge]);

  // Badge: Implementador - Completar Act
  useEffect(() => {
    if (activeProject?.Act?.completed) {
      grantBadge({ 
        id: 'implementador',
        title: 'Implementador', 
        desc: 'Complete a fase Act', 
        xp: 95,
        icon: '⚡'
      }); 
    }
  }, [activeProject?.Act?.completed, grantBadge]);

  // Badge: Mestre CBL - Completar todo o ciclo
  useEffect(() => {
    if (activeProject?.Engage?.completed && activeProject?.Investigate?.completed && activeProject?.Act?.completed) {
      grantBadge({ 
        id: 'mestre_cbl',
        title: 'Mestre CBL', 
        desc: 'Complete todo o ciclo CBL', 
        xp: 100,
        icon: '🏆'
      }); 
    }
  }, [activeProject?.Engage?.completed, activeProject?.Investigate?.completed, activeProject?.Act?.completed, grantBadge]);

  const update = (field, value) => {
    updateProject(activeProjectId, field, value);
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <div className="text-lg font-medium">Nenhum projeto selecionado</div>
          <div className="text-sm mt-2">Crie ou selecione um projeto para começar</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6">
      <PhaseSidebar 
        phase={phase} 
        setPhase={setPhase} 
        project={activeProject} 
      />
      
      <div className="flex-1 bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)]">
        <main className="p-6">
          <div className="border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Fase {phase} — {activeProject.title}
                </h2>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  Os nudges guiam o passo-a-passo.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  XP: {(user && JSON.parse(localStorage.getItem('ALH_data'))?.badges?.reduce((s, b) => s + (b.xp || 0), 0)) || 0}
                </div>
                <button 
                  onClick={() => setNudgeOpen(true)} 
                  className="px-3 py-2 rounded-md transition-colors duration-300" 
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                  }}
                >
                  Obter Nudge
                </button>
              </div>
            </div>

            <div className="mt-4">
              {phase === 'Engage' && (
                <EngagePane 
                  data={activeProject.Engage} 
                  update={update}
                />
              )}
              {phase === 'Investigate' && (
                <InvestigatePane 
                  data={activeProject.Investigate} 
                  update={update}
                />
              )}
              {phase === 'Act' && (
                <ActPane 
                  data={activeProject.Act} 
                  update={update}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ATUALIZAÇÃO: Passando grantBadge para o NudgeModal */}
      <NudgeModal 
        visible={nudgeOpen} 
        phase={phase} 
        project={activeProject} 
        onClose={() => setNudgeOpen(false)}
        grantBadge={grantBadge}
      />
    </div>
  );
}