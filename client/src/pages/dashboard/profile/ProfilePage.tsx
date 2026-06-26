import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../../../animations/variants';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profile.service';
import { AvatarUploader } from '../../../components/profile/AvatarUploader';
import { StatisticsGrid } from '../../../components/profile/StatisticsGrid';
import { Edit2, Save, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const handleSave = async () => {
    try {
      const data = await profileApi.updateProfile(formData);
      updateUser({ name: data.name, bio: data.bio });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-5xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-wide mb-2 uppercase">My Profile</h1>
          <p className="text-muted-foreground">Manage your identity and view statistics.</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-border">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <AvatarUploader />
        
        <div className="flex-1 text-center md:text-left z-10">
          {isEditing ? (
            <div className="space-y-4 max-w-md">
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xl font-medium focus:outline-none focus:border-primary"
                placeholder="Display Name"
              />
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 resize-none focus:outline-none focus:border-primary"
                placeholder="Write a short bio..."
                rows={3}
              />
              <div className="flex gap-2 justify-center md:justify-start">
                <Button onClick={handleSave} size="sm" className="gap-2">
                  <Save className="w-4 h-4" /> Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} size="sm" className="gap-2">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold text-foreground mb-2 flex items-center justify-center md:justify-start gap-3">
                {user?.name}
                <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto md:mx-0">
                {user?.bio || 'No bio provided. Click the edit icon to add one.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start text-sm">
                <span className="px-3 py-1 rounded-full bg-foreground/5 text-muted-foreground border border-border">
                  Member since {new Date(user?.createdAt || new Date()).getFullYear()}
                </span>
                <span className="px-3 py-1 rounded-full bg-foreground/5 text-muted-foreground border border-border">
                  Timezone: {user?.timezone}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section>
        <h3 className="text-lg font-medium mb-4 uppercase tracking-wider text-muted-foreground">Statistics Overview</h3>
        <StatisticsGrid />
      </section>
    </motion.div>
  );
};

export default ProfilePage;
