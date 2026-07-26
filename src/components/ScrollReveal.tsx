'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function ScrollReveal({ children, delay = 0, y = 50 }: { children: ReactNode, delay?: number, y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: delay, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {children}
    </motion.div>
  )
}
