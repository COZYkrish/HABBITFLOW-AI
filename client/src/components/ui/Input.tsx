import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-md px-4 py-2 text-sm text-foreground',
            'transition-colors placeholder:text-muted-foreground/60',
            'hover:bg-white/20 dark:hover:bg-white/5',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus-visible:ring-red-500/30 focus-visible:border-red-500/50',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[11px] font-medium text-red-500 tracking-wide" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
