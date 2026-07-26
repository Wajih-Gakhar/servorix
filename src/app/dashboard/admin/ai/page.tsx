'use client';

import React from 'react';
import AIChatWindow from '@/components/ai/AIChatWindow';
import { sendAdminAIMessage } from '@/app/actions/aiAdminActions';

const ADMIN_SUGGESTIONS = [
  'Summarize overall platform growth and user activity',
  'Provide gross revenue and platform fee analytics',
  'Check pending business registration approvals',
  'What are the platform moderation and review trends?',
];

export default function AdminAIPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
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
            <span>🤖</span> Servorix AI Platform Intelligence
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Global administrative analytics, ecosystem health monitoring & operational insights.
          </p>
        </div>

        {/* Admin Diagnostics Badge (Admin Portal Only) */}
        <div
          className="glass-card"
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0, 180, 216, 0.3)',
            backgroundColor: 'rgba(6, 9, 14, 0.8)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Model:</span> gemini-flash-latest
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>Pool:</span> Multi-Key ProviderManager Active
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Status:</span> HEALTHY
          </div>
        </div>
      </div>

      <AIChatWindow
        title="Servorix AI (Platform Intelligence)"
        subtitle="Global SaaS Analytics & Administrative Telemetry"
        portalType="ADMIN"
        suggestedPrompts={ADMIN_SUGGESTIONS}
        onSendMessage={async (msg) => {
          const res = await sendAdminAIMessage(msg);
          return { success: res.success, content: res.content };
        }}
      />
    </div>
  );
}
