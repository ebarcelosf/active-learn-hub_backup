// hooks/useBadges.js - Hook simplificado sem badges de nudge por quantidade
import { useState, useCallback, useEffect, useMemo } from 'react';
import { ALL_BADGES } from '../utils/badgeConstants';

// Lista completa de badges disponíveis - 15 badges totalizando 1000 XP
const SIMPLE_BADGES = [
  // Badges das fases CBL
  { id: 'primeiro_passo', title: 'Primeiro Passo', desc: 'Escreveu sua Big Idea', xp: 40, icon: '🎯' },
  { id: 'questionador', title: 'Questionador', desc: 'Criou sua Essential Question', xp: 35, icon: '❓' },
  { id: 'desafiador', title: 'Desafiador', desc: 'Definiu seu Challenge', xp: 40, icon: '⚡' },
  { id: 'visionario', title: 'Visionário', desc: 'Complete a fase Engage', xp: 100, icon: '🌟' },
  { id: 'investigador_iniciante', title: 'Investigador', desc: 'Respondeu sua primeira pergunta-guia', xp: 40, icon: '🔍' },
  { id: 'pesquisador', title: 'Pesquisador', desc: 'Respondeu 3 perguntas-guia', xp: 60, icon: '📚' },
  { id: 'analista', title: 'Analista', desc: 'Respondeu 5 perguntas-guia', xp: 70, icon: '🧠' },
  { id: 'coletor', title: 'Coletor', desc: 'Adicionou recursos de pesquisa', xp: 30, icon: '📖' },
  { id: 'bibliotecario', title: 'Bibliotecário', desc: 'Coletou 3 recursos de pesquisa', xp: 50, icon: '📚' },
  { id: 'planejador', title: 'Planejador', desc: 'Criou sua primeira atividade', xp: 45, icon: '📋' },
  { id: 'criador', title: 'Criador', desc: 'Criou seu primeiro protótipo', xp: 80, icon: '🛠️' },
  { id: 'inovador', title: 'Inovador', desc: 'Criou 3+ protótipos', xp: 90, icon: '🚀' },
  { id: 'implementador', title: 'Implementador', desc: 'Complete a fase Act', xp: 140, icon: '⚡' },
  
  // Badge especial para nudges (ÚNICO)
  { id: 'inspirado', title: 'Inspirado', desc: 'Obteve um nudge para inspiração', xp: 30, icon: '💡' },
  
  // Badge maestria
  { id: 'mestre_cbl', title: 'Mestre CBL', desc: 'Complete todo o ciclo CBL', xp: 150, icon: '🏆' }
];

export function useBadges() {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [recentBadge, setRecentBadge] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Carregar badges salvos no localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('ALH_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.badges && Array.isArray(data.badges)) {
          setEarnedBadges(data.badges);
        }
      } catch (error) {
        console.warn('Erro ao carregar badges do localStorage:', error);
      }
    }
  }, []);

  // Salvar badges no localStorage sempre que mudarem
  useEffect(() => {
    const savedData = localStorage.getItem('ALH_data');
    let data = {};
    
    if (savedData) {
      try {
        data = JSON.parse(savedData);
      } catch (error) {
        console.warn('Erro ao parsear dados salvos:', error);
      }
    }
    
    data.badges = earnedBadges;
    localStorage.setItem('ALH_data', JSON.stringify(data));
  }, [earnedBadges]);

  // IDs dos badges conquistados
  const earnedBadgeIds = useMemo(() => earnedBadges.map(badge => badge.id), [earnedBadges]);

  // Estatísticas
  const totalXP = useMemo(() => earnedBadges.reduce((sum, badge) => sum + (badge.xp || 0), 0), [earnedBadges]);
  const level = useMemo(() => Math.floor(totalXP / 100) + 1, [totalXP]);
  const xpForNextLevel = useMemo(() => (level * 100) - totalXP, [level, totalXP]);

  // Função principal para conceder badge
  const grantBadge = useCallback((badgeData) => {
    if (!badgeData || !badgeData.id) {
      console.warn('Badge data inválida:', badgeData);
      return;
    }

    // Verificar se já possui o badge
    if (earnedBadgeIds.includes(badgeData.id)) {
      return; // Já possui, não conceder novamente
    }

    const newBadge = {
      id: badgeData.id,
      title: badgeData.title,
      desc: badgeData.desc,
      xp: badgeData.xp || 0,
      icon: badgeData.icon || '🏅',
      earnedAt: new Date().toISOString()
    };

    setEarnedBadges(prev => [...prev, newBadge]);
    setRecentBadge(newBadge);
    setShowNotification(true);
    
    // Auto-hide notification após 4 segundos
    setTimeout(() => setShowNotification(false), 4000);

    console.log(`Badge conquistado: ${newBadge.title} (+${newBadge.xp} XP)`);
  }, [earnedBadgeIds]);

  // Função para verificar se pode conquistar badge
  const canEarnBadge = useCallback((badgeId) => {
    return !earnedBadgeIds.includes(badgeId);
  }, [earnedBadgeIds]);

  // Função para obter progresso para um badge específico
  const getBadgeProgress = useCallback((badgeId, currentValue, targetValue) => {
    if (!canEarnBadge(badgeId)) return { completed: true, percentage: 100 };
    
    const percentage = Math.min((currentValue / targetValue) * 100, 100);
    return {
      completed: percentage >= 100,
      percentage: Math.round(percentage),
      remaining: Math.max(targetValue - currentValue, 0)
    };
  }, [canEarnBadge]);

  // Função para verificar triggers específicos (ATUALIZADA)
  const checkTrigger = useCallback((trigger, data = {}) => {
    // Filtrar badges que podem ser conquistados com este trigger
    const triggersToCheck = SIMPLE_BADGES.filter(badge => 
      canEarnBadge(badge.id) && 
      (
        // Mapear triggers básicos
        (trigger === 'big_idea_created' && badge.id === 'primeiro_passo') ||
        (trigger === 'essential_question_created' && badge.id === 'questionador') ||
        (trigger === 'challenge_defined' && badge.id === 'desafiador') ||
        (trigger === 'engage_completed' && badge.id === 'visionario') ||
        (trigger === 'first_question_answered' && badge.id === 'investigador_iniciante') ||
        (trigger === 'three_questions_answered' && badge.id === 'pesquisador') ||
        (trigger === 'five_questions_answered' && badge.id === 'analista') ||
        (trigger === 'resources_added' && badge.id === 'coletor') ||
        (trigger === 'multiple_resources_collected' && badge.id === 'bibliotecario') ||
        (trigger === 'activity_created' && badge.id === 'planejador') ||
        (trigger === 'prototype_created' && badge.id === 'criador') ||
        (trigger === 'multiple_prototypes_created' && badge.id === 'inovador') ||
        (trigger === 'act_completed' && badge.id === 'implementador') ||
        (trigger === 'nudge_obtained' && badge.id === 'inspirado') ||
        (trigger === 'cbl_cycle_completed' && badge.id === 'mestre_cbl')
      )
    );

    triggersToCheck.forEach(badge => {
      let shouldGrant = false;

      switch (trigger) {
        case 'big_idea_created':
        case 'essential_question_created':
        case 'challenge_defined':
        case 'engage_completed':
        case 'first_question_answered':
        case 'resources_added':
        case 'activity_created':
        case 'prototype_created':
        case 'act_completed':
        case 'nudge_obtained':
        case 'cbl_cycle_completed':
          shouldGrant = true;
          break;
        case 'three_questions_answered':
          shouldGrant = (data.questionsAnswered || 0) >= 3;
          break;
        case 'five_questions_answered':
          shouldGrant = (data.questionsAnswered || 0) >= 5;
          break;
        case 'multiple_resources_collected':
          shouldGrant = (data.resourcesCount || 0) >= 3;
          break;
        case 'multiple_prototypes_created':
          shouldGrant = (data.prototypesCount || 0) >= 3;
          break;
        default:
          shouldGrant = data.shouldGrant || false;
      }

      if (shouldGrant) {
        grantBadge(badge);
      }
    });
  }, [canEarnBadge, grantBadge]);

  // Função para fechar notificação
  const dismissNotification = useCallback(() => {
    setShowNotification(false);
    setTimeout(() => setRecentBadge(null), 300);
  }, []);

  // Função para obter badges por categoria (SIMPLIFICADA)
  const getBadgesByCategory = useCallback(() => {
    const categorized = {
      'CBL': { earned: [], unearned: [] },
      'Especiais': { earned: [], unearned: [] }
    };
    
    SIMPLE_BADGES.forEach(badge => {
      const category = badge.id === 'inspirado' || badge.id === 'mestre_cbl' ? 'Especiais' : 'CBL';
      
      const isEarned = earnedBadgeIds.includes(badge.id);
      if (isEarned) {
        const earnedBadge = earnedBadges.find(b => b.id === badge.id);
        categorized[category].earned.push(earnedBadge || badge);
      } else {
        categorized[category].unearned.push(badge);
      }
    });
    
    return categorized;
  }, [earnedBadgeIds, earnedBadges]);

  // Função para obter próximos badges sugeridos
  const getNextBadgesSuggestions = useCallback(() => {
    const suggestions = [];
    
    // Badges das fases CBL se ainda não completou
    if (!earnedBadgeIds.includes('primeiro_passo')) {
      suggestions.push({ 
        badge: SIMPLE_BADGES.find(b => b.id === 'primeiro_passo'), 
        tip: 'Escreva sua Big Idea para começar!' 
      });
    }
    if (!earnedBadgeIds.includes('questionador')) {
      suggestions.push({ 
        badge: SIMPLE_BADGES.find(b => b.id === 'questionador'), 
        tip: 'Crie sua Essential Question' 
      });
    }
    if (!earnedBadgeIds.includes('desafiador')) {
      suggestions.push({ 
        badge: SIMPLE_BADGES.find(b => b.id === 'desafiador'), 
        tip: 'Defina seu Challenge' 
      });
    }
    if (!earnedBadgeIds.includes('investigador_iniciante')) {
      suggestions.push({ 
        badge: SIMPLE_BADGES.find(b => b.id === 'investigador_iniciante'), 
        tip: 'Responda sua primeira pergunta-guia' 
      });
    }
    
    return suggestions.slice(0, 3).filter(s => s.badge); // Retornar apenas os 3 primeiros válidos
  }, [earnedBadgeIds]);

  return {
    // Estado
    earnedBadges,
    recentBadge,
    showNotification,
    
    // Estatísticas
    totalXP,
    level,
    xpForNextLevel,
    earnedCount: earnedBadges.length,
    totalCount: SIMPLE_BADGES.length,
    progressPercentage: Math.round((earnedBadges.length / SIMPLE_BADGES.length) * 100),
    
    // Funções principais
    grantBadge,
    checkTrigger,
    canEarnBadge,
    getBadgeProgress,
    dismissNotification,
    
    // Funções auxiliares
    getBadgesByCategory,
    getNextBadgesSuggestions,
    
    // Lista de badges disponíveis
    availableBadges: SIMPLE_BADGES
  };
}