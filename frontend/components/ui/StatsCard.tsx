import React from 'react';
import { motion } from 'framer-motion';

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext: string;
  trend?: string;
  trendColor?: string;
  index?: number;
}

const StatsCard = ({ icon, label, value, subtext, trend, trendColor, index = 0 }: StatsCardProps) => {
  const getGradient = (iconName: string) => {
    switch (iconName) {
      case 'bed': return 'from-[#B8E3E9]/60 to-[#F8FAFC]';
      case 'door_front': 
      case 'meeting_room': return 'from-[#4F7C82]/20 to-[#B8E3E9]/10';
      case 'warning': return 'from-[#B8E3E9]/40 to-emerald-50/30';
      case 'engineering': return 'from-[#4F7C82]/10 to-[#B8E3E9]/30';
      default: return 'from-slate-50 to-white';
    }
  };

  const getTextColor = (iconName: string) => {
    switch (iconName) {
      case 'bed': return 'text-[#0B2E33]';
      case 'door_front': 
      case 'meeting_room': return 'text-[#4F7C82]';
      case 'warning': return 'text-emerald-800';
      case 'engineering': return 'text-[#0B2E33]';
      default: return 'text-slate-800';
    }
  };

  const textColor = getTextColor(icon);

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
        className={`rounded-[2.5rem] p-8 shadow-sm border border-white bg-gradient-to-br ${getGradient(icon)} relative overflow-hidden group hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500`}
    >
        <div className="flex items-center justify-between mb-8 relative z-10">
            <div className={`p-3 bg-white/60 backdrop-blur-sm rounded-2xl ${textColor} flex items-center justify-center shadow-sm`}>
                <Icon name={icon} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ${textColor}`}>
                {label}
            </span>
        </div>
        <div className="relative z-10">
            <p className={`text-5xl font-black ${textColor} tracking-tighter`}>{value}</p>
            <p className={`mt-4 text-[11px] font-black uppercase tracking-widest opacity-60 ${textColor}`}>{subtext}</p>
        </div>
        {/* Glass decorative element */}
        <div className="absolute -right-6 -bottom-6 size-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
    </motion.div>
  );
};

export default StatsCard;
