// components/shared/FormComponents.jsx
import React, { useState } from 'react';

export function ChecklistEditor({ items, onAdd, onToggle, onRemove }) {
  const [newItem, setNewItem] = useState('');
  
  function handleAdd(e) {
    e.preventDefault();
    if (!newItem.trim()) return;
    onAdd(newItem.trim());
    setNewItem('');
  }
  
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
          <input 
            type="checkbox" 
            checked={item.done} 
            onChange={() => onToggle(item.id)}
            className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-2 focus:ring-[var(--accent-color)]" 
          />
          <span className={`flex-1 ${item.done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
            {item.text}
          </span>
          <button 
            onClick={() => onRemove(item.id)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--error-color)] rounded transition-colors"
            title="Remover item"
          >
            ×
          </button>
        </div>
      ))}
      
      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          value={newItem} 
          onChange={e => setNewItem(e.target.value)} 
          placeholder="Adicionar novo item..." 
          className="flex-1 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent" 
        />
        <button 
          type="submit" 
          className="px-4 py-3 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}

export function AddPrototypeForm({ onAdd }) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (title.trim() && desc.trim()) {
      onAdd(title, desc);
      setTitle('');
      setDesc('');
      setExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDesc('');
    setExpanded(false);
  };
  
  return (
    <div className="mt-4 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-3 rounded-lg border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all duration-200"
        >
          + Adicionar novo protótipo
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Título do Protótipo
            </label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: App de reciclagem gamificado" 
              className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200" 
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Descrição
            </label>
            <textarea 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              placeholder="Descreva o protótipo, suas funcionalidades principais e como ele resolve o problema..." 
              rows={4} 
              className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200 resize-none" 
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all duration-200"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!title.trim() || !desc.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--cbl-primary)] text-white font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar Protótipo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Formulário genérico para modais - COM SCROLL FIXADO
export function ModalForm({ title, fields, onSubmit, onClose, submitText = 'Salvar' }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      {/* Modal com altura máxima e scroll */}
      <div className="bg-[var(--bg-card)] rounded-xl w-full max-w-2xl shadow-lg border border-[var(--border-color)] max-h-[90vh] flex flex-col">
        {/* Cabeçalho fixo */}
        <div className="p-6 border-b border-[var(--border-color)] flex-shrink-0">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
        
        {/* Conteúdo com scroll */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows || 3}
                    required={field.required}
                    className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                  >
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                  />
                )}
                
                {/* Dica para o campo, se existir */}
                {field.hint && (
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    💡 {field.hint}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rodapé com botões - fixo */}
          <div className="p-6 border-t border-[var(--border-color)] flex gap-3 justify-end flex-shrink-0 bg-[var(--bg-secondary)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Formulário para adicionar perguntas
export function AddQuestionForm({ onAdd }) {
  const [expanded, setExpanded] = useState(false);
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onAdd(question.trim());
      setQuestion('');
      setExpanded(false);
    }
  };

  return (
    <div className="mt-4 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-3 rounded-lg border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all duration-200"
        >
          + Adicionar nova pergunta-guia
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Nova Pergunta-Guia
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Quais são as principais barreiras para adoção da nossa solução?"
              rows={2}
              className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200 resize-none"
              autoFocus
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button 
              type="button"
              onClick={() => {
                setQuestion('');
                setExpanded(false);
              }}
              className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!question.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Componente de confirmação
export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'default' }) {
  const variantStyles = {
    default: 'bg-[var(--accent-color)] hover:bg-[var(--accent-hover)]',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700'
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-card)] p-6 rounded-xl w-full max-w-md shadow-lg border border-[var(--border-color)]">
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        <p className="text-[var(--text-muted)] mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg text-white transition-all duration-200 ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}