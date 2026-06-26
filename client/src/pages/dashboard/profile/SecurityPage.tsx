import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profile.service';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SessionManager } from '../../../components/profile/SessionManager';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SecurityPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      await profileApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await profileApi.deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error: any) {
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Security</h1>
        <p className="text-text-secondary">Manage your password, active sessions, and account security.</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Change Password</h2>
        </div>
        <form onSubmit={submitPasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Current Password</label>
            <Input 
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">New Password</label>
            <Input 
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
            <Input 
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}>
              {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </div>
        </form>
      </section>

      <section className="pt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-6">Active Sessions</h2>
        <p className="text-text-secondary mb-4 text-sm">
          These are devices that have logged into your account. Revoke any sessions that you do not recognize.
        </p>
        <SessionManager />
      </section>

      <section className="pt-8 border-t border-error/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-error" />
          <h2 className="text-xl font-semibold text-error">Danger Zone</h2>
        </div>
        <p className="text-text-secondary mb-6 text-sm">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        {!showDeleteConfirm ? (
          <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="border-error text-error hover:bg-error/10">
            Delete Account
          </Button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 rounded-xl border border-error/30 bg-error/5 space-y-4 max-w-xl"
          >
            <h3 className="font-semibold text-error">Are you absolutely sure?</h3>
            <p className="text-sm text-text-secondary">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-error hover:bg-error/90 text-white"
              >
                {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Yes, delete my account
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default SecurityPage;
