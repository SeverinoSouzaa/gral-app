import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import './AppButton.css';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = `app-button ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className}`;

  return (
    <button className={baseClass} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="spinner" size={18} />
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
