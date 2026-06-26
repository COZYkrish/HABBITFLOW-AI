import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { profileApi } from '../../api/profile.service';
import { apiClient } from '../../api/axios';

export const AvatarUploader = () => {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = await profileApi.uploadAvatar(file);
      updateUser({ avatar: data.avatar });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      // In a real app we'd show a toast here
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    const baseURL = apiClient.defaults.baseURL?.replace('/api/v1', '') || 'http://localhost:5000';
    return `${baseURL}${user.avatar}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-foreground/5 border-2 border-border relative flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-medium text-muted-foreground">{getInitials()}</span>
        )}
        
        {/* Hover overlay */}
        <div 
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
      />
    </div>
  );
};
