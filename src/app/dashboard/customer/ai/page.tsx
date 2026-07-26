'use client';

import React from 'react';
import AIChatWindow from '@/components/ai/AIChatWindow';
import { sendCustomerAIMessage } from '@/app/actions/aiCustomerActions';

const CUSTOMER_SUGGESTIONS = [
  'What appointments do I have coming up?',
  'Recommend top salon & fitness services for me',
  'Find available booking slots for barbershops',
  'How do I cancel or reschedule a booking?',
];

export default function CustomerAIPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
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
          <span>🤖</span> Servorix AI Booking Assistant
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Your personal AI concierge for discovering services, checking slots, and managing appointments.
        </p>
      </div>

      <AIChatWindow
        title="Servorix AI Assistant"
        subtitle="Customer Appointment & Discovery Intelligence"
        portalType="CUSTOMER"
        suggestedPrompts={CUSTOMER_SUGGESTIONS}
        onSendMessage={async (msg) => {
          const res = await sendCustomerAIMessage(msg);
          return { success: res.success, content: res.content };
        }}
      />
    </div>
  );
}
