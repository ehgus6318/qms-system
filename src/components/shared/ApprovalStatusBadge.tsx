'use client';

import { getStatusStyle } from '@/lib/qmsColors';
import type { ApprovalItemStatus } from '@/lib/approvalsData';
import type { RevisionStatus } from '@/lib/revisionsData';

type AnyStatus = ApprovalItemStatus | RevisionStatus | string;

interface ApprovalStatusBadgeProps {
  status: AnyStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
  urgency?: 'normal' | 'urgent' | 'critical';
}

export default function ApprovalStatusBadge({
  status,
  size = 'md',
  showDot = true,
  urgency,
}: ApprovalStatusBadgeProps) {
  const s = getStatusStyle(status);
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-[11px]';
  const px = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium ${textSize} ${px} ${s.badge}`}
    >
      {showDot && (
        <span
          className={`${dotSize} rounded-full flex-shrink-0 ${s.dot} ${
            urgency === 'urgent' || urgency === 'critical' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {status}
      {urgency === 'urgent' && (
        <span className="ml-0.5 text-[9px] font-bold text-orange-600">⚡</span>
      )}
      {urgency === 'critical' && (
        <span className="ml-0.5 text-[9px] font-bold text-red-600">🔴</span>
      )}
    </span>
  );
}
