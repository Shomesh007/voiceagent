import { 
  LayoutDashboard, 
  Users, 
  PhoneOutgoing, 
  Settings, 
  TrendingUp,
  BrainCircuit,
  BriefcaseBusiness
} from 'lucide-react';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'Send Leads', icon: BriefcaseBusiness },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'outbound', label: 'Calls to Make', icon: PhoneOutgoing },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'saif', label: 'Saif', icon: BrainCircuit },

    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-[var(--bg-low)] flex flex-col h-full relative z-20">
      <div className="p-8 pb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center cinematic-shadow">
            <span className="text-black font-bold text-2xl font-serif">S</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-[0.1em] uppercase font-serif text-[var(--gold-primary)]">GSV</h1>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.4em] font-bold">Properties Dubai</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] font-bold mb-4 px-4">Navigation</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-[var(--bg-high)] text-[var(--gold-primary)] cinematic-shadow' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-mid)]/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon size={22} className={activeTab === item.id ? 'text-[var(--gold-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'} />
              <span className="text-[13px] font-semibold tracking-wide">{item.label}</span>
            </div>
            {activeTab === item.id && <div className="w-1.5 h-1.5 bg-[var(--gold-primary)] rounded-full cinematic-shadow" />}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-6 rounded-2xl bg-[var(--bg-mid)] relative overflow-hidden group border border-[var(--gold-primary)]/5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--gold-primary)]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[var(--gold-primary)]/10 transition-colors" />
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest leading-relaxed relative z-10 font-bold">
            Saif
          </p>

          <div className="flex items-center gap-2 mt-3 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 saif-pulse" />

            <span className="text-[11px] text-[var(--text-secondary)] font-bold tracking-wide">Ready to work</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-muted)]">v2.4.9</span>
            <span className="text-[10px] text-[var(--text-muted)] font-serif italic text-right">Encrypted</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

