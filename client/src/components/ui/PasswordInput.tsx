import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './Input';
import { cn } from '../../utils/cn';

interface PasswordInputProps extends InputProps {
  showStrength?: boolean;
}

const calculateStrength = (password: string) => {
  let score = 0;
  if (!password) return score;
  if (password.length > 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const strength = calculateStrength(String(value || ''));

    const getStrengthColor = () => {
      if (strength === 0) return 'bg-border';
      if (strength === 1) return 'bg-red-500';
      if (strength === 2) return 'bg-orange-500';
      if (strength === 3) return 'bg-amber-500';
      return 'bg-green-500';
    };

    const getStrengthText = () => {
      if (strength === 0) return '';
      if (strength === 1) return 'Weak';
      if (strength === 2) return 'Fair';
      if (strength === 3) return 'Good';
      return 'Strong';
    };

    return (
      <div className="w-full relative">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn('pr-10', className)}
            value={value}
            onChange={onChange}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {showStrength && value && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-1 flex-1 max-w-[120px]">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    level <= strength ? getStrengthColor() : 'bg-border'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {getStrengthText()}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
