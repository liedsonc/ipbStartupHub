'use client';

import React from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const baseClasses = 'relative flex shrink-0 overflow-hidden rounded-full transition-all duration-300';
  const fallbackClasses = 'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 font-bold text-white shadow-inner';

  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className} group`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="aspect-square h-full w-full object-cover"
          onError={(e) => {
            // If image fails to load, we could potentially show fallback
            // but for simplicity in this implementation we'll let it be
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      <div className={`${fallbackClasses} ${src ? 'absolute inset-0 -z-10' : ''}`}>
        {getInitials(name)}
      </div>
    </div>
  );
}
