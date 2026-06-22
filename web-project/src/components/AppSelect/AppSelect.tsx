import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './AppSelect.css';

export interface AppSelectOption {
  value: string | number;
  label: string;
}

interface AppSelectProps {
  options: AppSelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
}

export const AppSelect: React.FC<AppSelectProps> = ({ options, value, onChange, placeholder = 'Selecione...', label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`app-select-wrapper ${isOpen ? 'open-wrapper' : ''}`} ref={containerRef}>
      {label && <label className="app-select-label">{label}</label>}
      <div 
        className={`app-select-box ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'selected-text' : 'placeholder-text'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className="app-select-icon" />
      </div>
      
      {isOpen && (
        <ul className="app-select-dropdown animate-fade-in">
          {options.length === 0 ? (
            <li className="app-select-empty">Nenhuma opção disponível</li>
          ) : (
            options.map((opt) => (
              <li 
                key={opt.value} 
                className={`app-select-option ${opt.value === value ? 'active' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
