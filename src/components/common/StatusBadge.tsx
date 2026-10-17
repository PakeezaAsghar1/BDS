import React from 'react';
import { RequestStatus, UrgencyLevel, DonorAvailability, VerificationStatus } from '../../types';

interface StatusBadgeProps {
  status: RequestStatus | UrgencyLevel | DonorAvailability | VerificationStatus | string;
  type?: 'request' | 'urgency' | 'availability' | 'verification' | 'general';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general', className = '' }) => {
  let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';

  if (type === 'urgency' || status === 'Critical' || status === 'Urgent' || status === 'Scheduled') {
    if (status === 'Critical') {
      badgeStyle = 'bg-red-100 text-red-800 border-red-200 font-semibold animate-pulse';
    } else if (status === 'Urgent') {
      badgeStyle = 'bg-amber-100 text-amber-900 border-amber-200 font-medium';
    } else {
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
    }
  } else if (type === 'availability' || status === 'Available' || status === 'Unavailable' || status === 'Temporarily Ineligible') {
    if (status === 'Available') {
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
    } else if (status === 'Temporarily Ineligible') {
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    } else {
      badgeStyle = 'bg-gray-100 text-gray-600 border-gray-200';
    }
  } else if (type === 'verification' || status === 'Verified' || status === 'Pending' || status === 'Rejected') {
    if (status === 'Verified') {
      badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium';
    } else if (status === 'Pending') {
      badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      badgeStyle = 'bg-rose-100 text-rose-800 border-rose-200';
    }
  } else {
    // Request statuses
    switch (status) {
      case 'Submitted':
        badgeStyle = 'bg-slate-100 text-slate-800 border-slate-200';
        break;
      case 'Under Review':
        badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'Donor Search Active':
        badgeStyle = 'bg-blue-100 text-blue-900 border-blue-300 font-medium';
        break;
      case 'Donor Found':
        badgeStyle = 'bg-indigo-100 text-indigo-900 border-indigo-200 font-medium';
        break;
      case 'Donation Confirmed':
        badgeStyle = 'bg-teal-100 text-teal-900 border-teal-200 font-medium';
        break;
      case 'Completed':
        badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-200 font-semibold';
        break;
      case 'Cancelled':
      case 'Expired':
        badgeStyle = 'bg-gray-100 text-gray-500 border-gray-200';
        break;
      default:
        badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${badgeStyle} ${className}`}
      id={`status-badge-${String(status).toLowerCase().replace(/\s+/g, '-')}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75 inline-block" />
      {status}
    </span>
  );
};
