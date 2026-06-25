import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { AuthService } from '../../api/auth.service';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.forgotPassword(data.email);
      // We always show success to prevent email enumeration
      setIsSent(true);
    } catch (error) {
      // In a real app we might want to handle network errors specifically,
      // but for security we treat most things as success.
      setIsSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-foreground/70" />
        </div>
        <h1 className="text-3xl font-thin tracking-tight mb-4">Check your email</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          If an account exists for that email, we have sent instructions on how to reset your password.
        </p>
        <Button onClick={() => window.location.href = '/auth/login'} variant="outline" className="w-full h-12 rounded-xl">
          Return to Login
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Link
        to="/auth/login"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-thin tracking-tight mb-2">Reset Password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            error={errors.email?.message}
            autoComplete="email"
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl mt-4" disabled={isLoading}>
          {isLoading ? 'Sending instructions...' : 'Send instructions'}
        </Button>
      </form>
    </motion.div>
  );
}
