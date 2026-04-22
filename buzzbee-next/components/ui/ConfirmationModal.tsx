'use client';

import React from 'react';
import { Modal } from './Modal';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  requiresNote?: boolean;
  notePlaceholder?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  requiresNote = false,
  notePlaceholder = 'Enter reason or note here...',
}: ConfirmationModalProps) => {
  const [note, setNote] = React.useState('');

  const handleConfirm = () => {
    onConfirm(requiresNote ? note : undefined);
    setNote('');
    onClose();
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertCircle className="text-red-600" size={32} />,
          button: 'bg-red-600 hover:bg-red-700 text-white',
          bg: 'bg-red-50',
        };
      case 'warning':
        return {
          icon: <AlertCircle className="text-amber-600" size={32} />,
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
          bg: 'bg-amber-50',
        };
      default:
        return {
          icon: <HelpCircle className="text-blue-600" size={32} />,
          button: 'bg-brand-coral hover:bg-brand-coral/90 text-white',
          bg: 'bg-blue-50',
        };
    }
  };

  const colors = getColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6`}
        >
          {colors.icon}
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>

        {requiresNote && (
          <div className="w-full mb-6 text-left">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              {notePlaceholder}
            </label>
            <textarea
              className="w-full p-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-coral/20 min-h-[100px] transition-all"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Your note..."
            />
          </div>
        )}

        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={requiresNote && !note.trim()}
            className={`flex-1 py-3 px-6 rounded-xl ${colors.button} shadow-lg shadow-brand-coral/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
