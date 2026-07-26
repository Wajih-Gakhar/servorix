'use client';

import React, { useState } from 'react';
import AIAvatar from './AIAvatar';
import AIChatWindow from './AIChatWindow';
import { sendPublicAIMessage } from '@/app/actions/aiPublicActions';

const PUBLIC_SUGGESTED_PROMPTS = [
  'Find nearby salon & barbershop services',
  'Recommend top-rated services on Servorix',
  'How do I book an appointment?',
  'Explain service categories available',
];

export default function PublicConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 99999,
      }}
    >
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.9), rgba(0, 119, 182, 0.9))',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 8px 32px rgba(0, 180, 216, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          <AIAvatar size="sm" />
          <span>Ask Servorix AI</span>
        </button>
      )}

      {/* Expanded Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'relative',
            width: '420px',
            maxWidth: 'calc(100vw - 2rem)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            borderRadius: '1.5rem',
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 10,
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
          <AIChatWindow
            title="Servorix AI Concierge"
            subtitle="Explore services, categories & bookings"
            suggestedPrompts={PUBLIC_SUGGESTED_PROMPTS}
            onSendMessage={async (msg) => {
              const res = await sendPublicAIMessage(msg);
              return { success: res.success, content: res.content };
            }}
          />
        </div>
      )}
    </div>
  );
}
