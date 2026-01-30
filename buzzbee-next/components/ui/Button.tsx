'use client';

import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  icon,
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-brand-coral to-brand-peach text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-brand-navy text-white hover:opacity-90',
    outline: 'border-2 border-brand-coral text-brand-coral hover:bg-brand-coral/10',
    ghost: 'text-brand-navy hover:bg-brand-navy/10'
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};
