import React from 'react';
import Icon from './Icon';
import Card from './Card';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext: string;
  trend?: string;
  trendColor?: string;
}

const StatsCard = ({ icon, label, value, subtext, trend, trendColor }: StatsCardProps) => {
  const getIconColorClasses = (iconName: string) => {
    switch (iconName) {
      case 'bed': return 'bg-orange-50 text-orange-600';
      case 'door_front': 
      case 'meeting_room': return 'bg-emerald-50 text-emerald-600';
      case 'warning': return 'bg-amber-50 text-amber-600';
      case 'engineering': return 'bg-purple-50 text-purple-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColorClasses(icon)}`}>
          <Icon name={icon} className="material-symbols-outlined" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${trendColor || 'text-slate-400'}`}>
          {trend || 'Total'}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

export default StatsCard;
