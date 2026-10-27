import React from 'react';
import { BloodGroup } from '../../types';

interface BloodGroupBadgeProps {
  group?: BloodGroup | string;
  bloodGroup?: BloodGroup | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'subtle';
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  bloodGroup,
  size = 'md',
  variant = 'solid',
  className = '',
}) => {
  const displayGroup = (group || bloodGroup || 'O+').toString();
  const isNegative = displayGroup.includes('-');

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold tracking-tight',
    md: 'text-sm px-2.5 py-1 font-bold tracking-tight',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
    xl: 'text-2xl px-5 py-2.5 font-extrabold',
  };

  let variantClass = '';
  if (variant === 'solid') {
    variantClass = isNegative
      ? 'bg-[#8F1D25] text-white shadow-sm ring-1 ring-red-950/20'
      : 'bg-[#B4232C] text-white shadow-sm ring-1 ring-red-900/20';
  } else if (variant === 'outline') {
    variantClass = isNegative
      ? 'border border-[#8F1D25] text-[#8F1D25] bg-red-50/50'
      : 'border border-[#B4232C] text-[#B4232C] bg-red-50/50';
  } else {
    variantClass = 'bg-red-100 text-[#8F1D25]';
  }

  const badgeId = `blood-badge-${displayGroup.replace('+', 'pos').replace('-', 'neg')}`;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-mono select-none ${sizeClasses[size]} ${variantClass} ${className}`}
      id={badgeId}
    >
      {displayGroup}
    </span>
  );
};
