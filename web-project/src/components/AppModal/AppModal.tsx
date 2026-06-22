import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './AppModal.css';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function AppModal({ isOpen, onClose, title, children, footer, maxWidth = '500px' }: AppModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="app-modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="app-modal-content glass-panel" 
        style={{ maxWidth }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="app-modal-header">
          <h3>{title}</h3>
          <button className="app-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="app-modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="app-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
