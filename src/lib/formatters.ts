import { ConversationStatus } from '../types';

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (isNaN(date.getTime())) return '';

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 45) return 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatExactTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatFullDateTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string): { bg: string; text: string; border: string } {
  const colors = [
    { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getStatusBadge(status: ConversationStatus) {
  switch (status) {
    case 'open':
      return {
        label: 'Open',
        classes: 'bg-blue-50 text-blue-700 border-blue-200/80',
        dotColor: 'bg-blue-500',
      };
    case 'pending':
      return {
        label: 'Pending',
        classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dotColor: 'bg-amber-500',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dotColor: 'bg-emerald-500',
      };
    case 'closed':
      return {
        label: 'Closed',
        classes: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        dotColor: 'bg-zinc-400',
      };
  }
}
