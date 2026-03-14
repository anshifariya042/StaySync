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

const StatsCard = ({ icon, label, value, subtext, trend, trendColor }: StatsCardProps) => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <span className={`p-2 rounded-lg ${trendColor ? trendColor.replace('text-', 'bg-').replace('600', '100 dark:bg-') + '900/30' : 'bg-primary/10 dark:bg-primary/20'} ${trendColor || 'text-primary'}`}>
        <Icon name={icon} />
      </span>
      {trend ? (
        <span className={`text-xs font-semibold ${trendColor || 'text-slate-400 uppercase tracking-wider'}`}>{trend}</span>
      ) : (
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
      )}
    </div>
    <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{subtext}</p>
  </Card>
);

export default StatsCard;
