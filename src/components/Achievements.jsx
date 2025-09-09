// components/Achievements.jsx - Versão Atualizada com Badges Simplificados
import React, { useState } from 'react';

// Lista de badges com valores ajustados para totalizar EXATAMENTE 1000 XP
const ALL_AVAILABLE_BADGES = [
  // ENGAGE - Badges da fase Engage
  { id: 'primeiro_passo', title: 'Primeiro Passo', desc: 'Escreva sua Big Idea', xp: 30, icon: '🎯' },
  { id: 'questionador', title: 'Questionador', desc: 'Crie sua Essential Question', xp: 30, icon: '❓' },
  { id: 'desafiador', title: 'Desafiador', desc: 'Defina seu Challenge', xp: 30, icon: '⚡' },
  { id: 'visionario', title: 'Visionário', desc: 'Complete a fase Engage', xp: 100, icon: '🌟' },

  // INVESTIGATE - Badges da fase Investigate
  { id: 'investigador_iniciante', title: 'Investigador', desc: 'Responda sua primeira pergunta-guia', xp: 50, icon: '🔍' },
  { id: 'pesquisador', title: 'Pesquisador', desc: 'Responda 3 perguntas-guia', xp: 50, icon: '📚' },
  { id: 'analista', title: 'Analista', desc: 'Responda 5 perguntas-guia', xp: 100, icon: '🧠' },
  { id: 'coletor', title: 'Coletor', desc: 'Adicione recursos de pesquisa', xp: 50, icon: '📖' },
  { id: 'bibliotecario', title: 'Bibliotecário', desc: 'Colete 3 recursos de pesquisa', xp: 50, icon: '📚' },

  // ACT - Badges da fase Act
  { id: 'planejador', title: 'Planejador', desc: 'Crie sua primeira atividade', xp: 50, icon: '📋' },
  { id: 'criador', title: 'Criador', desc: 'Crie seu primeiro protótipo', xp: 50, icon: '🛠️' },
  { id: 'inovador', title: 'Inovador', desc: 'Crie 3+ protótipos', xp: 50, icon: '🚀' },
  { id: 'implementador', title: 'Implementador', desc: 'Complete a fase Act', xp: 100, icon: '⚡' },

  // ESPECIAL - Badge único para nudges
  { id: 'inspirado', title: 'Inspirado', desc: 'Obteve um nudge para inspiração', xp: 50, icon: '💡' },

  // MAESTRIA - Badge final
  { id: 'mestre_cbl', title: 'Mestre CBL', desc: 'Complete todo o ciclo CBL', xp: 210, icon: '🏆' }
];

function StatsCard({ icon, title, value, valueColor, bgColor, isActive = false }) {
  const gradientClass = `bg-gradient-to-br from-${bgColor}/10 to-${bgColor}/20`;
  
  return (
    <div className={`p-6 rounded-2xl shadow-lg border border-[var(--border-color)] transition-all duration-300 ${
      isActive ? 'ring-2 ring-[var(--accent-color)] scale-105' : 'hover:shadow-xl'
    } ${gradientClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md bg-white/80`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
              <div className="text-3xl font-bold" style={{ color: valueColor }}>{value}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSelector({ activeSection, setActiveSection, earnedCount, availableCount }) {
  const sections = [
    { id: 'earned', label: 'Conquistadas', count: earnedCount, color: 'text-green-600' },
    { id: 'available', label: 'Disponíveis', count: availableCount, color: 'text-blue-600' }
  ];

  return (
    <div className="flex rounded-2xl bg-[var(--bg-secondary)] p-2 mb-6 shadow-sm border border-[var(--border-color)]">
      {sections.map(section => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            activeSection === section.id
              ? 'bg-[var(--accent-color)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {section.id === 'earned' ? '🏆' : '🎯'}
            </span>
            <div className="flex flex-col items-start">
              <div className="font-semibold">{section.label}</div>
              <div className={`text-xs ${
                activeSection === section.id ? 'text-white/80' : section.color
              }`}>
                {section.count} {section.count === 1 ? 'badge' : 'badges'}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function BadgeItem({ badge, earned = true }) {
  // Cores diferentes para cada tipo de badge
  const getBadgeColor = (badgeId) => {
    if (badgeId?.includes('visionario')) return 'bg-blue-500';
    if (badgeId?.includes('investigador') || badgeId?.includes('pesquisador')) return 'bg-green-500';
    if (badgeId?.includes('implementador') || badgeId?.includes('criador')) return 'bg-purple-500';
    if (badgeId?.includes('inspirado')) return 'bg-yellow-500'; // Novo badge de nudge
    if (badgeId?.includes('primeiro_passo')) return 'bg-pink-500';
    if (badgeId?.includes('mestre_cbl')) return 'bg-gold-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
      earned 
        ? 'bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 hover:shadow-md' 
        : 'bg-[var(--bg-card)] border border-[var(--border-color)] opacity-60'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
        earned ? getBadgeColor(badge.id) : 'bg-[var(--text-muted)]'
      }`}>
        {badge.icon || '🏅'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-semibold text-[var(--text-primary)] text-base">{badge.title}</div>
          {!earned && (
            <span className="text-xs bg-[var(--bg-secondary)] text-[var(--text-muted)] px-2 py-1 rounded-full">
              Não conquistado
            </span>
          )}
        </div>
        <div className="text-sm text-[var(--text-muted)] mb-2">{badge.desc}</div>
        <div className={`text-xs font-medium ${earned ? 'text-[var(--success-color)]' : 'text-[var(--text-muted)]'}`}>
          +{badge.xp} XP
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }) {
  const emptyStates = {
    earned: {
      icon: '🎯',
      title: 'Nenhuma conquista ainda',
      description: 'Complete as fases do CBL para ganhar badges e XP!',
      tip: '💡 Próximo passo: Crie um projeto CBL e escreva sua Big Idea!'
    },
    available: {
      icon: '🎉',
      title: 'Parabéns!',
      description: 'Você conquistou todos os badges disponíveis!',
      tip: '🏆 Você é um verdadeiro mestre do CBL!'
    }
  };

  const state = emptyStates[type];

  return (
    <div className="text-center bg-[var(--bg-card)] p-12 rounded-2xl shadow-lg border border-[var(--border-color)]">
      <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-4xl mx-auto mb-4 border border-[var(--border-color)]">
        {state.icon}
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{state.title}</h3>
      <p className="text-[var(--text-muted)] mb-6">{state.description}</p>
      <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)] max-w-md mx-auto">
        <p><strong className="text-[var(--text-primary)]">{state.tip}</strong></p>
      </div>
    </div>
  );
}

export default function AchievementsScreen({ userData }) {
  const [activeSection, setActiveSection] = useState('earned');

  const userBadges = userData?.badges || [];
  const userBadgeIds = userBadges.map(badge => badge.id);
  const availableBadges = ALL_AVAILABLE_BADGES.filter(badge => !userBadgeIds.includes(badge.id));
  
  const totalXP = userBadges.reduce((sum, badge) => sum + (badge.xp || 0), 0);
  const badgeCount = userBadges.length;
  const totalBadges = ALL_AVAILABLE_BADGES.length;
  const progressPercentage = Math.round((badgeCount / totalBadges) * 100);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">🏆 Conquistas</h2>
        <p className="text-[var(--text-muted)]">Acompanhe seu progresso e conquistas no ActiveLearn Hub</p>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon="⭐"
          title="Total de XP"
          value={totalXP}
          valueColor="#3B82F6"
          bgColor="blue"
        />
        <StatsCard
          icon="🏅"
          title="Badges"
          value={`${badgeCount}/${totalBadges}`}
          valueColor="#10B981"
          bgColor="green"
        />
        <StatsCard
          icon="📊"
          title="Progresso"
          value={`${progressPercentage}%`}
          valueColor="#F59E0B"
          bgColor="yellow"
        />
      </div>

      {/* Seletor de seção */}
      <SectionSelector
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        earnedCount={badgeCount}
        availableCount={availableBadges.length}
      />

      {/* Lista de badges */}
      <div className="space-y-4">
        {activeSection === 'earned' ? (
          userBadges.length > 0 ? (
            userBadges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} earned={true} />
            ))
          ) : (
            <EmptyState type="earned" />
          )
        ) : (
          availableBadges.length > 0 ? (
            availableBadges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} earned={false} />
            ))
          ) : (
            <EmptyState type="available" />
          )
        )}
      </div>
    </div>
  );
}

// Exportar também a lista de badges para uso em outros componentes
export { ALL_AVAILABLE_BADGES };