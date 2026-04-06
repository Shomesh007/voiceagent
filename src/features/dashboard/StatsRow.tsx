import React from 'react';
import { Users, PhoneCall, Calendar, Target, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface StatsRowProps {
  stats: {
    totalLeads: number;
    callsToday: number;
    viewingsScheduled: number;
    conversionRate: number;
  };
}

const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  const cards = [
    { 
      label: 'Total Inbound Leads', 
      value: stats.totalLeads, 
      icon: Users, 
      trend: '+12.5%',
      isUp: true
    },
    { 
      label: 'AI Calls Today', 
      value: stats.callsToday, 
      icon: PhoneCall, 
      trend: '+5.2%',
      isUp: true
    },
    { 
      label: 'Viewings Scheduled', 
      value: stats.viewingsScheduled, 
      icon: Calendar, 
      trend: '+8.1%',
      isUp: true
    },
    { 
      label: 'Conversion Rate', 
      value: `${stats.conversionRate}%`, 
      icon: Target, 
      trend: '-2.4%',
      isUp: false
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card, i) => (
        <div key={i} className="group p-8 rounded-3xl bg-[var(--bg-low)] hover:bg-[var(--bg-mid)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-48 border border-white/5">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-2xl bg-[var(--bg-mid)] text-[var(--gold-primary)] group-hover:scale-110 transition-transform duration-500`}>
              <card.icon size={24} />
            </div>
            <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full ${card.isUp ? 'text-green-400 bg-green-400/5' : 'text-red-400 bg-red-400/5'}`}>
              {card.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {card.trend}
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">{card.label}</h3>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{card.value}</p>
              <ArrowUpRight size={20} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold-primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[var(--gold-primary)]/10 transition-colors" />
        </div>
      ))}
    </div>
  );
};

export default StatsRow;

