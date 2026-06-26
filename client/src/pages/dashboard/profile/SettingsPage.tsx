import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profile.service';
import { AvatarUploader } from '../../../components/profile/AvatarUploader';
import { StatisticsGrid } from '../../../components/profile/StatisticsGrid';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = await profileApi.updateProfile({
        name: formData.name,
        bio: formData.bio,
      });
      updateUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">General Settings</h1>
        <p className="text-text-secondary">Manage your public profile and personal details.</p>
      </div>

      <section>
        <AvatarUploader />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Display Name</label>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself"
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder:text-text-muted resize-none"
              maxLength={500}
            />
            <div className="text-xs text-text-muted text-right">
              {formData.bio.length} / 500
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" disabled={isSaving || (formData.name === user?.name && formData.bio === (user?.bio || ''))}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </section>

      <section className="pt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-6">Your Statistics</h2>
        <StatisticsGrid />
      </section>
    </motion.div>
  );
};

export default SettingsPage;
