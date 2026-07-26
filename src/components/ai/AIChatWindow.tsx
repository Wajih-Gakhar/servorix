'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from './AIAvatar';
import AIMessageBubble, { MessageItem } from './AIMessageBubble';
import SuggestedPrompts from './SuggestedPrompts';
import AIChatInput from './AIChatInput';

interface AIChatWindowProps {
  title?: string;
  subtitle?: string;
  suggestedPrompts?: string[];
  onSendMessage: (message: string) => Promise<{ success: boolean; content: string }>;
  initialMessages?: MessageItem[];
  portalType?: 'PUBLIC' | 'CUSTOMER' | 'OWNER' | 'ADMIN';
}

export default function AIChatWindow({
  title = 'Servorix AI',
  subtitle = 'Your intelligent SaaS assistant',
  suggestedPrompts = [],
  onSendMessage,
  initialMessages = [],
  portalType = 'PUBLIC',
}: AIChatWindowProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (content: string) => {
    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await onSendMessage(content);
      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '🤖 Servorix AI is temporarily busy. Your data remains safe. Please try again in about one minute.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (loading || messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      await handleSend(lastUserMsg.content);
    }
  };

  const getPortalWelcome = () => {
    switch (portalType) {
      case 'CUSTOMER':
        return {
          headline: 'Customer AI Assistant',
          description: 'Manage your bookings, view appointment details, or discover open slots.',
        };
      case 'OWNER':
        return {
          headline: 'Owner AI Suite',
          description: 'Analyze performance, optimize pricing, or generate instant marketing campaigns.',
        };
      case 'ADMIN':
        return {
          headline: 'Platform Intelligence',
          description: 'Monitor global platform statistics, registered businesses, and user growth.',
        };
      default:
        return {
          headline: 'Servorix AI Concierge',
          description: 'Discover top local businesses, compare services, and explore pricing options.',
        };
    }
  };

  const welcome = getPortalWelcome();

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '560px',
        maxHeight: '80vh',
        width: '100%',
        margin: '0 auto',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <AIAvatar size="md" />
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {title}
            <span
              style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 180, 216, 0.15)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(0, 180, 216, 0.3)',
                fontWeight: 600,
              }}
            >
              Native AI
            </span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{subtitle}</p>
        </div>
      </div>

      {/* Messages Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', margin: 'auto 0' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <AIAvatar size="lg" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Welcome to 🤖 {welcome.headline}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1rem' }}>
              {welcome.description} Select a prompt below or type a message to start.
            </p>
            {suggestedPrompts.length > 0 && (
              <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <SuggestedPrompts suggestions={suggestedPrompts} onSelect={handleSend} />
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <AIMessageBubble key={msg.id} message={msg} onRegenerate={handleRegenerate} />
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}
          >
            <AIAvatar size="sm" />
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(12, 18, 26, 0.85)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>🤖 Servorix AI is thinking</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ color: 'var(--color-primary)' }}
              >
                ●
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                style={{ color: 'var(--color-primary)' }}
              >
                ●
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                style={{ color: 'var(--color-primary)' }}
              >
                ●
              </motion.span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'rgba(6, 9, 14, 0.8)',
        }}
      >
        <AIChatInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
