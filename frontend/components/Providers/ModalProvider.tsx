"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';

interface ModalContextType {
    showAlert: (title: string, message: string, type?: 'info' | 'error' | 'success') => void;
    showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within a ModalProvider');
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<{
        title: string;
        message: string;
        type: 'alert' | 'confirm';
        variant: 'info' | 'error' | 'success';
        onConfirm?: () => void;
        onCancel?: () => void;
    }>({
        title: '',
        message: '',
        type: 'alert',
        variant: 'info'
    });

    const showAlert = (title: string, message: string, variant: 'info' | 'error' | 'success' = 'info') => {
        setConfig({ title, message, type: 'alert', variant });
        setIsOpen(true);
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
        setConfig({ title, message, type: 'confirm', variant: 'info', onConfirm, onCancel });
        setIsOpen(true);
    };

    const handleConfirm = () => {
        if (config.onConfirm) config.onConfirm();
        setIsOpen(false);
    };

    const handleCancel = () => {
        if (config.onCancel) config.onCancel();
        setIsOpen(false);
    };

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={config.title}
            >
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className={`shrink-0 size-12 rounded-2xl flex items-center justify-center ${
                            config.variant === 'error' ? 'bg-red-50 text-red-600' :
                            config.variant === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                            <Icon name={
                                config.variant === 'error' ? 'error' :
                                config.variant === 'success' ? 'check_circle' :
                                'info'
                            } className="material-symbols-outlined" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed pt-2">
                            {config.message}
                        </p>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        {config.type === 'confirm' && (
                            <button
                                onClick={handleCancel}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest ${
                                config.variant === 'error' ? 'bg-red-500 shadow-red-500/20' :
                                config.variant === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                'bg-primary shadow-primary/20'
                            }`}
                        >
                            {config.type === 'confirm' ? 'Confirm' : 'Okay'}
                        </button>
                    </div>
                </div>
            </Modal>
        </ModalContext.Provider>
    );
};
