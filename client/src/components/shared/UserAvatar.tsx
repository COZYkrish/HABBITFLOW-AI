import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ name, src, size = 'md' }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : <User className="w-1/2 h-1/2" />;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium overflow-hidden shrink-0 ${sizeClasses[size]}`}
      title={name}
    >
      {src ? (
        <img src={src} alt={name || 'User Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="flex items-center justify-center w-full h-full text-xs">
          {initials}
        </span>
      )}
    </div>
  );
};
