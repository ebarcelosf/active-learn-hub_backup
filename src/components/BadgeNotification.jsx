// components/BadgeNotification.jsx
import React, { useEffect, useState } from 'react';
import { getBadgeRarityColor } from '../utils/badgeConstants';

export function BadgeNotification({ badge, isVisible, onDismiss }) {
  const [animationPhase, setAnimationPhase] = useState('entering');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('entering');
      
      // Fase de entrada -> visível
      const enterTimer = setTimeout(() => {
        setAnimationPhase('visible');
      }, 100);

      // Auto-dismiss após 4 segundos
      const dismissTimer = setTimeout(() => {
        setAnimationPhase('exiting');
        setTimeout(onDismiss, 500);
      }, 4000);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [isVisible, onDismiss]);

  if (!badge || !isVisible) return null;

  const rarityColor = getBadgeRarityColor(badge.rarity || 'common');

  const getAnimationClasses = () => {
    const baseClasses = "fixed top-6 right-6 z-50 max-w-sm transform transition-all duration-500 ease-out";
    
    switch (animationPhase) {
      case 'entering':
        return `${baseClasses} translate-x-full opacity-0 scale-95`;
      case 'visible':
        return `${baseClasses} translate-x-0 opacity-100 scale-100`;
      case 'exiting':
        return `${baseClasses} translate-x-full opacity-0 scale-95`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getAnimationClasses()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full" style={{ backgroundColor: rarityColor }} />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full" style={{ backgroundColor: rarityColor }} />
        </div>
        
        {/* Header com animação de confete */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Novo Badge!
              </h3>
            </div>
            <button
              onClick={() => {
                setAnimationPhase('exiting');
                setTimeout(onDismiss, 300);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Badge info principal */}
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform animate-bounce"
              style={{ backgroundColor: rarityColor }}
            >
              {badge.icon || '🏅'}
            </div>
            
            <div className="flex-grow">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {badge.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {badge.desc}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer com XP e categoria */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-lg" style={{ color: rarityColor }}>
              +{badge.xp} XP
            </span>
          </div>
          
          {badge.category && (
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: rarityColor }}
            >
              {badge.category}
            </span>
          )}
          
          {badge.rarity && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: getRarityStars(badge.rarity) }).map((_, i) => (
                  <span 
                    key={i} 
                    className="text-yellow-400 text-sm animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Barra de progresso animada */}
        <div className="relative z-10 mt-4">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transform transition-transform duration-1000 ease-out"
              style={{ 
                backgroundColor: rarityColor,
                transform: animationPhase === 'visible' ? 'translateX(0)' : 'translateX(-100%)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para múltiplas notificações em fila
export function BadgeNotificationStack({ badges, onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (badges.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= badges.length) {
      setCurrentIndex(0);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 4500); // Slightly longer than individual notification

    return () => clearTimeout(timer);
  }, [badges, currentIndex]);

  if (!badges || badges.length === 0) return null;

  const currentBadge = badges[currentIndex];
  const isVisible = currentIndex < badges.length && currentBadge;

  return (
    <>
      <BadgeNotification
        badge={currentBadge}
        isVisible={isVisible}
        onDismiss={() => {
          if (currentIndex === badges.length - 1) {
            onDismiss();
          } else {
            setCurrentIndex(prev => prev + 1);
          }
        }}
      />
      
      {/* Contador de badges restantes */}
      {badges.length > 1 && currentIndex < badges.length && (
        <div className="fixed top-20 right-6 z-40">
          <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentIndex + 1} de {badges.length}
          </div>
        </div>
      )}
    </>
  );
}

// Função auxiliar para determinar número de estrelas por raridade
function getRarityStars(rarity) {
  const rarityMap = {
    'common': 1,
    'uncommon': 2,
    'rare': 3,
    'epic': 4,
    'legendary': 5
  };
  return rarityMap[rarity] || 1;
}

// Hook personalizado para usar com o sistema de notificações
export function useBadgeNotifications() {
  const [notificationQueue, setNotificationQueue] = useState([]);

  const addNotification = (badge) => {
    setNotificationQueue(prev => [...prev, {
      ...badge,
      id: Date.now() + Math.random(),
      timestamp: Date.now()
    }]);
  };

  const clearNotifications = () => {
    setNotificationQueue([]);
  };

  const removeNotification = (badgeId) => {
    setNotificationQueue(prev => prev.filter(badge => badge.id !== badgeId));
  };

  return {
    notifications: notificationQueue,
    addNotification,
    clearNotifications,
    removeNotification,
    hasNotifications: notificationQueue.length > 0
  };
}