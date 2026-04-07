import React, { useState } from 'react';
import Layout from './components/Layout';
import LeadsTable from './features/leads/LeadsTable';
import SaifStatusCard from './features/dashboard/SaifStatusCard';
import MobileHome from './features/dashboard/MobileHome';
import OutboundPanel from './features/outbound/OutboundPanel';
import CrmPortal from './features/crm/CrmPortal';

import { useLeads } from './hooks/useLeads';
import { Sparkles, ShieldCheck, BrainCircuit, BarChart3, Settings as SettingsIcon } from 'lucide-react';

// New specialized views
const SaifSettingsView: React.FC = () => (

  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="space-y-4">
      <h2 className="text-5xl font-serif font-bold text-[var(--gold-primary)]">Saif Settings</h2>
      <p className="text-[var(--text-secondary)] text-xl font-light max-w-2xl">Customize how Saif talks to leads.</p>

    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="p-10 bg-[var(--bg-low)] rounded-[2.5rem] border border-white/5 cinematic-shadow space-y-8">
        <div className="flex items-center gap-4 text-[var(--gold-primary)]">
          <BrainCircuit size={24} />
          <h3 className="text-xs uppercase tracking-[0.4em] font-bold">Personality</h3>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">How Saif Should Speak</label>
          <textarea 
            className="w-full bg-[var(--bg-mid)] border border-white/5 rounded-2xl p-6 text-[var(--text-primary)] font-serif italic text-lg leading-relaxed focus:outline-none focus:border-[var(--gold-primary)]/20 transition-all h-64"
            defaultValue="You are Saif, a highly sophisticated luxury real estate concierge for Skyline Properties in Dubai. Your tone is elegant, professional, and high-energy..."

          />
        </div>
      </div>

      <div className="p-10 bg-[var(--bg-low)] rounded-[2.5rem] border border-white/5 cinematic-shadow space-y-8">
        <div className="flex items-center gap-4 text-[var(--gold-primary)]">
          <ShieldCheck size={24} />
          <h3 className="text-xs uppercase tracking-[0.4em] font-bold">What to Look For</h3>
        </div>
        <div className="space-y-6">
          {[
            "Check for high budgets",
            "Ask about property type",
            "Get their contact info",
            "Check if they're ready soon"
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-[var(--bg-mid)] rounded-2xl border border-white/5">
              <span className="text-sm font-medium text-[var(--text-primary)]">{item}</span>
              <div className="w-10 h-5 bg-[var(--gold-primary)] rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsView: React.FC = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="space-y-4">
      <h2 className="text-5xl font-serif font-bold text-[var(--gold-primary)]">How Saif is Doing</h2>
      <p className="text-[var(--text-secondary)] text-xl font-light max-w-2xl">See how many leads turn into viewings.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 p-10 bg-[var(--bg-low)] rounded-[2.5rem] border border-white/5 cinematic-shadow h-96 flex flex-col justify-center items-center text-[var(--text-muted)] gap-4">
        <BarChart3 size={48} className="opacity-20" />
        <p className="font-serif italic text-xl">Leads to Viewings Chart</p>
      </div>
      <div className="space-y-12">
        <div className="p-10 bg-[var(--bg-low)] rounded-[2.5rem] border border-white/5 cinematic-shadow h-full">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--gold-primary)] mb-8">Customer Feelings</h3>
          <div className="space-y-6">
            {['Happy', 'Neutral', 'Curious'].map((label, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span>{label}</span>
                  <span>{85 - (i * 20)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-high)] rounded-full overflow-hidden">
                  <div className="h-full gold-gradient" style={{ width: `${85 - (i * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { leads, loading } = useLeads();
  const outboundLeads = leads.filter((lead) => lead.call_type === 'outbound');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-12 group">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[var(--gold-primary)] font-bold text-[11px] uppercase tracking-[0.5em] animate-in fade-in slide-in-from-left-4 duration-1000">
                  <Sparkles size={16} />
                  <span>Skyline Agency Intelligence</span>
                </div>
                
                <h1 className="text-6xl font-bold tracking-tight font-serif leading-none">
                  Agency <br />
                  <span className="gold-text">Command Center</span>
                </h1>

                <p className="text-[var(--text-secondary)] text-xl max-w-2xl font-light leading-relaxed">
                  Orchestrating high-value property interactions in Dubai through advanced AI concierges and real-time elite data.
                </p>
              </div>
            </section>


            <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
              <SaifStatusCard />
              <div className="bg-[var(--bg-low)] rounded-[2rem] p-8 cinematic-shadow border border-white/5">
                <h3 className="text-xs uppercase tracking-[0.35em] font-bold text-[var(--text-muted)] mb-8">Outbound Priority Queue</h3>
                <OutboundPanel leads={outboundLeads} />
              </div>
            </section>

            <section className="space-y-10 pt-12">
              <div className="bg-[var(--bg-low)] rounded-[2rem] p-10 cinematic-shadow border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold-primary)]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[var(--gold-primary)]/10 transition-colors" />
                <LeadsTable leads={leads.slice(0, 8)} loading={loading} />
              </div>
            </section>
          </>
        );
      case 'crm':
        return <CrmPortal leads={leads} />;

      case 'leads':
        return (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-bold text-[var(--gold-primary)]">Lead Ledger</h2>
              <p className="text-[var(--text-secondary)]">Live inbound and outbound records from voice and CRM pipelines.</p>
            </div>
            <div className="bg-[var(--bg-low)] rounded-[2rem] p-10 cinematic-shadow border border-white/5">
              <LeadsTable leads={leads} loading={loading} />
            </div>
          </section>
        );

      case 'outbound':
        return (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-bold text-[var(--gold-primary)]">Outbound Campaign Board</h2>
              <p className="text-[var(--text-secondary)]">Prioritize high-value callbacks and monitor AI scheduling progress.</p>
            </div>
            <div className="bg-[var(--bg-low)] rounded-[2rem] p-10 cinematic-shadow border border-white/5">
              <OutboundPanel leads={outboundLeads} />
            </div>
          </section>
        );

      case 'saif':
        return <SaifSettingsView />;

      case 'analytics':
        return <AnalyticsView />;
      default:
        return (
          <div className="py-32 text-center space-y-6">
            <SettingsIcon size={64} className="mx-auto text-[var(--text-muted)] opacity-20" />
            <h2 className="text-3xl font-serif text-[var(--text-muted)] italic">Module details under encryption</h2>
          </div>
        );
    }
  };

  return (
    <>
      {/* Mobile-only Home / Voice Interaction View */}
      <MobileHome 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        leads={leads} 
        loading={loading} 
      />

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      </div>
    </>
  );
};

export default App;
