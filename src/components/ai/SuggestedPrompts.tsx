import React from 'react';

interface SuggestedPromptsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ suggestions, onSelect }: SuggestedPromptsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div style={{ margin: '1rem 0' }}>
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Suggested Prompts
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
        {suggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(prompt)}
            style={{
              textAlign: 'left',
              fontSize: '0.8rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 180, 216, 0.15)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <span>{prompt}</span>
            <span style={{ color: 'var(--color-primary)', marginLeft: '0.5rem' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
