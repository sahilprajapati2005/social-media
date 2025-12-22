/**
 * Formats a date to "Time Ago" style (e.g., "5m ago", "2h ago", "Just now")
 * Best for: Social Media Feeds, Comments, Notifications
 */
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  // Future date handling (prevent negative time)
  if (seconds < 0) return "Just now";

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + "y ago";

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mo ago";

  interval = Math.floor(seconds / 604800); // Weeks
  if (interval >= 1) return interval + "w ago";

  interval = Math.floor(seconds / 86400); // Days
  if (interval >= 1) return interval + "d ago";

  interval = Math.floor(seconds / 3600); // Hours
  if (interval >= 1) return interval + "h ago";

  interval = Math.floor(seconds / 60); // Minutes
  if (interval >= 1) return interval + "m ago";

  return "Just now";
};

/**
 * Formats a date to specific time (e.g., "10:30 AM")
 * Best for: Chat Message timestamps
 */
export const formatMessageTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats a date to standard date (e.g., "21 Dec 2025")
 * Best for: User Profiles, Account Creation Date
 */
export const formatDateStandard = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};