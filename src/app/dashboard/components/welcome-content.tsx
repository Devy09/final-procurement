'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, BarChart3, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function WelcomeContent() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const router = useRouter()

  const cards = [
    { 
      id: 'profile', 
      title: 'Profile', 
      description: 'View and edit your profile settings', 
      icon: User,
      href: '/dashboard/profile'
    },
    { 
      id: 'analytics', 
      title: 'Analytics', 
      description: 'Track your activity and progress', 
      icon: BarChart3,
      href: '#'
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      description: 'Customize your dashboard preferences', 
      icon: Settings,
      href: '#'
    },
  ]

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeCard === card.id ? 'ring-2 ring-red-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveCard(card.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <card.icon className="w-6 h-6 text-red-600" />
                    <span>{card.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{card.description}</CardDescription>
                  {activeCard === card.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button 
                        className="mt-4 w-full bg-red-600 hover:bg-red-700"
                        onClick={() => router.push(card.href)}
                      >
                        Go to {card.title}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

