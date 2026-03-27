'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatsCard from '@/components/ui/StatsCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/superadmin/dashboard-overview');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch super admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
        <p className="text-sm font-black text-[#4F7C82] uppercase tracking-[0.2em]">Synchronizing Platform Data...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    registeredHostels: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    totalComplaints: 0
  };

  const topHostels = data?.topRatedHostels || [];
  const recentActivities = data?.recentActivity || [];

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-[#0B2E33] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-[#0B2E33]/20">
          <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8E3E9] opacity-80">Platform Command Center</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-4 mb-6 leading-none">
                  System <span className="text-[#B8E3E9]">Architecture</span> Overview
              </h1>
              <p className="max-w-xl text-white/50 font-medium leading-relaxed">
                  Monitor platform-wide activity, manage hostel registrations, and oversee user engagements from one central hub.
              </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 translate-x-20"></div>
          <Icon name="monitoring" className="absolute -bottom-10 -right-10 text-[200px] text-white/5 rotate-12" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon="domain" 
          label="Registered" 
          value={stats.registeredHostels} 
          subtext="Verified Hostels" 
          index={0}
        />
        <StatsCard 
          icon="pending_actions" 
          label="Pending" 
          value={stats.pendingApprovals} 
          subtext="Need Review" 
          index={1}
        />
        <StatsCard 
          icon="group" 
          label="Community" 
          value={stats.activeUsers} 
          subtext="Active Accounts" 
          index={2}
        />
        <StatsCard 
          icon="error" 
          label="Issues" 
          value={stats.totalComplaints} 
          subtext="Logged Complaints" 
          index={3}
        />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Performance Chart (Placeholder UI with theme styling) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">platform growth</h2>
              <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.15em] mt-1 opacity-70">Monthly Registration metrics</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4 bg-[#F8FAFC] rounded-[2rem] border border-slate-50 p-6 relative overflow-hidden group">
            {/* Simple CSS bars for visualization */}
            {[45, 60, 40, 80, 55, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full bg-[#B8E3E9]/40 rounded-t-xl relative overflow-hidden transition-all duration-700 hover:bg-[#0B2E33] group`}
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/20"></div>
                </div>
                <span className="text-[9px] font-black text-[#4F7C82] uppercase tracking-tighter">OCT {20 + i}</span>
              </div>
            ))}
            <Icon name="trending_up" className="absolute top-6 right-8 text-[#B8E3E9] text-4xl opacity-50" />
          </div>
        </div>

        {/* Action Items List */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">activity</h2>
            <button className="size-10 rounded-xl bg-[#F8FAFC] text-[#4F7C82] flex items-center justify-center hover:bg-[#B8E3E9]/20 transition-all">
              <Icon name="more_horiz" />
            </button>
          </div>
          <div className="space-y-6">
            {recentActivities.slice(0, 5).map((activity: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5 p-4 rounded-2xl hover:bg-[#F8FAFC] transition-all cursor-pointer group"
              >
                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform ${
                  i % 3 === 0 ? 'bg-amber-50 text-amber-600' : i % 2 === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <Icon name={i % 3 === 0 ? 'campaign' : i % 2 === 0 ? 'verified_user' : 'app_registration'} className="text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black text-[#0B2E33] truncate">{activity.title}</p>
                  <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-widest opacity-60 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {recentActivities.length === 0 && (
              <div className="py-20 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-[#B8E3E9]">
                <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest text-[#B8E3E9]">Quiet Day on the Platform</p>
              </div>
            )}
            <button 
              onClick={() => router.push('/superadmin/approvals')}
              className="w-full mt-6 py-4 bg-[#B8E3E9]/30 text-[#0B2E33] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#B8E3E9]/50 transition-all active:scale-95"
            >
              System Approvals
            </button>
          </div>
        </div>

      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}
