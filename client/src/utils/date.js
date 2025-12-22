import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Returns "5 minutes ago", "2 hours ago"
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};

// Returns "10:30 AM"
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'p');
};

// Returns "Oct 24, 2024"
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'MMM d, yyyy');
};