import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'in-progress' | 'resolved' | 'high-priority' | 'default';
  className?: string;
  dotColor?: string;
}

const Badge = ({ children, variant = 'default', className = "", dotColor }: BadgeProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'high-priority':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getDotColor = () => {
    if (dotColor) return dotColor;
    switch (variant) {
      case 'pending': return 'bg-amber-500';
      case 'in-progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'high-priority': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getVariantStyles()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`}></span>
      {children}
    </span>
  );
};

export default Badge;
