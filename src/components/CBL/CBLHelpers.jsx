// components/CBL/CBLHelpers.jsx - Atualizado com Badge ao Obter Nudge
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { NUDGE_CATEGORIES } from '../../utils/constants';

export function PhaseSidebar({ phase, setPhase, project }) {
  const locked = useMemo(() => ({ 
    Engage: false, 
    Investigate: !project.Engage.completed, 
    Act: !project.Investigate.completed 
  }), [project]);
  
  return (
    <aside className="w-72 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
      <h4 className="font-semibold text-[var(--text-primary)] text-lg mb-6">Fases CBL</h4>
      <div className="flex flex-col gap-4">
        {['Engage', 'Investigate', 'Act'].map(p => {
          const isLocked = locked[p];
          const color = p === 'Engage' ? 'bg-[var(--cbl-engage)]' : 
                       p === 'Investigate' ? 'bg-[var(--cbl-investigate)]' : 
                       'bg-[var(--cbl-act)]';
          return (
            <button 
              key={p} 
              disabled={isLocked} 
              onClick={() => !isLocked && setPhase(p)} 
              className={`text-left px-4 py-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
                phase === p 
                  ? 'ring-2 ring-[var(--accent-color)] bg-[var(--bg-secondary)] shadow-md' 
                  : 'hover:bg-[var(--bg-secondary)] hover:shadow-sm'
              } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`${color} w-10 h-10 rounded-lg shadow-sm`} />
                <div className="text-[var(--text-primary)] font-medium">{p}</div>
              </div>
              <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-1 rounded-lg">
                {p === 'Engage' ? 'Início' : p === 'Investigate' ? 'Pesquisa' : 'Implementar'}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export function NudgeModal({ visible, phase, project, onClose, grantBadge }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentNudgeIndex, setCurrentNudgeIndex] = useState(0);
  const [badgeGranted, setBadgeGranted] = useState(false);
  
  // Obter categorias disponíveis para a fase atual
  const availableCategories = Object.keys(NUDGE_CATEGORIES[phase] || {});
  
  // Obter nudges da categoria selecionada
  const currentNudges = selectedCategory ? (NUDGE_CATEGORIES[phase]?.[selectedCategory] || []) : [];
  
  // Resetar quando modal abre ou fase muda
  useEffect(() => {
    if (visible) {
      setSelectedCategory(null);
      setCurrentNudgeIndex(0);
      setBadgeGranted(false);
    }
  }, [visible, phase]);

  // Resetar índice quando categoria muda
  useEffect(() => {
    setCurrentNudgeIndex(0);
  }, [selectedCategory]);

  // Conceder badge quando um nudge é visualizado (SEM NOTIFICAÇÃO VISUAL)
  useEffect(() => {
    if (visible && selectedCategory && currentNudges[currentNudgeIndex] && !badgeGranted && grantBadge) {
      // Conceder o badge "Inspirado" quando o usuário visualiza um nudge
      grantBadge({
        id: 'inspirado',
        title: 'Inspirado',
        desc: 'Obteve um nudge para inspiração',
        xp: 30,
        icon: '💡'
      });
      setBadgeGranted(true);
    }
  }, [visible, selectedCategory, currentNudgeIndex, currentNudges, badgeGranted, grantBadge]);

  if (!visible) return null;

  const currentNudge = currentNudges[currentNudgeIndex];
  const colorClass = phase === 'Engage' ? 'bg-[var(--cbl-engage)]' : 
                    phase === 'Investigate' ? 'bg-[var(--cbl-investigate)]' : 
                    'bg-[var(--cbl-act)]';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-[var(--bg-card)] p-6 rounded-xl w-full max-w-2xl shadow-lg text-[var(--text-primary)] border border-[var(--border-color)]"
      >
        <div className="flex gap-4 items-start">
          <div className={`${colorClass} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
            {phase[0]}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">Nudges — {phase}</h4>
            <p className="text-[var(--text-muted)] mt-1">Selecione uma categoria para ver sugestões específicas</p>

            {/* Seleção de Categoria */}
            {!selectedCategory ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-4">Escolha o tipo de nudge:</p>
                {availableCategories.length > 0 ? availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="w-full p-4 text-left rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-md transition-all duration-200"
                  >
                    <div className="font-medium text-[var(--text-primary)]">{category}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">
                      {NUDGE_CATEGORIES[phase][category].length} nudges disponíveis
                    </div>
                  </button>
                )) : (
                  <div className="p-4 text-center text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                    <p>Nudges para a fase {phase} serão adicionados em breve.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Exibição do Nudge Selecionado */
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-[var(--accent-color)] hover:underline"
                  >
                    ← Voltar para categorias
                  </button>
                  <div className="text-sm text-[var(--text-muted)]">
                    {selectedCategory} • {currentNudgeIndex + 1} de {currentNudges.length}
                  </div>
                </div>

                {currentNudge && (
                  <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <div className="font-medium text-[var(--text-primary)] mb-2">{currentNudge.title}</div>
                    <div className="text-[var(--text-muted)]">{currentNudge.detail}</div>
                  </div>
                )}

                {/* Navegação entre nudges da categoria */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentNudgeIndex(i => Math.max(0, i - 1))} 
                      disabled={currentNudgeIndex === 0} 
                      className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Anterior
                    </button>
                    <button 
                      onClick={() => setCurrentNudgeIndex(i => Math.min(currentNudges.length - 1, i + 1))} 
                      disabled={currentNudgeIndex === currentNudges.length - 1} 
                      className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo →
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={onClose} 
                      className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
                    >
                      ✕ Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Botão fechar quando não há categoria selecionada */}
            {!selectedCategory && (
              <div className="flex justify-end mt-6">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
                >
                  ✕ Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function isStepCompleted(project, phase, action) {
  // Função mantida para compatibilidade, mas não é mais usada para nudges
  if (phase === 'Engage') {
    if (action === 'eng_write_bigidea') return !!(project.Engage.bigIdea && project.Engage.bigIdea.trim().length > 0);
    if (action === 'eng_write_eq') return !!(project.Engage.essentialQuestion && project.Engage.essentialQuestion.trim().length > 0);
    if (action === 'eng_add_check') return project.Engage.checklist && project.Engage.checklist.length >= 3;
  }
  if (phase === 'Investigate') {
    if (action === 'inv_answer') return (project.Investigate.answers || []).filter(a => a && a.a && a.a.trim().length > 0).length >= 1;
    if (action === 'inv_add_sources') return (project.Investigate.checklist || []).some(i => /fonte|fonte|referen/i.test(i.text) || /3 fontes/i.test(i.text));
    if (action === 'inv_synthesize') return (project.Investigate.answers || []).some(a => a && a.q && a.q.toLowerCase().includes('síntese'));
  }
  if (phase === 'Act') {
    if (action === 'act_add_prototype') return (project.Act.prototypes || []).length > 0;
    if (action === 'act_add_test_plan') return (project.Act.checklist || []).some(i => /métrica|métric|teste|sucesso/i.test(i.text));
    if (action === 'act_add_iteration') return (project.Act.checklist || []).some(i => /iteração|iterar|próximos passos/i.test(i.text));
  }
  return false;
}