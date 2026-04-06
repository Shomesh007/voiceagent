import React, { useEffect, useRef } from 'react';
import type { TranscriptMessage } from '../../types';

interface LiveTranscriptProps {
  transcript: TranscriptMessage[];
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({ transcript }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  if (transcript.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center italic text-zinc-600 text-xs text-center px-8 border border-[#1E1E35] rounded-xl bg-[#0A0A0F]/50">
        Waiting for Saif to pick up...<br/>Start speaking when ready.
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-[200px] overflow-y-auto px-4 py-3 space-y-4 border border-[#1E1E35] rounded-xl bg-[#0A0A0F]/50 scroll-smooth"
    >
      {transcript.map((msg, i) => (
        <div 
          key={i} 
          className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] uppercase font-bold tracking-widest ${msg.role === 'user' ? 'text-zinc-500' : 'text-[#C9A84C]'}`}>
              {msg.role === 'user' ? 'You' : 'Saif'}
            </span>
          </div>
          <p className={`text-xs p-3 rounded-2xl max-w-[85%] ${
            msg.role === 'user' 
              ? 'bg-[#1A1A30] text-zinc-200 rounded-tr-none border border-[#1E1E35]' 
              : 'bg-[#C9A84C]/10 text-zinc-100 rounded-tl-none border border-[#C9A84C]/20'
          }`}>
            {msg.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LiveTranscript;
