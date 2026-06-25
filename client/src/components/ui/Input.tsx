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
            'flex h-12 w-full rounded-xl border border-border bg-transparent px-4 py-2 text-sm text-foreground',
            'transition-colors placeholder:text-muted-foreground/60',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 focus-visible:border-foreground/30',
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
