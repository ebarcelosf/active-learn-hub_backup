// src/components/shared/ChecklistEditor.jsx
import React, { useState } from 'react';

export function ChecklistEditor({ items = [], onAdd, onToggle, onRemove }) {
  const [text, setText] = useState('');
  
  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };
  
  return (
    <div className="checklist-editor">
      {/* Lista de items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:shadow-sm transition-all duration-200"
          >
            <input 
              type="checkbox" 
              checked={!!item.done} 
              onChange={() => onToggle(item.id)}
              className="w-4 h-4 text-[var(--accent-color)] bg-[var(--bg-card)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)] cursor-pointer"
              aria-label={`Marcar "${item.text}" como ${item.done ? 'não concluído' : 'concluído'}`}
            />
            <div className={`flex-1 ${item.done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'} transition-all duration-200`}>
              {item.text}
            </div>
            <button 
              onClick={() => onRemove(item.id)} 
              className="px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--error-color)] transition-colors duration-200 hover:bg-[var(--bg-card)] rounded"
              aria-label={`Remover "${item.text}"`}
            >
              Remover
            </button>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <div className="text-2xl mb-2">📝</div>
            <p>Nenhum item na checklist ainda.</p>
            <p className="text-sm mt-1">Adicione seu primeiro item abaixo.</p>
          </div>
        )}
      </div>

      {/* Adicionar novo item */}
      <div className="mt-4 flex gap-3">
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Adicionar item à checklist..." 
          className="flex-1 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
        />
        <button 
          onClick={handleAdd}
          disabled={!text.trim()}
          className="px-4 py-3 rounded-lg bg-[var(--cbl-primary)] text-white font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
      </div>
      
      {/* Contador de progresso */}
      {items.length > 0 && (
        <div className="mt-3 text-sm text-[var(--text-muted)] text-center">
          {items.filter(item => item.done).length} de {items.length} concluído(s)
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para exibir checklist em modo somente leitura
export function ChecklistViewer({ items = [] }) {
  const completedCount = items.filter(item => item.done).length;
  
  return (
    <div className="checklist-viewer">
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-secondary)]"
          >
            <div className={`w-4 h-4 rounded ${item.done ? 'bg-[var(--success-color)]' : 'bg-[var(--border-color)]'}`}>
              {item.done && <span className="text-white text-xs">✓</span>}
            </div>
            <div className={`flex-1 ${item.done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
              {item.text}
            </div>
          </div>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="mt-3 flex justify-between text-sm text-[var(--text-muted)]">
          <span>Progresso:</span>
          <span>{completedCount}/{items.length} ({Math.round((completedCount/items.length) * 100)}%)</span>
        </div>
      )}
    </div>
  );
}