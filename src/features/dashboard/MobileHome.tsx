import React, { useState, useEffect, useRef } from 'react';
import { vapi, ASSISTANT_ID } from '../../lib/vapi';
import LeadsTable from '../leads/LeadsTable';
import { BrainCircuit, ShieldCheck } from 'lucide-react';
import type { Lead } from '../../types';

interface MobileHomeProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  leads: Lead[];
  loading: boolean;
}

const SaifSettingsView: React.FC = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="space-y-2">
      <h2 className="text-3xl font-serif font-bold text-[#e6c364]">Elite Intelligence</h2>
      <p className="text-white/60 text-sm font-light">Refine the cognitive parameters of your concierge.</p>
    </div>
    
    <div className="space-y-6">
      <div className="p-6 bg-[#0e0e0e] rounded-3xl border border-white/5 shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-[#e6c364]">
          <BrainCircuit size={20} />
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Base Personality</h3>
        </div>
        <textarea 
          className="w-full bg-[#131313] border border-white/5 rounded-2xl p-4 text-white font-serif italic text-sm leading-relaxed focus:outline-none focus:border-[#e6c364]/20 transition-all h-40"
          defaultValue="You are Saif, a highly sophisticated luxury real estate concierge for Skyline Properties in Dubai..."
        />
      </div>

      <div className="p-6 bg-[#0e0e0e] rounded-3xl border border-white/5 shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-[#e6c364]">
          <ShieldCheck size={20} />
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Guardrails</h3>
        </div>
        <div className="space-y-4">
          {["Verify Budget > $1M", "Confirm Location", "Capture Phone"].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#131313] rounded-2xl border border-white/5">
              <span className="text-xs font-medium text-white/80">{item}</span>
              <div className="w-8 h-4 bg-[#e6c364] rounded-full relative">
                <div className="absolute right-1 top-0.5 w-3 h-3 bg-black rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MobileHome: React.FC<MobileHomeProps> = ({ activeTab, setActiveTab, leads, loading }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onCallStart = () => {
      setIsCalling(true);
      setMessages([{ role: 'Saif', text: "Good evening. I am your concierge for Skyline Properties. How can I assist with your portfolio today?" }]);
    };
    const onCallEnd = () => {
      setIsCalling(false);
      setTranscript("");
    };
    const onMessage = (message: any) => {
      if (message.type === 'transcript') {
        if (message.transcriptType === 'partial') {
          setTranscript(message.transcript);
        } else if (message.transcriptType === 'final') {
          setMessages(prev => [...prev, { role: message.role === 'assistant' ? 'Saif' : 'You', text: message.transcript }]);
          setTranscript("");
        }
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  const handleToggleCall = () => {
    if (isCalling) {
      vapi.stop();
    } else {
      vapi.start(ASSISTANT_ID);
    }
  };

  const renderContent = () => {
    if (activeTab === 'leads') {
      return (
        <div className="pt-28 pb-32 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#e6c364]">Lead Ledger</h2>
            <p className="text-white/60 text-sm font-light">High-intent property interactions.</p>
          </div>
          <div className="bg-[#0e0e0e] rounded-[2.5rem] p-4 border border-white/5 shadow-2xl">
            <LeadsTable leads={leads} loading={loading} />
          </div>
        </div>
      );
    }

    if (activeTab === 'saif') {
      return (
        <div className="pt-28 pb-32 px-6">
          <SaifSettingsView />
        </div>
      );
    }

    // Default: Talk / Home
    return (
      <main className="flex-grow flex flex-col items-center pt-24 pb-36 px-6 max-w-lg mx-auto w-full justify-between animate-in fade-in duration-700">
        <div className="w-full flex flex-col items-center gap-6">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1c1b1b] rounded-full border border-white/5 cinematic-shadow">
            <span className={`w-2 h-2 rounded-full ${isCalling ? 'bg-emerald-500 saif-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-zinc-700'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
              {isCalling ? 'Saif is listening' : 'Saif is ready'}
            </span>
          </div>

          {/* Voice Interaction Visualizer Area */}
          <div className="relative flex items-center justify-center py-4">
            {/* Pulsing Rings */}
            <div className={`absolute w-64 h-64 border border-[#e6c364]/10 rounded-full transition-all duration-1000 ${isCalling ? 'scale-110 opacity-40 animate-pulse' : 'scale-100 opacity-20'}`}></div>
            <div className={`absolute w-48 h-48 border border-[#e6c364]/20 rounded-full transition-all duration-700 ${isCalling ? 'scale-105 animate-pulse' : 'scale-100'}`} style={{ animationDelay: '200ms' }}></div>
            
            {/* Main Microphone Button */}
            <button 
              onClick={handleToggleCall}
              className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-black mic-glow transition-all duration-500 active:scale-90 group ${
                isCalling ? 'bg-[#f2ca50] scale-105 shadow-[0_0_40px_rgba(242,202,80,0.4)]' : 'bg-[#e6c364] hover:scale-105'
              }`}
            >
              <span className={`material-symbols-outlined text-4xl ${isCalling ? 'animate-bounce' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {isCalling ? 'graphic_eq' : 'mic'}
              </span>
              {isCalling && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-[#e6c364] animate-ping opacity-30"></div>
                  <div className="absolute -inset-4 rounded-full border border-[#e6c364]/20 animate-pulse"></div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="w-full flex-grow flex flex-col py-6 max-h-[300px]">
          <h2 className="font-serif text-[10px] text-white/30 uppercase tracking-[0.4em] mb-4 text-center font-bold">Live Context</h2>
          <div className="w-full flex-grow bg-[#0e0e0e] rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col gap-4 overflow-hidden relative min-h-[160px]">
            <div 
              ref={scrollRef}
              className="w-full h-full overflow-y-auto pr-2 custom-scrollbar space-y-4"
            >
              {messages.length === 0 && !transcript && (
                <p className="text-white/20 font-serif italic text-center mt-12 text-xs">Initiate conversation to begin transcription...</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className="space-y-1">
                  <span className={`text-[8px] uppercase font-bold tracking-widest ${msg.role === 'Saif' ? 'text-[#e6c364]' : 'text-zinc-500'}`}>
                    {msg.role}
                  </span>
                  <p className={`font-body leading-relaxed ${msg.role === 'Saif' ? 'text-white/80 text-xs' : 'text-white font-medium text-xs'}`}>
                    {msg.text}
                  </p>
                </div>
              ))}
              {transcript && (
                <div className="space-y-1 animate-pulse">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-zinc-500">You</span>
                  <p className="text-white font-medium italic opacity-70 text-xs">
                    {transcript}...
                  </p>
                </div>
              )}
            </div>
            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0e0e0e] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full pb-2">
          <button 
            onClick={handleToggleCall}
            className={`w-full py-5 font-black rounded-xl text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
              isCalling 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-none' 
              : 'bg-[#e6c364] text-black shadow-[0_15px_35px_rgba(230,195,100,0.25)] hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            {isCalling ? 'Terminate Session' : 'Start Talking'}
          </button>
        </div>
      </main>
    );
  };

  return (
    <div className="md:hidden flex flex-col min-h-screen bg-[#131313] text-[#e5e2e1] font-['Manrope'] overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 h-20 bg-[#131313]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#e6c364] cursor-pointer">menu</span>
          <h1 className="font-serif text-[#e6c364] text-lg uppercase tracking-[0.2em] font-bold">Skyline Properties</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGwEOtyivAWZ4dkG3APDvxBvUty1CIX5-gUYUZl2oig1xy0z0wqesYhiEgNWtND_PxSgQR1l46HGVSxxIw2gXgiWuUrhsRuN97H3ktXW2wmER3wWYPRrJ-VhG98v_o_k-aUKaQXmRrr43NGTJjK77MZEX3Svfbb9SKP2nIW8T-JquoT2o9lqtnoqsrBmkrc6JjPebYIJ63xJFs1Kax-Fk1XczR0LqmVIbuyAa3VQSm_rBcg0rO-O9wPuWg-9kxGKEi5WofZPWyUM" 
            alt="Profile"
          />
        </div>
      </header>

      {renderContent()}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-10 pt-4 bg-[#131313]/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center rounded-2xl px-8 py-3 transition-all duration-500 ${
            activeTab === 'dashboard' ? 'bg-[#e6c364] text-black shadow-[0_0_20px_rgba(230,195,100,0.4)] scale-110' : 'text-[#4d4637] hover:text-[#e6c364]'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>mic</span>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1.5">Talk</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('leads')}
          className={`flex flex-col items-center justify-center rounded-2xl px-8 py-3 transition-all duration-500 ${
            activeTab === 'leads' ? 'bg-[#e6c364] text-black shadow-[0_0_20px_rgba(230,195,100,0.4)] scale-110' : 'text-[#4d4637] hover:text-[#e6c364]'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'leads' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1.5">Leads</span>
        </button>

        <button 
          onClick={() => setActiveTab('saif')}
          className={`flex flex-col items-center justify-center rounded-2xl px-8 py-3 transition-all duration-500 ${
            activeTab === 'saif' ? 'bg-[#e6c364] text-black shadow-[0_0_20px_rgba(230,195,100,0.4)] scale-110' : 'text-[#4d4637] hover:text-[#e6c364]'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'saif' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1.5">Elite</span>
        </button>
      </nav>

      {/* Aesthetic Background Elements */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-[#e6c364]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -left-20 w-80 h-80 bg-[#e6c364]/3 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

export default MobileHome;
