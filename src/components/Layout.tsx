import React from 'react';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-base)]">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto relative scroll-smooth px-12 pt-12">
          <div className="max-w-[1600px] mx-auto space-y-24 pb-32">
            {children}
          </div>
          
          {/* Cinematic Lighting: Off-screen light sources */}
          <div className="fixed top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--gold-primary)]/5 rounded-full blur-[180px] pointer-events-none" />
          <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[var(--accent-blue)]/10 rounded-full blur-[140px] pointer-events-none opacity-40 transition-opacity duration-[3s]" />
          
          {/* Grain effect overlay for premium texture */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </main>
      </div>
    </div>
  );
};

export default Layout;


