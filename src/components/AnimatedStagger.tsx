'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function StaggerContainer({ children, className = '', style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          }
        }
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', directional = 'up', style }: { children: ReactNode, className?: string, directional?: 'up' | 'left' | 'right', style?: React.CSSProperties }) {
  const getInitialOffset = () => {
      if (directional === 'up') return { y: 50, opacity: 0 }
      if (directional === 'left') return { x: -50, opacity: 0 }
      if (directional === 'right') return { x: 50, opacity: 0 }
      return { y: 50, opacity: 0 }
  }

  return (
    <motion.div
      variants={{
        hidden: getInitialOffset(),
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration: 0.6,
            ease: [0.165, 0.84, 0.44, 1]
          }
        }
      }}
      className={className}
      style={{ height: '100%', ...style }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedSection({ children, className = '', directional = 'up', delay = 0, style }: { children: ReactNode, className?: string, directional?: 'up' | 'left' | 'right', delay?: number, style?: React.CSSProperties }) {
  const getInitialOffset = () => {
      if (directional === 'up') return { y: 50, opacity: 0 }
      if (directional === 'left') return { x: -50, opacity: 0 }
      if (directional === 'right') return { x: 50, opacity: 0 }
      return { y: 50, opacity: 0 }
  }

  return (
    <motion.div
      initial={getInitialOffset()}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: delay, ease: [0.165, 0.84, 0.44, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
