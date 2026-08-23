'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-extrabold rounded-2xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0e6670] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] min-h-[44px] min-w-[44px]';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white shadow-md hover:shadow-xl dark:from-[#e7b85b] dark:to-[#f3ca76] dark:text-[#102a2e]',
      secondary:
        'bg-white/10 hover:bg-white/20 text-[#e7b85b] border border-[#e7b85b]/40 backdrop-blur-md shadow-sm',
      outline:
        'border border-gray-300 dark:border-[#444] bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252323]',
      ghost:
        'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252323]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-2 space-x-1.5',
      md: 'text-sm px-5 py-2.5 space-x-2',
      lg: 'text-base px-7 py-3.5 space-x-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 text-current mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
