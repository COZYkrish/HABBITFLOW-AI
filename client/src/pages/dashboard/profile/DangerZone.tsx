import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../../../animations/variants';
import { profileApi } from '../../../api/profile.service';
import { useAuthStore } from '../../../store/authStore';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const DangerZone = () => {
  const { logout } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    try {
      setIsDeleting(true);
      await profileApi.deleteAccount();
      logout();
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl"
    >
      <h3 className="text-2xl font-semibold mb-2 text-red-500">Danger Zone</h3>
      <p className="text-muted-foreground mb-8">Irreversible actions for your account.</p>

      <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
        <h4 className="text-lg font-medium flex items-center gap-2 text-red-500 mb-2">
          <AlertTriangle className="w-5 h-5" />
          Delete Account
        </h4>
        <p className="text-sm text-foreground/80 mb-6">
          Once you delete your account, there is no going back. Please be certain. 
          All your habits, statistics, and history will be permanently removed.
        </p>

        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium mb-2">Type <span className="font-mono bg-foreground/10 px-1 py-0.5 rounded">DELETE</span> to confirm</label>
            <input 
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-all"
              placeholder="DELETE"
            />
          </div>
          <Button 
            variant="outline"
            className="w-full border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
            disabled={confirmText !== 'DELETE' || isDeleting}
            
            onClick={handleDelete}
          >
            Permanently Delete Account
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DangerZone;
