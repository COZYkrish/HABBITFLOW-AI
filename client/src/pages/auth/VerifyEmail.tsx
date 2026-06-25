import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { AuthService } from '../../api/auth.service';
import { Button } from '../../components/ui/Button';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verify = async () => {
      try {
        const res = await AuthService.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed or link expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto text-center"
    >
      <div className="glass-card rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-foreground/50 animate-spin mb-6" />
            <h1 className="text-2xl font-thin tracking-tight mb-2">Verifying Email</h1>
            <p className="text-muted-foreground text-sm">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-6" />
            <h1 className="text-2xl font-thin tracking-tight mb-2">Verified!</h1>
            <p className="text-muted-foreground text-sm mb-8">{message}</p>
            <Button onClick={() => window.location.href = '/auth/login'} className="w-full rounded-xl">
              Continue to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mb-6" />
            <h1 className="text-2xl font-thin tracking-tight mb-2">Verification Failed</h1>
            <p className="text-muted-foreground text-sm mb-8">{message}</p>
            <Button onClick={() => window.location.href = '/auth/login'} className="w-full rounded-xl">
              Back to Login
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
