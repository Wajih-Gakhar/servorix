'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AIAvatar from './AIAvatar';

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface AIMessageBubbleProps {
  message: MessageItem;
  onRegenerate?: (prompt?: string) => void;
}

export default function AIMessageBubble({ message, onRegenerate }: AIMessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        margin: '0.75rem 0',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {!isUser && <AIAvatar size="sm" />}
      <div
        style={{
          maxWidth: '85%',
          padding: '0.85rem 1.15rem',
          borderRadius: '1rem',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          backgroundColor: isUser ? 'var(--color-accent)' : 'rgba(12, 18, 26, 0.9)',
          color: '#ffffff',
          border: isUser ? '1px solid rgba(0, 180, 216, 0.4)' : '1px solid var(--border-color)',
          borderTopRightRadius: isUser ? '2px' : '1rem',
          borderTopLeftRadius: !isUser ? '2px' : '1rem',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
        }}
      >
        <div style={{ color: isUser ? '#ffffff' : 'var(--text-primary)' }}>{message.content}</div>

        {/* Action Controls for Assistant Messages */}
        {!isUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              paddingTop: '0.4rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy AI response"
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? 'var(--color-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✅ Copied' : '📋 Copy'}
              </button>

              {onRegenerate && (
                <button
                  type="button"
                  onClick={() => onRegenerate()}
                  aria-label="Regenerate AI response"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '0.25rem',
                    transition: 'all 0.2s',
                  }}
                >
                  🔄 Regenerate
                </button>
              )}
            </div>
          </div>
        )}

        {isUser && message.timestamp && (
          <div
            style={{
              fontSize: '0.68rem',
              marginTop: '0.35rem',
              opacity: 0.7,
              textAlign: 'right',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
