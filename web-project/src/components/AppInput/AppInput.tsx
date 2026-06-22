import React, { type InputHTMLAttributes } from 'react';
import './AppInput.css';

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className={`app-input-wrapper ${className}`}>
        {label && <label className="app-input-label">{label}</label>}
        
        <div className={`app-input-container ${error ? 'has-error' : ''} ${icon ? 'has-icon' : ''}`}>
          {icon && <span className="app-input-icon">{icon}</span>}
          <input
            ref={ref}
            className="app-input-field"
            {...props}
          />
        </div>
        
        {error && <span className="app-input-error">{error}</span>}
      </div>
    );
  }
);
AppInput.displayName = 'AppInput';
