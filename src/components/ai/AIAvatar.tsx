import React from 'react';

export default function AIAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? '28px' : size === 'lg' ? '48px' : '36px';
  const font = size === 'sm' ? '0.75rem' : size === 'lg' ? '1.25rem' : '0.9rem';

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00B4D8, #0077B6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: font,
        color: '#ffffff',
        fontWeight: 700,
        boxShadow: '0 4px 15px rgba(0, 180, 216, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      🤖
    </div>
  );
}
