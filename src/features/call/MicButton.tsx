import React from 'react';
import { Mic, PhoneOff, Loader2 } from 'lucide-react';

interface MicButtonProps {
  status: 'idle' | 'connecting' | 'active' | 'ended';
  volume: number;
  onClick: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ status, volume, onClick }) => {
  const isActive = status === 'active';
  const isConnecting = status === 'connecting';

  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className={`relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] active:scale-90 ${
        isActive 
          ? 'bg-red-500 hover:bg-red-600 border-red-400/50' 
          : isConnecting 
            ? 'bg-[#1A1A30] border-[#1E1E35] cursor-wait' 
            : 'gold-gradient hover:scale-105 border-white/10'
      } border-2 overflow-hidden`}
    >
      {/* Soundwave effect when active */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: '100%',
                height: '100%',
                animation: 'ripple 2s infinite',
                animationDelay: `${i * 0.6}s`,
                transform: `scale(${1 + (volume * 1.5)})`
              }}
            />
          ))}
        </div>
      )}

      {isConnecting ? (
        <Loader2 className="animate-spin text-[#C9A84C]" size={24} />
      ) : isActive ? (
        <PhoneOff size={24} className="text-white relative z-10" />
      ) : (
        <Mic size={24} className="text-black relative z-10" />
      )}

      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </button>
  );
};

export default MicButton;
