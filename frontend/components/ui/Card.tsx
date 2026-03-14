import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

const Card = ({ children, className = "", padding = "p-6" }: CardProps) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${padding} ${className}`}>
    {children}
  </div>
);

export default Card;
