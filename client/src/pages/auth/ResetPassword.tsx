import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { AuthService } from '../../api/auth.service';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password');

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-thin tracking-tight mb-2 text-red-500">Invalid Link</h1>
        <p className="text-muted-foreground text-sm">This password reset link is invalid or has expired.</p>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.resetPassword({ token, password: data.password });
      toast.success('Password reset successfully!');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-thin tracking-tight mb-2">Create New Password</h1>
        <p className="text-muted-foreground text-sm">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a new password"
            showStrength
            value={passwordValue}
            {...register('password')}
            error={errors.password?.message}
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your new password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl mt-4" disabled={isLoading}>
          {isLoading ? 'Resetting password...' : 'Reset Password'}
        </Button>
      </form>
    </motion.div>
  );
}
