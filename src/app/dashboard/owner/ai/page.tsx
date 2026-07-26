'use client';

import React, { useState } from 'react';
import AIChatWindow from '@/components/ai/AIChatWindow';
import { sendOwnerAIMessage } from '@/app/actions/aiOwnerActions';
import { OwnerPersona } from '@/lib/ai/registry';

const PERSONA_CONFIGS: Record<
  OwnerPersona,
  {
    title: string;
    subtitle: string;
    badge: string;
    suggestions: string[];
  }
> = {
  BUSINESS: {
    title: 'AI Business Advisor',
    subtitle: 'Optimize scheduling, operational efficiency, and customer retention',
    badge: 'Advisor',
    suggestions: [
      'How can I reduce appointment cancellations?',
      'Give me tips to improve customer retention',
      'How should I optimize my service pricing and durations?',
      'Suggest ways to fill empty weekday slots',
    ],
  },
  ANALYTICS: {
    title: 'AI Analytics Intelligence',
    subtitle: 'Convert metrics into plain-language insights & performance trends',
    badge: 'Analytics',
    suggestions: [
      'Explain my revenue and booking trends this month',
      'What are my peak booking hours and top services?',
      'Analyze my customer retention rate and repeat visits',
      'Summarize my business financial performance',
    ],
  },
  MARKETING: {
    title: 'AI Marketing Studio',
    subtitle: 'Generate high-converting social posts, WhatsApp blasts, and email campaigns',
    badge: 'Marketing',
    suggestions: [
      'Generate an Instagram caption promoting a 20% weekend discount',
      'Draft a friendly WhatsApp message for inactive customers',
      'Create an email newsletter announcing new grooming/fitness services',
      'Write an SEO-optimized description for my services',
    ],
  },
};

export default function OwnerAIPage() {
  const [activePersona, setActivePersona] = useState<OwnerPersona>('BUSINESS');
  const currentConfig = PERSONA_CONFIGS[activePersona];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Header & Tabs Container */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span>🤖</span> Servorix AI Owner Suite
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Intelligent business guidance, analytics translation & automated marketing content.
          </p>
        </div>

        {/* Persona Mode Switcher Tabs */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem',
            backgroundColor: 'rgba(12, 18, 26, 0.85)',
            border: '1px solid var(--border-color)',
            borderRadius: '1rem',
            backdropFilter: 'blur(12px)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {(['BUSINESS', 'ANALYTICS', 'MARKETING'] as OwnerPersona[]).map((mode) => {
            const isActive = activePersona === mode;
            return (
              <button
                key={mode}
                onClick={() => setActivePersona(mode)}
                style={{
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive
                    ? 'var(--color-primary)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: isActive
                    ? '0 4px 15px rgba(0, 180, 216, 0.4)'
                    : 'none',
                }}
              >
                {mode === 'BUSINESS'
                  ? '🏢 Advisor'
                  : mode === 'ANALYTICS'
                  ? '📊 Analytics'
                  : '🎨 Marketing'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main AI Chat Window */}
      <AIChatWindow
        key={activePersona}
        title={`Servorix AI (${currentConfig.badge})`}
        subtitle={currentConfig.subtitle}
        portalType="OWNER"
        suggestedPrompts={currentConfig.suggestions}
        onSendMessage={async (msg) => {
          const res = await sendOwnerAIMessage(msg, activePersona);
          return { success: res.success, content: res.content };
        }}
      />
    </div>
  );
}
