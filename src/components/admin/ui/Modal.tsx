"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#383532]/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-sm border border-[#e9e6df] bg-[#FDFBF7] shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#e9e6df] px-6 py-5">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-xl font-bold text-[#383532]">{title}</h3>
                  {description && (
                    <p className="mt-1 text-sm text-[#8a867f] font-sans">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="-mr-2 shrink-0 rounded-full p-2 text-[#a5a098] transition-colors hover:bg-[#e9e6df]/50 hover:text-[#383532]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-x-hidden overflow-y-auto p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
