import React, { useState } from 'react';
import MicButton from './MicButton';
import LiveTranscript from './LiveTranscript';
import { useVapi } from '../../hooks/useVapi';
import { Sparkles, X, Minimize2, Maximize2, Headset } from 'lucide-react';

const CallWidget: React.FC = () => {
  const { callStatus, transcript, volumeLevel, startCall, stopCall } = useVapi();
  const [minimized, setMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCall = () => {
    if (callStatus === 'idle' || callStatus === 'ended') {
      setIsOpen(true);
      startCall();
    } else {
      stopCall();
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  const active = callStatus === 'active' || callStatus === 'connecting';

  if (!isOpen && !active) {
    return (
      <div className="fixed bottom-8 right-8 z-50 slide-up">
        <button
          onClick={() => {
            setIsOpen(true);
            startCall();
          }}
          className="group flex items-center gap-4 bg-black border border-[#C9A84C]/40 p-1.5 pr-6 rounded-full shadow-[0_10px_50px_rgba(201,168,76,0.2)] hover:scale-105 hover:bg-[#0F0F1A] hover:border-[#C9A84C]/80 transition-all duration-300"
        >
          <div className="h-12 w-12 rounded-full gold-gradient flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Headset size={22} className="text-black" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] uppercase font-black tracking-widest text-[#C9A84C] leading-none mb-1">Live Agent</span>
            <p className="text-sm font-bold text-zinc-100 leading-none">Talk to Saif</p>
          </div>
          <Sparkles className="text-[#C9A84C] ml-2 animate-pulse" size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out ${minimized ? 'w-[200px]' : 'w-[380px]'} slide-up`}>
      <div className="glass-card-gold rounded-3xl overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] border-white/5 relative">
        {/* Header */}
        <div className="bg-[#1A1A30] px-6 py-4 flex items-center justify-between border-b border-[#1E1E35]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                <span className="text-[10px] font-bold text-black">AI</span>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#1A1A30] ${active ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-none">Saif Agent</h4>
              <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">
                {callStatus === 'connecting' ? 'Connecting...' : active ? 'On Call' : 'Call Ended'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setMinimized(!minimized)} className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
              {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!minimized && (
          <div className="p-6 bg-gradient-to-b from-[#0F0F1A] to-[#0A0A0F]">
            {/* Live Transcript Area */}
            <LiveTranscript transcript={transcript} />
            
            {/* Call Controls Area */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em]">Voice Activity</p>
              
              <div className="flex items-center gap-8">
                <div className="w-12 h-0.5 bg-[#1E1E35] relative">
                  <div 
                    className="absolute inset-y-0 right-0 bg-[#C9A84C]/50 transition-all duration-75"
                    style={{ width: `${Math.min(volumeLevel * 100 * 2, 100)}%` }}
                  />
                </div>
                
                <MicButton 
                  status={callStatus} 
                  volume={volumeLevel} 
                  onClick={toggleCall} 
                />

                <div className="w-12 h-0.5 bg-[#1E1E35] relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-[#C9A84C]/50 transition-all duration-75"
                    style={{ width: `${Math.min(volumeLevel * 100 * 2, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-zinc-500 text-[10px] font-medium text-center max-w-[280px] leading-relaxed">
                Saif is programmed for 7-point qualification: <br/>
                <b>Property, Finance, Project, Size, Nationality, Timeline & Budget.</b>
              </div>
            </div>
          </div>
        )}

        {minimized && (
          <div className="px-6 py-4 flex items-center justify-between bg-[#1A1A30]">
             <MicButton 
                  status={callStatus} 
                  volume={volumeLevel} 
                  onClick={toggleCall} 
                />
             <div className="text-[10px] text-[#C9A84C] font-bold animate-pulse uppercase tracking-widest">Live</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallWidget;
