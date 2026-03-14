import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
  maxWidth?: string;
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  description,
  maxWidth = "max-w-md" 
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`bg-white dark:bg-slate-900 w-full ${maxWidth} rounded-2xl p-6 shadow-2xl relative z-10 overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {description && (
              <p className="text-sm text-slate-500 mb-6">{description}</p>
            )}
            
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
              {children}
            </div>
            
            {/* Action buttons could also go here, but for flexibility we can let children handle it */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
