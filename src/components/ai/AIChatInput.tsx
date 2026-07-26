'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AIChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
  placeholder?: string;
}

export default function AIChatInput({ onSend, loading, placeholder }: AIChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input when loading finishes
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder={placeholder || 'Ask Servorix AI anything... (Press Enter to send, Shift+Enter for newline)'}
        aria-label="Ask Servorix AI message prompt"
        style={{
          width: '100%',
          paddingLeft: '1rem',
          paddingRight: '4rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          borderRadius: '0.85rem',
          backgroundColor: 'rgba(6, 9, 14, 0.95)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          outline: 'none',
          backdropFilter: 'blur(10px)',
          resize: 'none',
          fontFamily: 'inherit',
          lineHeight: '1.4',
          maxHeight: '120px',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s ease',
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        aria-label="Send Message to Servorix AI"
        className="btn btn-primary"
        style={{
          position: 'absolute',
          right: '0.6rem',
          padding: '0.45rem 0.9rem',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: !text.trim() || loading ? 'not-allowed' : 'pointer',
          opacity: !text.trim() || loading ? 0.4 : 1,
        }}
      >
        {loading ? '⏳' : 'Send'}
      </button>
    </form>
  );
}
