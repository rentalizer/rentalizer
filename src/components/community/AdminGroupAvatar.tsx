import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AdminGroupAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AdminGroupAvatarProps {
  size?: AdminGroupAvatarSize;
  className?: string;
  avatarClassName?: string;
  borderClassName?: string;
}

const containerSizeMap: Record<AdminGroupAvatarSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-16',
};

const avatarSizeMap: Record<AdminGroupAvatarSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
  xl: 'h-10 w-10',
};

export const AdminGroupAvatar: React.FC<AdminGroupAvatarProps> = ({
  size = 'md',
  className,
  avatarClassName,
  borderClassName = 'border-slate-800',
}) => {
  const containerClasses = containerSizeMap[size] ?? containerSizeMap.md;
  const avatarSizeClasses = avatarSizeMap[size] ?? avatarSizeMap.md;

  const sharedAvatarClasses = cn(
    avatarSizeClasses,
    'border-2',
    borderClassName,
    avatarClassName,
  );

  return (
    <div className={cn('relative', containerClasses, className)}>
      <Avatar
        className={cn(
          sharedAvatarClasses,
          'absolute left-0 top-1/2 -translate-y-1/2 z-20',
        )}
      >
        <AvatarImage
          src="/admin/adminRetalizer.jpg"
          alt="Admin 1"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[0.55rem]">
          A1
        </AvatarFallback>
      </Avatar>
      <Avatar
        className={cn(
          sharedAvatarClasses,
          'absolute top-1/2 -translate-y-1/2 z-10',
          size === 'xl' ? '-right-0' : 'right-0',
        )}
      >
        <AvatarImage
          src="/admin/adminRentalizer2.jpg"
          alt="Admin 2"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-[0.55rem]">
          A2
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
