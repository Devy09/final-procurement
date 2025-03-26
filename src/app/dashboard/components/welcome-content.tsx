'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function WelcomeContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-2xl overflow-hidden"
    >
      <div className="bg-red-950 px-6 py-8 sm:px-10 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Welcome to Procurement Management System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-white"
        >
          Please complete your profile to get started and Upload your PPMP first to initiate the Purchase Requisition
        </motion.p>
      </div>

      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative w-full h-[500px]"
        >
          <Image
            src="/Procurement Flow.png"
            alt="Procurement Flow Diagram"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
